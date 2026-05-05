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
import { formatCurrency, calculateMargin, slugify } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  Loader2,
  Sparkles,
  TrendingUp,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import type { Category, Product, Supplier } from "@/types";

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  suppliers: Supplier[];
}

export function ProductForm({
  product,
  categories,
  suppliers,
}: ProductFormProps) {
  const router = useRouter();
  const isNew = !product;

  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    cost_price: product?.cost_price?.toString() || "",
    sell_price: product?.sell_price?.toString() || "",
    stock_quantity: product?.stock_quantity?.toString() || "0",
    sku: product?.sku || "",
    category_id: product?.category_id || "",
    supplier_id: product?.supplier_id || "",
    is_active: product?.is_active ?? true,
    weight_oz: product?.weight_oz?.toString() || "",
    tags: product?.tags?.join(", ") || "",
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [images, setImages] = useState<string[]>(product?.images || []);

  const margin = form.cost_price && form.sell_price
    ? calculateMargin(parseFloat(form.cost_price), parseFloat(form.sell_price))
    : null;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "name" && isNew) {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  async function generateDescription() {
    if (!form.name) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/describe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: form.name,
          category: categories.find((c) => c.id === form.category_id)?.name,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          existingDescription: form.description || undefined,
        }),
      });
      const { description, error } = await res.json();
      if (error) throw new Error(error);
      setForm((prev) => ({ ...prev, description }));
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploadingImages(true);
    const supabase = createClient();
    const uploaded: string[] = [];

    for (const file of files) {
      const ext = file.name.split(".").pop();
      const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (!error) {
        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
    }

    setImages((prev) => [...prev, ...uploaded]);
    setUploadingImages(false);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const supabase = createClient();

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description || null,
      cost_price: parseFloat(form.cost_price),
      sell_price: parseFloat(form.sell_price),
      stock_quantity: parseInt(form.stock_quantity),
      sku: form.sku || null,
      category_id: form.category_id || null,
      supplier_id: form.supplier_id || null,
      is_active: form.is_active,
      weight_oz: form.weight_oz ? parseFloat(form.weight_oz) : null,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      images,
      updated_at: new Date().toISOString(),
    };

    if (isNew) {
      const { error } = await supabase.from("products").insert(payload);
      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", product.id);
      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    }

    router.push("/admin/products");
    router.refresh();
  }

  async function handleDelete() {
    if (!product || !confirm("Delete this product? This cannot be undone.")) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("products").delete().eq("id", product.id);
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isNew ? "Add Product" : "Edit Product"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isNew
              ? "Add a new product to your catalog"
              : `Editing: ${product.name}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!isNew && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete
            </Button>
          )}
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isNew ? "Create Product" : "Save Changes"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Product Name *
                </label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Sony WH-1000XM5 Headphones"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  URL Slug *
                </label>
                <Input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="auto-generated-from-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <span>Description</span>
                </label>
                <div className="relative">
                  <Textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Product description..."
                    className="min-h-[100px] pr-24"
                  />
                  <button
                    type="button"
                    onClick={generateDescription}
                    disabled={aiLoading || !form.name}
                    className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 disabled:opacity-50 transition-colors"
                  >
                    {aiLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    AI Write
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tags (comma-separated)
                </label>
                <Input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="electronics, headphones, sony"
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Cost Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                      $
                    </span>
                    <Input
                      name="cost_price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.cost_price}
                      onChange={handleChange}
                      className="pl-7"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    What you pay the supplier
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Sell Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                      $
                    </span>
                    <Input
                      name="sell_price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.sell_price}
                      onChange={handleChange}
                      className="pl-7"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    What customers pay
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Stock Quantity *
                  </label>
                  <Input
                    name="stock_quantity"
                    type="number"
                    min="0"
                    value={form.stock_quantity}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>
              </div>

              {margin !== null && (
                <div
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold ${
                    margin >= 30
                      ? "bg-green-50 text-green-700"
                      : margin >= 15
                      ? "bg-yellow-50 text-yellow-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  <TrendingUp className="h-4 w-4" />
                  Gross Margin: {margin.toFixed(1)}%
                  {form.cost_price && form.sell_price && (
                    <span className="ml-2 font-normal opacity-80">
                      (
                      {formatCurrency(
                        parseFloat(form.sell_price) - parseFloat(form.cost_price)
                      )}{" "}
                      profit per unit)
                    </span>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    SKU
                  </label>
                  <Input
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    placeholder="WH-1000XM5-BLK"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Weight (oz)
                  </label>
                  <Input
                    name="weight_oz"
                    type="number"
                    step="0.1"
                    min="0"
                    value={form.weight_oz}
                    onChange={handleChange}
                    placeholder="8.5"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploadingImages}
                />
                {uploadingImages ? (
                  <Loader2 className="h-6 w-6 animate-spin text-slate-400 mb-2" />
                ) : (
                  <Upload className="h-6 w-6 text-slate-400 mb-2" />
                )}
                <span className="text-sm text-slate-500">
                  {uploadingImages
                    ? "Uploading..."
                    : "Click to upload images"}
                </span>
              </label>

              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((url, i) => (
                    <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Product image ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() =>
                          setImages((prev) => prev.filter((_, j) => j !== i))
                        }
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-500 text-white text-xs hidden group-hover:flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Category
                </label>
                <Select
                  value={form.category_id}
                  onValueChange={(v) =>
                    setForm((prev) => ({ ...prev, category_id: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Supplier
                </label>
                <Select
                  value={form.supplier_id}
                  onValueChange={(v) =>
                    setForm((prev) => ({ ...prev, supplier_id: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier..." />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>
                <div className="flex gap-3">
                  {[
                    { label: "Active", value: true },
                    { label: "Draft", value: false },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          is_active: opt.value,
                        }))
                      }
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        form.is_active === opt.value
                          ? "border-orange-500 bg-orange-50 text-orange-700"
                          : "border-slate-300 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {!isNew && (
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-slate-500 space-y-1">
                  <span className="block">
                    Created:{" "}
                    {new Date(product.created_at).toLocaleDateString()}
                  </span>
                  <span className="block">
                    Updated:{" "}
                    {new Date(product.updated_at).toLocaleDateString()}
                  </span>
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
