import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutComplete(session);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const supabase = await createServiceClient();
  const meta = session.metadata!;

  const orderItems = JSON.parse(meta.order_items);
  const shippingAddress = JSON.parse(meta.shipping_address);

  // Upsert customer
  let customerId: string | null = null;
  const { data: customer } = await supabase
    .from("customers")
    .upsert(
      {
        email: session.customer_email!,
        name: meta.customer_name,
        phone: meta.customer_phone || null,
        shipping_address: shippingAddress,
      },
      { onConflict: "email" }
    )
    .select("id")
    .single();
  customerId = customer?.id ?? null;

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: meta.order_number,
      customer_id: customerId,
      customer_email: session.customer_email!,
      customer_name: meta.customer_name,
      shipping_address: shippingAddress,
      subtotal: parseFloat(meta.subtotal),
      shipping_cost: parseFloat(meta.shipping_cost),
      total: parseFloat(meta.total),
      status: "paid",
      stripe_payment_intent: session.payment_intent as string,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("Failed to create order:", orderError);
    return;
  }

  // Insert order items
  await supabase.from("order_items").insert(
    orderItems.map((item: {
      product_id: string;
      product_name: string;
      product_sku: string | null;
      quantity: number;
      unit_price: number;
      unit_cost: number;
      total_price: number;
    }) => ({
      order_id: order.id,
      ...item,
    }))
  );

  // Decrement stock
  for (const item of orderItems) {
    await supabase.rpc("decrement_stock", {
      p_product_id: item.product_id,
      p_quantity: item.quantity,
    });
  }
}
