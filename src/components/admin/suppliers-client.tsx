"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { Plus, Truck, Loader2, Save, Trash2, X } from "lucide-react";
import type { Supplier } from "@/types";

interface SuppliersClientProps {
  suppliers: Supplier[];
}

const emptyForm = {
  name: "",
  contact_name: "",
  phone: "",
  email: "",
  address: "",
  notes: "",
};

export function SuppliersClient({ suppliers }: SuppliersClientProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function startAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(supplier: Supplier) {
    setForm({
      name: supplier.name,
      contact_name: supplier.contact_name || "",
      phone: supplier.phone || "",
      email: supplier.email || "",
      address: supplier.address || "",
      notes: supplier.notes || "",
    });
    setEditingId(supplier.id);
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    const payload = {
      name: form.name,
      contact_name: form.contact_name || null,
      phone: form.phone || null,
      email: form.email || null,
      address: form.address || null,
      notes: form.notes || null,
    };

    if (editingId) {
      await supabase.from("suppliers").update(payload).eq("id", editingId);
    } else {
      await supabase.from("suppliers").insert(payload);
    }

    setSaving(false);
    setShowForm(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this supplier?")) return;
    const supabase = createClient();
    await supabase.from("suppliers").delete().eq("id", id);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Suppliers</h1>
          <p className="text-sm text-slate-500 mt-1">
            Your North Jersey wholesale partners
          </p>
        </div>
        <Button onClick={startAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="border-orange-200 bg-orange-50/30">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle>
              {editingId ? "Edit Supplier" : "Add Supplier"}
            </CardTitle>
            <button
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Business Name *
                </label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Paterson Wholesale LLC"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Contact Name
                </label>
                <Input
                  name="contact_name"
                  value={form.contact_name}
                  onChange={handleChange}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Phone
                </label>
                <Input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(973) 555-0100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="orders@supplier.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Address
                </label>
                <Input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="123 Market St, Paterson, NJ"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Notes
                </label>
                <Textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Open Mon-Sat 8am-5pm. Cash preferred. Best prices on electronics."
                  className="min-h-[60px]"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={saving || !form.name} className="gap-2">
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {editingId ? "Save Changes" : "Add Supplier"}
              </Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List */}
      {suppliers.length === 0 ? (
        <div className="text-center py-16 text-slate-400 bg-white rounded-xl border border-slate-200">
          <Truck className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium">No suppliers yet</p>
          <p className="text-sm mt-1">
            Add your Paterson wholesale contacts here.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {suppliers.map((supplier) => (
            <Card key={supplier.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-orange-100 flex items-center justify-center">
                      <Truck className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {supplier.name}
                      </p>
                      {supplier.contact_name && (
                        <p className="text-xs text-slate-400">
                          {supplier.contact_name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(supplier)}
                      className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(supplier.id)}
                      className="text-xs text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-slate-600">
                  {supplier.phone && <p>{supplier.phone}</p>}
                  {supplier.email && (
                    <p className="text-orange-600">{supplier.email}</p>
                  )}
                  {supplier.address && <p className="text-slate-500 text-xs">{supplier.address}</p>}
                  {supplier.notes && (
                    <p className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-100 line-clamp-2">
                      {supplier.notes}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
