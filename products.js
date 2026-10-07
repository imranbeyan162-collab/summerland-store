// Official Products Database for SUMMERLAND FASHION STORE
// Next to Adama Ras Hotel, Adama, Ethiopia | TikTok: @summerlandfashion

const PRODUCTS_DATA = [
  {
    id: "summer-01",
    name: "Summerland Signature Turkish Denim Jeans",
    category: "jeans",
    price: 1950,
    originalPrice: 2400,
    badge: "Adama Best Seller",
    rating: 5.0,
    reviewsCount: 48,
    image: "assets/clean/neon_interior.jpg",
    description: "Handcrafted Turkish denim from our flagship boutique next to Adama Ras Hotel. Premium stretch selvedge, reinforced stitching, and tailored taper.",
    sizes: ["29", "30", "31", "32", "34", "36"],
    colors: [
      { name: "Deep Indigo", hex: "#16283C" },
      { name: "Washed Blue", hex: "#416788" },
      { name: "Midnight Black", hex: "#111111" }
    ],
    inStock: true
  },
  {
    id: "summer-02",
    name: "Summerland Turkish Slim-Fit Dress Shirts",
    category: "shirts",
    price: 1450,
    originalPrice: 1800,
    badge: "New Arrival",
    rating: 4.9,
    reviewsCount: 38,
    image: "assets/clean/shirts_display.jpg",
    description: "Premium wrinkle-resistant Turkish cotton dress shirts. Available in classic solids, pinpoint oxford, and subtle checks. Perfect for business & formal wear.",
    sizes: ["S (38)", "M (40)", "L (42)", "XL (44)", "XXL (46)"],
    colors: [
      { name: "Sky Blue", hex: "#A7C7E7" },
      { name: "Pure White", hex: "#FFFFFF" },
      { name: "Pastel Pink", hex: "#F4C2C2" }
    ],
    inStock: true
  },
  {
    id: "summer-03",
    name: "Executive Italian Wool Blend Overcoat",
    category: "coats",
    price: 4800,
    originalPrice: 5600,
    badge: "Style On Point ✨",
    rating: 5.0,
    reviewsCount: 32,
    image: "assets/clean/overcoat.jpg",
    description: "Tailored wool blend overcoat with notched lapels and satin lining. Designed for those who appreciate true excellence.",
    sizes: ["46 (S)", "48 (M)", "50 (L)", "52 (XL)", "54 (XXL)"],
    colors: [
      { name: "Charcoal Heather", hex: "#383B40" },
      { name: "Classic Black", hex: "#0E0E0E" }
    ],
    inStock: true
  },
  {
    id: "summer-04",
    name: "Handcrafted Leather Dress Shoes & Chelsea Boots",
    category: "shoes",
    price: 3200,
    originalPrice: 3800,
    badge: "Genuine Leather",
    rating: 4.9,
    reviewsCount: 56,
    image: "assets/clean/shoes_boots.jpg",
    description: "Full-grain burnished leather oxfords, loafers, and suede Chelsea boots. Anti-slip rubber soles and cushioned arch support.",
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    colors: [
      { name: "Burnished Brown", hex: "#4A2E18" },
      { name: "Onyx Black", hex: "#111111" },
      { name: "Beige Suede", hex: "#C2B280" }
    ],
    inStock: true
  },
  {
    id: "summer-05",
    name: "Genuine Leather Designer Auto-Lock Belts",
    category: "accessories",
    price: 950,
    originalPrice: 1250,
    badge: "Turkish Import",
    rating: 4.9,
    reviewsCount: 64,
    image: "assets/clean/belts.jpg",
    description: "100% genuine full-grain leather belts with luxury brushed steel buckles. Available in smooth and textured finishes.",
    sizes: ["105cm (30-32)", "115cm (34-36)", "125cm (38-40)"],
    colors: [
      { name: "Cognac Brown", hex: "#6E3E1C" },
      { name: "Jet Black", hex: "#141414" }
    ],
    inStock: true
  },
  {
    id: "summer-06",
    name: "Summerland Heavyweight 240GSM Cotton Tee",
    category: "tshirts",
    price: 890,
    originalPrice: 1150,
    badge: "Daily Essential",
    rating: 4.9,
    reviewsCount: 71,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    description: "Heavyweight 100% combed cotton tee. Pre-shrunk, drop-shoulder streetwear cut, and reinforced double-stitched rib collar.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Bone White", hex: "#F3F1EB" },
      { name: "Washed Black", hex: "#222224" },
      { name: "Earthy Olive", hex: "#5C6352" }
    ],
    inStock: true
  },
  {
    id: "summer-07",
    name: "Raw Selvedge Straight-Leg Denim",
    category: "jeans",
    price: 2450,
    originalPrice: 2950,
    badge: "Excellence Tier",
    rating: 5.0,
    reviewsCount: 29,
    image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&auto=format&fit=crop&q=80",
    description: "Authentic red-line selvedge denim imported from premier Turkish mills. Heavyweight structure that breaks in uniquely to your body.",
    sizes: ["30", "32", "34", "36"],
    colors: [
      { name: "Raw Dark Indigo", hex: "#121C2B" }
    ],
    inStock: true
  },
  {
    id: "summer-08",
    name: "Luxury Mercerized Cotton Minimalist Crewneck",
    category: "tshirts",
    price: 980,
    originalPrice: 1300,
    badge: "Mercerized Finish",
    rating: 5.0,
    reviewsCount: 39,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80",
    description: "Silk-smooth mercerized cotton with a natural subtle luster. Keeps you cool under the Adama sun with an elevated smart-casual fit.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Crisp White", hex: "#FFFFFF" },
      { name: "Classic Navy", hex: "#18233C" },
      { name: "Pitch Black", hex: "#000000" }
    ],
    inStock: true
  }
];

// Delivery Locations in Adama (Ethiopia)
const ADAMA_LOCALITIES = [
  "Pick up at Summerland (Next to Ras Hotel)",
  "Posta Bet / City Center (Adama)",
  "Bole Adama",
  "ASTU Campus (Adama Science & Tech)",
  "Kebele 03 / Kebele 04",
  "Arada / Adama Stadium",
  "Dembella Area",
  "Bokku Sheno",
  "Wonji Road Junction"
];
