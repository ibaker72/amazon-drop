-- Replace generic placeholder categories with corner store categories
delete from categories;

insert into categories (name, slug, description) values
  ('Snacks & Chips',    'snacks',        'Chips, crackers, popcorn, pretzels, nuts, and more'),
  ('Candy & Gum',       'candy',         'Chocolate, gummies, hard candy, lollipops, and gum'),
  ('Beverages',         'beverages',     'Soda, juice, water, energy drinks, iced tea, and sports drinks'),
  ('Grocery & Pantry',  'grocery',       'Canned goods, condiments, spices, rice, pasta, and cooking essentials'),
  ('Vapes & Tobacco',   'vapes',         'Disposable vapes, e-liquids, cigars, and tobacco accessories'),
  ('Health & Beauty',   'health-beauty', 'Pain relief, vitamins, personal care, hygiene, and grooming'),
  ('Household',         'household',     'Cleaning supplies, paper towels, trash bags, and home essentials'),
  ('Frozen & Dairy',    'frozen-dairy',  'Ice cream, frozen meals, cheese, butter, and dairy products');
