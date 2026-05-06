/**
 * Seed script for My Corner Store product catalog.
 * Run with: npm run seed
 *
 * Uses the service role key to bypass RLS.
 * Products are linked to categories via category_id (UUID).
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function getCategoryIds(): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug");

  if (error) throw new Error(`Failed to fetch categories: ${error.message}`);

  return Object.fromEntries((data ?? []).map((c) => [c.slug, c.id]));
}

async function seed() {
  console.log("Fetching category IDs...");
  const catId = await getCategoryIds();

  const requiredSlugs = [
    "beverages",
    "candy",
    "frozen-dairy",
    "grocery",
    "health-beauty",
    "household",
    "snacks",
    "vapes",
  ];

  for (const slug of requiredSlugs) {
    if (!catId[slug]) {
      console.error(`Category not found for slug: "${slug}". Aborting.`);
      process.exit(1);
    }
  }

  const img = (text: string) =>
    `https://placehold.co/400x400/f97316/white?text=${encodeURIComponent(text)}`;

  const products = [
    // ── Beverages ────────────────────────────────────────────────────────────
    {
      name: "Gatorade Fruit Punch 32oz",
      slug: "gatorade-fruit-punch-32oz",
      description:
        "Classic Gatorade Fruit Punch in a 32oz bottle. Replenishes electrolytes and keeps you hydrated.",
      cost_price: 1.25,
      sell_price: 2.49,
      stock_quantity: 80,
      sku: "GAT-FP-32",
      category_id: catId["beverages"],
      images: [img("Gatorade Fruit Punch")],
      weight_oz: 32.0,
      tags: ["gatorade", "sports drink", "electrolytes", "fruit punch"],
    },
    {
      name: "Gatorade Lemon Lime 32oz",
      slug: "gatorade-lemon-lime-32oz",
      description:
        "Refreshing Gatorade Lemon Lime in a 32oz bottle. A fan-favorite flavor for active hydration.",
      cost_price: 1.25,
      sell_price: 2.49,
      stock_quantity: 75,
      sku: "GAT-LL-32",
      category_id: catId["beverages"],
      images: [img("Gatorade Lemon Lime")],
      weight_oz: 32.0,
      tags: ["gatorade", "sports drink", "electrolytes", "lemon lime"],
    },
    {
      name: "Snapple Peach Tea 16oz",
      slug: "snapple-peach-tea-16oz",
      description:
        "All-natural Snapple Peach Tea brewed from the finest teas with real fruit flavor. 16oz glass bottle.",
      cost_price: 1.10,
      sell_price: 2.29,
      stock_quantity: 60,
      sku: "SNP-PT-16",
      category_id: catId["beverages"],
      images: [img("Snapple Peach Tea")],
      weight_oz: 16.0,
      tags: ["snapple", "tea", "peach", "iced tea"],
    },
    {
      name: "Arizona Green Tea 23oz",
      slug: "arizona-green-tea-23oz",
      description:
        "Arizona Green Tea with Ginseng and Honey in a 23oz can. Big flavor, small price.",
      cost_price: 0.99,
      sell_price: 1.99,
      stock_quantity: 90,
      sku: "ARI-GT-23",
      category_id: catId["beverages"],
      images: [img("Arizona Green Tea")],
      weight_oz: 23.0,
      tags: ["arizona", "green tea", "ginseng", "honey"],
    },
    {
      name: "Red Bull Original 8.4oz",
      slug: "red-bull-original-8oz",
      description:
        "Red Bull Energy Drink gives you wings. 8.4oz can with taurine, B-vitamins, caffeine, and sugars.",
      cost_price: 1.75,
      sell_price: 3.49,
      stock_quantity: 50,
      sku: "RB-OG-8",
      category_id: catId["beverages"],
      images: [img("Red Bull Original")],
      weight_oz: 8.4,
      tags: ["red bull", "energy drink", "caffeine", "wings"],
    },
    {
      name: "Monster Energy Original 16oz",
      slug: "monster-energy-original-16oz",
      description:
        "Monster Energy Original 16oz can. Loaded with our Monster Energy blend to fuel your adventure.",
      cost_price: 1.50,
      sell_price: 3.29,
      stock_quantity: 55,
      sku: "MON-OG-16",
      category_id: catId["beverages"],
      images: [img("Monster Energy")],
      weight_oz: 16.0,
      tags: ["monster", "energy drink", "caffeine"],
    },
    {
      name: "Coca-Cola 20oz",
      slug: "coca-cola-20oz",
      description:
        "Ice-cold Coca-Cola classic in a 20oz bottle. The original taste that's hard to beat.",
      cost_price: 0.95,
      sell_price: 1.99,
      stock_quantity: 100,
      sku: "COKE-20",
      category_id: catId["beverages"],
      images: [img("Coca-Cola 20oz")],
      weight_oz: 20.0,
      tags: ["coca-cola", "soda", "cola", "coke"],
    },
    {
      name: "Sprite 20oz",
      slug: "sprite-20oz",
      description:
        "Crisp, clean Sprite lemon-lime soda in a 20oz bottle. Caffeine-free and refreshing.",
      cost_price: 0.95,
      sell_price: 1.99,
      stock_quantity: 85,
      sku: "SPR-20",
      category_id: catId["beverages"],
      images: [img("Sprite 20oz")],
      weight_oz: 20.0,
      tags: ["sprite", "soda", "lemon lime", "caffeine free"],
    },
    {
      name: "Poland Spring Water 16.9oz 6-Pack",
      slug: "poland-spring-water-6pack",
      description:
        "Poland Spring 100% Natural Spring Water, 16.9oz bottles, 6-pack. Pure and refreshing spring water.",
      cost_price: 2.50,
      sell_price: 4.99,
      stock_quantity: 70,
      sku: "PSW-6PK",
      category_id: catId["beverages"],
      images: [img("Poland Spring Water")],
      weight_oz: 101.4,
      tags: ["water", "spring water", "poland spring", "hydration"],
    },
    {
      name: "Tropicana Orange Juice 12oz",
      slug: "tropicana-orange-juice-12oz",
      description:
        "Tropicana Pure Premium Orange Juice in a 12oz bottle. 100% pure squeezed Florida orange juice.",
      cost_price: 1.20,
      sell_price: 2.49,
      stock_quantity: 45,
      sku: "TROP-OJ-12",
      category_id: catId["beverages"],
      images: [img("Tropicana OJ")],
      weight_oz: 12.0,
      tags: ["tropicana", "orange juice", "juice", "breakfast"],
    },

    // ── Snacks & Chips ────────────────────────────────────────────────────────
    {
      name: "Lay's Classic Chips 2.625oz",
      slug: "lays-classic-chips-2oz",
      description:
        "Lay's Classic potato chips, perfectly salted and impossibly light. The original and best.",
      cost_price: 0.75,
      sell_price: 1.79,
      stock_quantity: 80,
      sku: "LAY-CL-2",
      category_id: catId["snacks"],
      images: [img("Lays Classic")],
      weight_oz: 2.625,
      tags: ["lays", "chips", "potato chips", "snack"],
    },
    {
      name: "Doritos Nacho Cheese 2.75oz",
      slug: "doritos-nacho-cheese-2oz",
      description:
        "Bold and cheesy Doritos Nacho Cheese tortilla chips. Flavor so good you'll keep reaching in the bag.",
      cost_price: 0.75,
      sell_price: 1.79,
      stock_quantity: 85,
      sku: "DOR-NC-2",
      category_id: catId["snacks"],
      images: [img("Doritos Nacho")],
      weight_oz: 2.75,
      tags: ["doritos", "tortilla chips", "nacho cheese", "snack"],
    },
    {
      name: "Cheetos Crunchy 2.75oz",
      slug: "cheetos-crunchy-2oz",
      description:
        "Cheetos Crunchy cheese-flavored snacks. Dangerously cheesy with that signature crunch.",
      cost_price: 0.75,
      sell_price: 1.79,
      stock_quantity: 70,
      sku: "CHET-CR-2",
      category_id: catId["snacks"],
      images: [img("Cheetos Crunchy")],
      weight_oz: 2.75,
      tags: ["cheetos", "cheese puffs", "crunchy", "snack"],
    },
    {
      name: "Flamin' Hot Cheetos 2.75oz",
      slug: "flamin-hot-cheetos-2oz",
      description:
        "Cheetos Flamin' Hot Crunchy snacks. Fiery hot flavor that's seriously addictive.",
      cost_price: 0.75,
      sell_price: 1.79,
      stock_quantity: 90,
      sku: "CHET-FH-2",
      category_id: catId["snacks"],
      images: [img("Flamin Hot Cheetos")],
      weight_oz: 2.75,
      tags: ["cheetos", "flamin hot", "spicy", "snack"],
    },
    {
      name: "Fritos Original 2oz",
      slug: "fritos-original-2oz",
      description:
        "Original Fritos corn chips with that authentic corn taste. Just three ingredients: corn, oil, salt.",
      cost_price: 0.65,
      sell_price: 1.59,
      stock_quantity: 65,
      sku: "FRI-OG-2",
      category_id: catId["snacks"],
      images: [img("Fritos Original")],
      weight_oz: 2.0,
      tags: ["fritos", "corn chips", "snack"],
    },
    {
      name: "Planters Mixed Nuts 1.75oz",
      slug: "planters-mixed-nuts-175oz",
      description:
        "Planters Mixed Nuts with peanuts, almonds, cashews, and pecans. A satisfying, protein-packed snack.",
      cost_price: 1.10,
      sell_price: 2.29,
      stock_quantity: 50,
      sku: "PLN-MN-1",
      category_id: catId["snacks"],
      images: [img("Planters Mixed Nuts")],
      weight_oz: 1.75,
      tags: ["planters", "nuts", "mixed nuts", "protein"],
    },
    {
      name: "Slim Jim Original Snack Stick 0.97oz",
      slug: "slim-jim-original-snack-stick",
      description:
        "Slim Jim Original smoked snack stick. Bold, spicy flavor in a convenient grab-and-go stick.",
      cost_price: 0.55,
      sell_price: 1.29,
      stock_quantity: 100,
      sku: "SLJ-OG-1",
      category_id: catId["snacks"],
      images: [img("Slim Jim Original")],
      weight_oz: 0.97,
      tags: ["slim jim", "meat stick", "snack", "protein"],
    },
    {
      name: "Sunflower Seeds David Original 5.25oz",
      slug: "david-sunflower-seeds-original-5oz",
      description:
        "David Original Sunflower Seeds, lightly salted in the shell. A classic baseball snack.",
      cost_price: 1.25,
      sell_price: 2.49,
      stock_quantity: 55,
      sku: "DAV-SS-5",
      category_id: catId["snacks"],
      images: [img("David Sunflower Seeds")],
      weight_oz: 5.25,
      tags: ["sunflower seeds", "david", "seeds", "snack"],
    },
    {
      name: "Pork Rinds 1.75oz",
      slug: "pork-rinds-original-175oz",
      description:
        "Crispy fried pork rinds with a light, airy crunch. Zero carbs, high protein snack.",
      cost_price: 0.60,
      sell_price: 1.29,
      stock_quantity: 45,
      sku: "PRK-OG-1",
      category_id: catId["snacks"],
      images: [img("Pork Rinds")],
      weight_oz: 1.75,
      tags: ["pork rinds", "chicharrones", "keto", "snack"],
    },
    {
      name: "Pringles Original 5.57oz",
      slug: "pringles-original-557oz",
      description:
        "Pringles Original potato crisps in the iconic can. Once you pop, you can't stop.",
      cost_price: 1.25,
      sell_price: 2.49,
      stock_quantity: 60,
      sku: "PRG-OG-5",
      category_id: catId["snacks"],
      images: [img("Pringles Original")],
      weight_oz: 5.57,
      tags: ["pringles", "potato crisps", "chips", "snack"],
    },

    // ── Candy & Gum ───────────────────────────────────────────────────────────
    {
      name: "Snickers Bar 1.86oz",
      slug: "snickers-bar-186oz",
      description:
        "Snickers satisfies with nougat, caramel, peanuts, and milk chocolate. You're not you when you're hungry.",
      cost_price: 0.75,
      sell_price: 1.79,
      stock_quantity: 100,
      sku: "SNIC-OG-1",
      category_id: catId["candy"],
      images: [img("Snickers Bar")],
      weight_oz: 1.86,
      tags: ["snickers", "chocolate", "candy bar", "caramel", "peanuts"],
    },
    {
      name: "Reese's Peanut Butter Cups 1.5oz",
      slug: "reeses-peanut-butter-cups-15oz",
      description:
        "Two classic Reese's Peanut Butter Cups coated in milk chocolate. The perfect peanut butter-chocolate combo.",
      cost_price: 0.75,
      sell_price: 1.79,
      stock_quantity: 100,
      sku: "RSES-PBC-1",
      category_id: catId["candy"],
      images: [img("Reeses PB Cups")],
      weight_oz: 1.5,
      tags: ["reeses", "peanut butter", "chocolate", "candy"],
    },
    {
      name: "Skittles Original 2.17oz",
      slug: "skittles-original-217oz",
      description:
        "Taste the rainbow with Skittles Original fruit-flavored chewy candies. Strawberry, lemon, grape, and more.",
      cost_price: 0.65,
      sell_price: 1.49,
      stock_quantity: 90,
      sku: "SKIT-OG-2",
      category_id: catId["candy"],
      images: [img("Skittles Original")],
      weight_oz: 2.17,
      tags: ["skittles", "fruit candy", "chewy", "rainbow"],
    },
    {
      name: "Starburst Original 2.07oz",
      slug: "starburst-original-207oz",
      description:
        "Starburst Original fruit chews in strawberry, cherry, orange, and lemon. Unexplainably juicy.",
      cost_price: 0.65,
      sell_price: 1.49,
      stock_quantity: 85,
      sku: "STRB-OG-2",
      category_id: catId["candy"],
      images: [img("Starburst Original")],
      weight_oz: 2.07,
      tags: ["starburst", "fruit chews", "candy", "chewy"],
    },
    {
      name: "Twix Bar 1.79oz",
      slug: "twix-bar-179oz",
      description:
        "Twix cookie bars with crunchy cookie, creamy caramel, and smooth milk chocolate. Two bars in one pack.",
      cost_price: 0.75,
      sell_price: 1.79,
      stock_quantity: 90,
      sku: "TWIX-OG-1",
      category_id: catId["candy"],
      images: [img("Twix Bar")],
      weight_oz: 1.79,
      tags: ["twix", "chocolate", "caramel", "cookie bar", "candy"],
    },
    {
      name: "M&Ms Peanut 1.74oz",
      slug: "mms-peanut-174oz",
      description:
        "M&M's Peanut chocolate candies with a crunchy peanut center coated in milk chocolate and candy shell.",
      cost_price: 0.75,
      sell_price: 1.79,
      stock_quantity: 95,
      sku: "MMS-PN-1",
      category_id: catId["candy"],
      images: [img("M&Ms Peanut")],
      weight_oz: 1.74,
      tags: ["mms", "peanut", "chocolate", "candy"],
    },
    {
      name: "Sour Patch Kids 2oz",
      slug: "sour-patch-kids-2oz",
      description:
        "Sour Patch Kids soft and chewy candy — first they're sour, then they're sweet. Assorted fruit flavors.",
      cost_price: 0.65,
      sell_price: 1.49,
      stock_quantity: 80,
      sku: "SPK-OG-2",
      category_id: catId["candy"],
      images: [img("Sour Patch Kids")],
      weight_oz: 2.0,
      tags: ["sour patch kids", "sour candy", "chewy", "gummy"],
    },
    {
      name: "Haribo Goldbears Gummies 4oz",
      slug: "haribo-goldbears-gummies-4oz",
      description:
        "Haribo Gold-Bears gummy candy in five classic fruit flavors. The world's most famous gummy bears.",
      cost_price: 0.85,
      sell_price: 1.99,
      stock_quantity: 70,
      sku: "HAR-GB-4",
      category_id: catId["candy"],
      images: [img("Haribo Goldbears")],
      weight_oz: 4.0,
      tags: ["haribo", "gummy bears", "gummy", "candy"],
    },
    {
      name: "Trident Spearmint Gum 14 Sticks",
      slug: "trident-spearmint-gum-14ct",
      description:
        "Trident Spearmint sugarless gum, 14 sticks. Freshens breath and protects teeth between brushings.",
      cost_price: 0.85,
      sell_price: 1.79,
      stock_quantity: 60,
      sku: "TRI-SPM-14",
      category_id: catId["candy"],
      images: [img("Trident Spearmint")],
      weight_oz: 1.05,
      tags: ["trident", "gum", "spearmint", "sugar free"],
    },
    {
      name: "5 Gum Peppermint Cobalt 15 Sticks",
      slug: "5-gum-peppermint-cobalt-15ct",
      description:
        "5 Gum Peppermint Cobalt stimulating gum, 15 sticks. Intense peppermint flavor that lasts.",
      cost_price: 0.90,
      sell_price: 1.89,
      stock_quantity: 55,
      sku: "5GUM-PC-15",
      category_id: catId["candy"],
      images: [img("5 Gum Peppermint")],
      weight_oz: 1.1,
      tags: ["5 gum", "peppermint", "gum", "cobalt"],
    },

    // ── Frozen & Dairy ────────────────────────────────────────────────────────
    {
      name: "Ben & Jerry's Chocolate Chip Cookie Dough Pint",
      slug: "ben-jerrys-choc-chip-cookie-dough-pint",
      description:
        "Ben & Jerry's Chocolate Chip Cookie Dough ice cream pint. Chunks of cookie dough in a rich vanilla base.",
      cost_price: 4.50,
      sell_price: 7.99,
      stock_quantity: 30,
      sku: "BNJ-CCCD-PT",
      category_id: catId["frozen-dairy"],
      images: [img("Ben & Jerrys")],
      weight_oz: 16.0,
      tags: ["ben and jerrys", "ice cream", "cookie dough", "frozen"],
    },
    {
      name: "Haagen-Dazs Vanilla Pint",
      slug: "haagen-dazs-vanilla-pint",
      description:
        "Häagen-Dazs Classic Vanilla ice cream pint. Made with only the finest ingredients for a rich, creamy taste.",
      cost_price: 4.00,
      sell_price: 6.99,
      stock_quantity: 30,
      sku: "HD-VAN-PT",
      category_id: catId["frozen-dairy"],
      images: [img("Haagen-Dazs Vanilla")],
      weight_oz: 16.0,
      tags: ["haagen dazs", "ice cream", "vanilla", "frozen"],
    },
    {
      name: "Edy's Neapolitan Ice Cream Quart",
      slug: "edys-neapolitan-ice-cream-quart",
      description:
        "Edy's Grand Neapolitan ice cream in a quart container. Classic chocolate, vanilla, and strawberry trio.",
      cost_price: 3.25,
      sell_price: 5.99,
      stock_quantity: 25,
      sku: "EDY-NEA-QT",
      category_id: catId["frozen-dairy"],
      images: [img("Edys Neapolitan")],
      weight_oz: 32.0,
      tags: ["edys", "ice cream", "neapolitan", "frozen"],
    },
    {
      name: "Good Humor Strawberry Shortcake Bar Box of 6",
      slug: "good-humor-strawberry-shortcake-6pack",
      description:
        "Good Humor Strawberry Shortcake ice cream bars, box of 6. A classic American frozen treat with crunch coating.",
      cost_price: 4.00,
      sell_price: 6.99,
      stock_quantity: 20,
      sku: "GH-SSC-6",
      category_id: catId["frozen-dairy"],
      images: [img("Good Humor Strawberry")],
      weight_oz: 18.0,
      tags: ["good humor", "ice cream bars", "strawberry shortcake", "frozen"],
    },
    {
      name: "Yoplait Strawberry Yogurt 6oz",
      slug: "yoplait-strawberry-yogurt-6oz",
      description:
        "Yoplait Original Strawberry lowfat yogurt, 6oz cup. Creamy and delicious with real strawberry fruit.",
      cost_price: 0.65,
      sell_price: 1.29,
      stock_quantity: 40,
      sku: "YOP-STR-6",
      category_id: catId["frozen-dairy"],
      images: [img("Yoplait Strawberry")],
      weight_oz: 6.0,
      tags: ["yoplait", "yogurt", "strawberry", "dairy"],
    },
    {
      name: "String Cheese Mozzarella 1oz Stick",
      slug: "string-cheese-mozzarella-1oz",
      description:
        "Part-skim mozzarella string cheese stick, 1oz. A fun, protein-rich dairy snack for all ages.",
      cost_price: 0.50,
      sell_price: 0.99,
      stock_quantity: 60,
      sku: "STR-MOZ-1",
      category_id: catId["frozen-dairy"],
      images: [img("String Cheese")],
      weight_oz: 1.0,
      tags: ["string cheese", "mozzarella", "dairy", "snack", "protein"],
    },

    // ── Grocery & Pantry ──────────────────────────────────────────────────────
    {
      name: "Cup Noodles Chicken 2.25oz",
      slug: "cup-noodles-chicken-225oz",
      description:
        "Nissin Cup Noodles Chicken flavor, 2.25oz. Quick and satisfying ramen noodles ready in 3 minutes.",
      cost_price: 0.25,
      sell_price: 0.99,
      stock_quantity: 100,
      sku: "CUP-CHK-2",
      category_id: catId["grocery"],
      images: [img("Cup Noodles Chicken")],
      weight_oz: 2.25,
      tags: ["cup noodles", "ramen", "nissin", "chicken", "instant noodles"],
    },
    {
      name: "Maruchan Ramen Chicken 3oz",
      slug: "maruchan-ramen-chicken-3oz",
      description:
        "Maruchan Chicken flavor ramen noodle soup, 3oz package. A quick, hearty, and budget-friendly meal.",
      cost_price: 0.20,
      sell_price: 0.79,
      stock_quantity: 120,
      sku: "MAR-CHK-3",
      category_id: catId["grocery"],
      images: [img("Maruchan Ramen")],
      weight_oz: 3.0,
      tags: ["maruchan", "ramen", "chicken", "instant noodles"],
    },
    {
      name: "Spam Classic 12oz Can",
      slug: "spam-classic-12oz",
      description:
        "SPAM Classic canned cooked pork with ham, 12oz. A versatile pantry staple with endless recipe possibilities.",
      cost_price: 2.50,
      sell_price: 4.99,
      stock_quantity: 40,
      sku: "SPAM-CL-12",
      category_id: catId["grocery"],
      images: [img("Spam Classic")],
      weight_oz: 12.0,
      tags: ["spam", "canned meat", "pork", "pantry"],
    },
    {
      name: "Campbell's Chicken Noodle Soup 10.75oz",
      slug: "campbells-chicken-noodle-soup-10oz",
      description:
        "Campbell's Condensed Chicken Noodle Soup, 10.75oz can. A comforting classic with tender chicken and egg noodles.",
      cost_price: 0.95,
      sell_price: 1.99,
      stock_quantity: 60,
      sku: "CAM-CNS-10",
      category_id: catId["grocery"],
      images: [img("Campbells Soup")],
      weight_oz: 10.75,
      tags: ["campbells", "soup", "chicken noodle", "canned soup"],
    },
    {
      name: "Oreo Cookies 3oz Snack Pack",
      slug: "oreo-cookies-3oz-snack-pack",
      description:
        "Nabisco Oreo chocolate sandwich cookies in a 3oz snack pack. America's favorite cookie in a convenient size.",
      cost_price: 0.65,
      sell_price: 1.49,
      stock_quantity: 80,
      sku: "ORE-SP-3",
      category_id: catId["grocery"],
      images: [img("Oreo Snack Pack")],
      weight_oz: 3.0,
      tags: ["oreo", "cookies", "snack pack", "chocolate"],
    },
    {
      name: "PB&J Uncrustables 2-Pack",
      slug: "uncrustables-pbj-2pack",
      description:
        "Smucker's Uncrustables Peanut Butter & Strawberry Jam sandwiches, 2-pack. Sealed crustless sandwiches, ready to eat.",
      cost_price: 1.25,
      sell_price: 2.49,
      stock_quantity: 50,
      sku: "UNC-PBJ-2",
      category_id: catId["grocery"],
      images: [img("Uncrustables PBJ")],
      weight_oz: 4.0,
      tags: ["uncrustables", "peanut butter", "jelly", "sandwich", "smuckers"],
    },

    // ── Health & Beauty ───────────────────────────────────────────────────────
    {
      name: "Advil Liqui-Gels 8 Count",
      slug: "advil-liqui-gels-8ct",
      description:
        "Advil Liqui-Gels ibuprofen pain reliever/fever reducer, 8 count. Fast, powerful relief from pain and inflammation.",
      cost_price: 2.50,
      sell_price: 5.49,
      stock_quantity: 40,
      sku: "ADV-LG-8",
      category_id: catId["health-beauty"],
      images: [img("Advil Liqui-Gels")],
      weight_oz: 1.5,
      tags: ["advil", "ibuprofen", "pain relief", "medicine"],
    },
    {
      name: "Tylenol Extra Strength 24 Count",
      slug: "tylenol-extra-strength-24ct",
      description:
        "Tylenol Extra Strength acetaminophen caplets, 24 count. Effective relief for headaches, muscle aches, and fever.",
      cost_price: 3.25,
      sell_price: 6.99,
      stock_quantity: 35,
      sku: "TYL-ES-24",
      category_id: catId["health-beauty"],
      images: [img("Tylenol Extra Strength")],
      weight_oz: 2.5,
      tags: ["tylenol", "acetaminophen", "pain relief", "medicine"],
    },
    {
      name: "Pepto-Bismol Chewable 12 Count",
      slug: "pepto-bismol-chewable-12ct",
      description:
        "Pepto-Bismol Original chewable tablets, 12 count. Relieves heartburn, indigestion, nausea, and stomach upset.",
      cost_price: 2.75,
      sell_price: 5.99,
      stock_quantity: 30,
      sku: "PEP-CH-12",
      category_id: catId["health-beauty"],
      images: [img("Pepto-Bismol")],
      weight_oz: 2.0,
      tags: ["pepto bismol", "stomach", "antacid", "medicine"],
    },
    {
      name: "Chapstick Original 3-Pack",
      slug: "chapstick-original-3pack",
      description:
        "ChapStick Original lip balm, 3-pack. Clinically proven to relieve chapped lips with SPF 4 protection.",
      cost_price: 2.50,
      sell_price: 4.99,
      stock_quantity: 35,
      sku: "CHAP-OG-3",
      category_id: catId["health-beauty"],
      images: [img("ChapStick 3-Pack")],
      weight_oz: 0.9,
      tags: ["chapstick", "lip balm", "spf", "personal care"],
    },
    {
      name: "Trojan ENZ Condoms 3-Pack",
      slug: "trojan-enz-condoms-3pack",
      description:
        "Trojan ENZ lubricated latex condoms, 3-pack. America's #1 condom brand for trusted protection.",
      cost_price: 2.75,
      sell_price: 6.99,
      stock_quantity: 30,
      sku: "TRJ-ENZ-3",
      category_id: catId["health-beauty"],
      images: [img("Trojan ENZ")],
      weight_oz: 0.7,
      tags: ["trojan", "condoms", "personal care", "protection"],
    },
    {
      name: "Band-Aid Flexible Fabric 10 Count",
      slug: "band-aid-flexible-fabric-10ct",
      description:
        "Band-Aid Brand Flexible Fabric adhesive bandages, 10 count. Comfortable all-fabric bandages that move with you.",
      cost_price: 1.25,
      sell_price: 2.99,
      stock_quantity: 45,
      sku: "BAID-FF-10",
      category_id: catId["health-beauty"],
      images: [img("Band-Aid Flexible")],
      weight_oz: 1.0,
      tags: ["band aid", "bandages", "first aid", "health"],
    },

    // ── Household ─────────────────────────────────────────────────────────────
    {
      name: "Duracell AA Batteries 4-Pack",
      slug: "duracell-aa-batteries-4pack",
      description:
        "Duracell CopperTop AA alkaline batteries, 4-pack. Long-lasting power for your everyday devices.",
      cost_price: 3.00,
      sell_price: 6.49,
      stock_quantity: 45,
      sku: "DUR-AA-4",
      category_id: catId["household"],
      images: [img("Duracell AA")],
      weight_oz: 3.2,
      tags: ["duracell", "batteries", "aa", "alkaline"],
    },
    {
      name: "Energizer AAA Batteries 4-Pack",
      slug: "energizer-aaa-batteries-4pack",
      description:
        "Energizer MAX AAA alkaline batteries, 4-pack. Designed to power your everyday devices for longer.",
      cost_price: 2.75,
      sell_price: 5.99,
      stock_quantity: 40,
      sku: "ENR-AAA-4",
      category_id: catId["household"],
      images: [img("Energizer AAA")],
      weight_oz: 2.4,
      tags: ["energizer", "batteries", "aaa", "alkaline"],
    },
    {
      name: "Bic Lighter Classic Single",
      slug: "bic-lighter-classic-single",
      description:
        "BIC Classic lighter, single. Full-size lighter with child-resistant safety feature and up to 3,000 lights.",
      cost_price: 0.55,
      sell_price: 1.49,
      stock_quantity: 100,
      sku: "BIC-CL-1",
      category_id: catId["household"],
      images: [img("BIC Lighter")],
      weight_oz: 1.0,
      tags: ["bic", "lighter", "fire", "household"],
    },
    {
      name: "Zippo Lighter Fluid 4oz",
      slug: "zippo-lighter-fluid-4oz",
      description:
        "Zippo Premium lighter fluid, 4oz can. The preferred fuel for Zippo lighters and other wick-type lighters.",
      cost_price: 2.00,
      sell_price: 4.49,
      stock_quantity: 30,
      sku: "ZIP-LF-4",
      category_id: catId["household"],
      images: [img("Zippo Lighter Fluid")],
      weight_oz: 4.0,
      tags: ["zippo", "lighter fluid", "fuel", "household"],
    },
    {
      name: "Scotch Tape 3/4\" x 300\"",
      slug: "scotch-tape-075x300",
      description:
        "Scotch Magic Tape, 3/4 inch x 300 inches. The world's favorite tape — invisible when applied and easy to write on.",
      cost_price: 1.25,
      sell_price: 2.99,
      stock_quantity: 40,
      sku: "SCO-TP-300",
      category_id: catId["household"],
      images: [img("Scotch Tape")],
      weight_oz: 1.3,
      tags: ["scotch tape", "tape", "office supply", "household"],
    },
    {
      name: "Forever Stamps 20-Pack",
      slug: "forever-stamps-20pack",
      description:
        "USPS Forever First-Class Mail postage stamps, 20-pack. Always valid for one-ounce first-class letters.",
      cost_price: 13.60,
      sell_price: 14.99,
      stock_quantity: 25,
      sku: "USPS-FS-20",
      category_id: catId["household"],
      images: [img("Forever Stamps")],
      weight_oz: 0.2,
      tags: ["stamps", "postage", "usps", "mailing"],
    },

    // ── Vapes & Tobacco ───────────────────────────────────────────────────────
    {
      name: "Elf Bar BC5000 Watermelon Ice Disposable Vape",
      slug: "elf-bar-bc5000-watermelon-ice",
      description:
        "Elf Bar BC5000 disposable vape in Watermelon Ice. Up to 5,000 puffs with rechargeable battery and 5% nicotine salt.",
      cost_price: 8.00,
      sell_price: 18.99,
      stock_quantity: 40,
      sku: "ELF-BC5-WI",
      category_id: catId["vapes"],
      images: [img("Elf Bar Watermelon Ice")],
      weight_oz: 1.8,
      tags: ["elf bar", "vape", "disposable", "watermelon ice", "nicotine"],
    },
    {
      name: "Elf Bar BC5000 Blue Razz Ice Disposable Vape",
      slug: "elf-bar-bc5000-blue-razz-ice",
      description:
        "Elf Bar BC5000 disposable vape in Blue Razz Ice. 5,000 puffs, rechargeable, 5% nicotine salt.",
      cost_price: 8.00,
      sell_price: 18.99,
      stock_quantity: 45,
      sku: "ELF-BC5-BRI",
      category_id: catId["vapes"],
      images: [img("Elf Bar Blue Razz")],
      weight_oz: 1.8,
      tags: ["elf bar", "vape", "disposable", "blue razz", "nicotine"],
    },
    {
      name: "Lost Mary OS5000 Strawberry Mango Disposable Vape",
      slug: "lost-mary-os5000-strawberry-mango",
      description:
        "Lost Mary OS5000 disposable vape in Strawberry Mango. Up to 5,000 puffs with rechargeable battery and mesh coil.",
      cost_price: 9.00,
      sell_price: 19.99,
      stock_quantity: 35,
      sku: "LM-OS5-SM",
      category_id: catId["vapes"],
      images: [img("Lost Mary Strawberry Mango")],
      weight_oz: 1.9,
      tags: ["lost mary", "vape", "disposable", "strawberry mango", "nicotine"],
    },
    {
      name: "Lost Mary OS5000 Black Cherry Disposable Vape",
      slug: "lost-mary-os5000-black-cherry",
      description:
        "Lost Mary OS5000 disposable vape in Black Cherry. Rich black cherry flavor with 5,000 puffs and mesh coil.",
      cost_price: 9.00,
      sell_price: 19.99,
      stock_quantity: 30,
      sku: "LM-OS5-BC",
      category_id: catId["vapes"],
      images: [img("Lost Mary Black Cherry")],
      weight_oz: 1.9,
      tags: ["lost mary", "vape", "disposable", "black cherry", "nicotine"],
    },
    {
      name: "Breeze Pro Mango Peach Guava Disposable Vape",
      slug: "breeze-pro-mango-peach-guava",
      description:
        "Breeze Pro disposable vape in Mango Peach Guava. 2,000 puffs of tropical bliss with smooth 5% nicotine.",
      cost_price: 8.50,
      sell_price: 17.99,
      stock_quantity: 35,
      sku: "BRZ-MPG-1",
      category_id: catId["vapes"],
      images: [img("Breeze Pro Mango")],
      weight_oz: 1.6,
      tags: ["breeze pro", "vape", "disposable", "mango peach guava", "nicotine"],
    },
    {
      name: "Breeze Pro Miami Mint Disposable Vape",
      slug: "breeze-pro-miami-mint",
      description:
        "Breeze Pro disposable vape in Miami Mint. Cool and refreshing minty flavor with 2,000 smooth puffs.",
      cost_price: 8.50,
      sell_price: 17.99,
      stock_quantity: 40,
      sku: "BRZ-MM-1",
      category_id: catId["vapes"],
      images: [img("Breeze Pro Miami Mint")],
      weight_oz: 1.6,
      tags: ["breeze pro", "vape", "disposable", "mint", "nicotine"],
    },
    {
      name: "Newport Cigarettes 100s Box",
      slug: "newport-cigarettes-100s-box",
      description:
        "Newport Menthol 100s King Size cigarettes, 1 pack of 20. America's best-selling menthol cigarette.",
      cost_price: 7.50,
      sell_price: 12.99,
      stock_quantity: 60,
      sku: "NEW-100-1PK",
      category_id: catId["vapes"],
      images: [img("Newport 100s")],
      weight_oz: 1.4,
      tags: ["newport", "cigarettes", "menthol", "tobacco"],
    },
    {
      name: "Marlboro Red Box",
      slug: "marlboro-red-box",
      description:
        "Marlboro Red King Size cigarettes, 1 pack of 20. The world's best-selling cigarette brand, bold full-flavor tobacco.",
      cost_price: 7.50,
      sell_price: 12.99,
      stock_quantity: 65,
      sku: "MARL-RED-1PK",
      category_id: catId["vapes"],
      images: [img("Marlboro Red")],
      weight_oz: 1.4,
      tags: ["marlboro", "cigarettes", "red", "tobacco"],
    },
  ];

  console.log(`Inserting ${products.length} products...`);

  // Insert in chunks of 10 to avoid payload limits
  const chunkSize = 10;
  let inserted = 0;

  for (let i = 0; i < products.length; i += chunkSize) {
    const chunk = products.slice(i, i + chunkSize);
    const { data, error } = await supabase
      .from("products")
      .insert(chunk)
      .select("id, name");

    if (error) {
      console.error(`Error inserting chunk at index ${i}:`, error.message);
      process.exit(1);
    }

    for (const p of data ?? []) {
      console.log(`  ✓ ${p.name} (${p.id})`);
    }
    inserted += data?.length ?? 0;
  }

  console.log(`\nDone! ${inserted} products inserted successfully.`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
