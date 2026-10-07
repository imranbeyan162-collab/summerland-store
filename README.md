# Samarland Fashion & Denim Store - Adama, Ethiopia 🇪🇹

A high-performance, mobile-first e-commerce web app and Telegram Mini App custom-designed for **Samarland** — Adama's top-rated store for premium jeans and t-shirts.

Inspired by the Bekollo Telegram Mini App architecture, but enhanced with sleek modern UI, buttery smooth bottom-sheet modals, instant cart calculations, and Adama local checkout.

---

## 🌟 Key Features

1. **Bekollo-Inspired UI & Elevated Design**:
   - Clean top header with Telegram integration link, dynamic Cart pill with live counter, and profile avatar.
   - Smooth category selector: All Items, Jeans & Denim, T-Shirts, Oversized Drops, New In Adama.
   - Grid product cards featuring real-time Birr pricing (`Br`), wishlist hearts, and vibrant yellow "Select options" buttons.
   - **Bottom-Sheet Modal** (matching screenshot 5): interactive size selector (`28, 30, 32, 34, 36` for jeans, `S, M, L, XL, XXL` for t-shirts), color swatches, quantity counter, and dual action: `Add to Cart` + `Buy Now · Br...`.

2. **Tailored for Adama & Ethiopia**:
   - Prices listed in Ethiopian Birr (`Br`).
   - Adama delivery selector (Posta Bet / City Center, Bole Adama, ASTU University Campus, Kebele 03/04, Arada / Stadium).
   - Ethiopian Payment methods: **Telebirr**, **CBE Birr**, and **Cash on Delivery**.
   - 1-Click order dispatch directly to Telegram Bot (`@samarland_adama` / `@samarland_bot`) or WhatsApp with complete pre-formatted order summary.

3. **Telegram Mini App (TMA) Ready**:
   - Integrates Telegram WebApp JS SDK (`Telegram.WebApp.ready()`, auto-expand, theme matching).
   - Detects Telegram user names & avatars automatically when opened inside Telegram.

---

## 🚀 How to Run Locally

You can simply open `index.html` in any web browser, or launch a local preview server:

```powershell
cd C:\Users\rjik\.gemini\antigravity\scratch\samarland-store
python -m http.server 3000
```
Then visit `http://localhost:3000` in your browser.

---

## 📸 Adding Your Own Product Photos

In `products.js`, you can easily replace the image URLs or add new products:
```javascript
{
  id: "samar-09",
  name: "Your Custom Samarland Jeans Name",
  category: "jeans", // 'jeans', 'tshirts', 'oversized'
  price: 1800, // in Birr
  image: "./images/your-photo.jpg", // drop photos in an images/ folder or use web link
  sizes: ["30", "32", "34", "36"],
  description: "Authentic Turkish denim sold at Samarland Adama.",
}
```
