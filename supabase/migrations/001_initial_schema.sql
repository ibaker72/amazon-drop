-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Suppliers (local NJ wholesalers)
create table suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_name text,
  phone text,
  email text,
  address text,
  notes text,
  created_at timestamptz default now()
);

-- Categories
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  created_at timestamptz default now()
);

-- Products
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  cost_price numeric(10,2) not null default 0,
  sell_price numeric(10,2) not null default 0,
  stock_quantity integer not null default 0,
  sku text,
  category_id uuid references categories(id) on delete set null,
  supplier_id uuid references suppliers(id) on delete set null,
  images text[] not null default '{}',
  is_active boolean not null default true,
  weight_oz numeric(8,2),
  tags text[] not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index products_slug_idx on products(slug);
create index products_category_idx on products(category_id);
create index products_active_idx on products(is_active);

-- Customers
create table customers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  phone text,
  shipping_address jsonb,
  created_at timestamptz default now()
);

-- Orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references customers(id) on delete set null,
  customer_email text not null,
  customer_name text not null,
  shipping_address jsonb not null,
  subtotal numeric(10,2) not null,
  shipping_cost numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  status text not null default 'pending'
    check (status in ('pending','paid','picking','shipped','delivered','cancelled')),
  stripe_payment_intent text,
  fulfillment_notes text,
  shipped_at timestamptz,
  tracking_number text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index orders_status_idx on orders(status);
create index orders_customer_idx on orders(customer_id);

-- Order Items
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  product_sku text,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null,
  unit_cost numeric(10,2) not null,
  total_price numeric(10,2) not null,
  created_at timestamptz default now()
);

create index order_items_order_idx on order_items(order_id);
create index order_items_product_idx on order_items(product_id);

-- Function to decrement stock safely
create or replace function decrement_stock(p_product_id uuid, p_quantity integer)
returns void language plpgsql as $$
begin
  update products
  set stock_quantity = greatest(0, stock_quantity - p_quantity),
      updated_at = now()
  where id = p_product_id;
end;
$$;

-- RLS Policies
alter table products enable row level security;
alter table categories enable row level security;
alter table suppliers enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Public can read active products and categories
create policy "public_read_products" on products for select using (is_active = true);
create policy "public_read_categories" on categories for select using (true);

-- Service role (used by API routes) has full access — no RLS restriction needed when using service key

-- Seed data: default categories
insert into categories (name, slug, description) values
  ('Electronics', 'electronics', 'Phones, headphones, chargers, and more'),
  ('Apparel', 'apparel', 'Clothing, shoes, and accessories'),
  ('Home & Garden', 'home', 'Kitchen, furniture, and garden items'),
  ('Toys & Games', 'toys', 'For kids and adults alike'),
  ('Health & Beauty', 'health', 'Personal care and wellness products'),
  ('Tools & Hardware', 'tools', 'Hand tools, power tools, and hardware');
