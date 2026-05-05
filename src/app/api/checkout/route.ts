import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { generateOrderNumber } from "@/lib/utils";
import type { Product, ShippingAddress } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const { items, customer, shippingCost } = await req.json();

    const supabase = await createServiceClient();

    // Fetch and validate products
    const productIds = items.map((i: { productId: string }) => i.productId);
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds)
      .eq("is_active", true);

    if (productsError || !products?.length) {
      return NextResponse.json(
        { error: "One or more products are unavailable" },
        { status: 400 }
      );
    }

    const productMap = new Map<string, Product>(
      products.map((p: Product) => [p.id, p])
    );

    // Validate stock and build line items
    const lineItems = [];
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }
      if (product.stock_quantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for: ${product.name}` },
          { status: 400 }
        );
      }

      const itemTotal = product.sell_price * item.quantity;
      subtotal += itemTotal;

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            ...(product.images?.[0] ? { images: [product.images[0]] } : {}),
          },
          unit_amount: Math.round(product.sell_price * 100),
        },
        quantity: item.quantity,
      });

      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        product_sku: product.sku,
        quantity: item.quantity,
        unit_price: product.sell_price,
        unit_cost: product.cost_price,
        total_price: itemTotal,
      });
    }

    const total = subtotal + shippingCost;
    const orderNumber = generateOrderNumber();

    const shippingAddress: ShippingAddress = {
      name: customer.name,
      line1: customer.line1,
      line2: customer.line2 || undefined,
      city: customer.city,
      state: customer.state,
      zip: customer.zip,
      country: "US",
    };

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
      customer_email: customer.email,
      metadata: {
        order_number: orderNumber,
        customer_name: customer.name,
        customer_phone: customer.phone || "",
        shipping_address: JSON.stringify(shippingAddress),
        order_items: JSON.stringify(orderItems),
        subtotal: subtotal.toString(),
        shipping_cost: shippingCost.toString(),
        total: total.toString(),
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: Math.round(shippingCost * 100), currency: "usd" },
            display_name: shippingCost === 0 ? "Free Shipping" : "Standard Shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 1 },
              maximum: { unit: "business_day", value: 3 },
            },
          },
        },
      ],
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
