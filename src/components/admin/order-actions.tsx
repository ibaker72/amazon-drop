"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Save } from "lucide-react";
import type { Order, OrderStatus } from "@/types";

const statuses: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "picking", label: "Picking (You are fetching item)" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export function OrderActions({ order }: { order: Order }) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [trackingNumber, setTrackingNumber] = useState(
    order.tracking_number || ""
  );
  const [fulfillmentNotes, setFulfillmentNotes] = useState(
    order.fulfillment_notes || ""
  );
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();

    const update: Partial<Order> & { updated_at: string } = {
      status,
      tracking_number: trackingNumber || null,
      fulfillment_notes: fulfillmentNotes || null,
      updated_at: new Date().toISOString(),
    };

    if (status === "shipped" && !order.shipped_at) {
      update.shipped_at = new Date().toISOString();
    }

    await supabase.from("orders").update(update).eq("id", order.id);
    setSaving(false);
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fulfillment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Order Status
          </label>
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as OrderStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Tracking Number
          </label>
          <Input
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="1Z999AA10123456784"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Fulfillment Notes
          </label>
          <Textarea
            value={fulfillmentNotes}
            onChange={(e) => setFulfillmentNotes(e.target.value)}
            placeholder="Internal notes (e.g. 'Picked up from Paterson supplier, dropped at UPS on Market St')"
            className="min-h-[80px]"
          />
        </div>

        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Update Order
        </Button>

        {order.shipped_at && (
          <p className="text-xs text-slate-400">
            Shipped: {new Date(order.shipped_at).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
