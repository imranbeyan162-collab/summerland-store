// Samarland Store Core Application Logic
// Inspired by Bekollo Telegram Mini App & Modern Ethiopian E-Commerce

// Application State
let currentCategory = 'all';
let searchQuery = '';
let currentSort = 'featured';
let activeModalProduct = null;
let selectedModalSize = null;
let selectedModalColor = null;
let modalQuantity = 1;

let cart = JSON.parse(localStorage.getItem('samarland_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('samarland_wishlist')) || [];

// Telegram WebApp Initialization
document.addEventListener('DOMContentLoaded', () => {
  initTelegramWebApp();
  renderProducts();
  updateCartBadges();
  updateWishlistBadges();
  lucide.createIcons();
});

function initTelegramWebApp() {
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    
    // Customize Header / Background
    if (tg.setHeaderColor) tg.setHeaderColor('#FFFFFF');
    if (tg.setBackgroundColor) tg.setBackgroundColor('#F8F9FA');

    // Retrieve user data if launched within Telegram
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
      const user = tg.initDataUnsafe.user;
      const userName = user.first_name + (user.last_name ? ' ' + user.last_name : '');
      const userPhoto = user.photo_url;
      
      const nameEl = document.getElementById('user-display-name');
      if (nameEl) nameEl.textContent = userName;
      
      if (userPhoto) {
        const avatarImg = document.getElementById('user-avatar-img');
        if (avatarImg) avatarImg.src = userPhoto;
      }
    }
  }
}

// ==================== RENDERING PRODUCTS ====================
function renderProducts() {
  const grid = document.getElementById('products-grid');
  const emptyMsg = document.getElementById('no-products-msg');
  const countLabel = document.getElementById('product-count-label');
  
  if (!grid) return;

  // Filter items
  let filtered = PRODUCTS_DATA.filter(p => {
    const matchCategory = currentCategory === 'all' || 
      (currentCategory === 'new' ? p.badge.includes('New') : p.category === currentCategory);
    
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  // Sort items
  if (currentSort === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  // Update product count label
  if (countLabel) {
    countLabel.textContent = `Showing ${filtered.length} premium item${filtered.length === 1 ? '' : 's'}`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    emptyMsg.classList.remove('hidden');
    return;
  }

  emptyMsg.classList.add('hidden');

  grid.innerHTML = filtered.map(product => {
    const isFav = wishlist.includes(product.id);
    return `
      <div class="product-card bg-white rounded-2xl border border-gray-100/90 shadow-sm overflow-hidden flex flex-col justify-between group cursor-pointer" onclick="openProductModal('${product.id}')">
        <!-- Image & Badges -->
        <div class="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden">
          <img 
            src="${product.image}" 
            alt="${product.name}" 
            loading="lazy"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          <!-- Wishlist Heart Button (Bekollo Style) -->
          <button 
            type="button"
            onclick="toggleWishlist(event, '${product.id}')"
            class="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center transition active:scale-90 hover:bg-white text-gray-700"
          >
            <i data-lucide="heart" class="w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-gray-600'}"></i>
          </button>

          <!-- Store Badge -->
          ${product.badge ? `
            <span class="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              ${product.badge}
            </span>
          ` : ''}
        </div>

        <!-- Details Info -->
        <div class="p-3 flex flex-col flex-1 justify-between">
          <div>
            <h4 class="font-bold text-gray-900 text-xs sm:text-sm line-clamp-1 group-hover:text-yellow-600 transition">
              ${product.name}
            </h4>
            <div class="flex items-center gap-1.5 mt-1">
              <span class="text-[11px] text-gray-400 font-medium">From</span>
              <span class="font-extrabold text-sm sm:text-base text-gray-900">Br ${product.price.toLocaleString()}</span>
              ${product.originalPrice ? `<span class="text-[10px] text-gray-400 line-through">Br ${product.originalPrice.toLocaleString()}</span>` : ''}
            </div>
          </div>

          <!-- Bekollo Style Yellow 'Select options' Pill Button -->
          <button 
            type="button"
            onclick="openProductModal('${product.id}'); event.stopPropagation();"
            class="mt-2.5 w-full bg-brand-yellow hover:bg-brand-yellowHover text-black font-extrabold text-xs py-2 px-3 rounded-xl shadow-sm transition active:scale-95 flex items-center justify-center gap-1"
          >
            <span>Select options</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

// ==================== CATEGORIES & SEARCH ====================
function setCategory(cat) {
  currentCategory = cat;
  
  // Highlight active category pill
  document.querySelectorAll('.cat-pill').forEach(btn => {
    if (btn.getAttribute('data-category') === cat) {
      btn.classList.add('active', 'bg-black', 'text-white');
      btn.classList.remove('bg-gray-100', 'text-gray-700');
    } else {
      btn.classList.remove('active', 'bg-black', 'text-white');
      btn.classList.add('bg-gray-100', 'text-gray-700');
    }
  });

  const titles = {
    all: "Featured Summerland Collection",
    jeans: "Signature Turkish Jeans & Denim",
    shirts: "Turkish Slim-Fit Dress Shirts",
    shoes: "Handcrafted Leather Shoes & Boots",
    coats: "Executive Overcoats & Suits",
    accessories: "Turkish Leather Belts & Accessories",
    tshirts: "Premium T-Shirts & Mercerized Cotton"
  };
  const titleEl = document.getElementById('category-title');
  if (titleEl) titleEl.textContent = titles[cat] || "Our Products";

  renderProducts();
}

function openGalleryModal() {
  const modal = document.getElementById('gallery-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
  }
}

function closeGalleryModal() {
  const modal = document.getElementById('gallery-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

function handleSearch(query) {
  searchQuery = query.trim();
  const clearBtn = document.getElementById('clear-search-btn');
  if (clearBtn) {
    if (searchQuery.length > 0) {
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
    }
  }
  renderProducts();
}

function clearSearch() {
  const input = document.getElementById('search-input');
  if (input) input.value = '';
  searchQuery = '';
  const clearBtn = document.getElementById('clear-search-btn');
  if (clearBtn) clearBtn.classList.add('hidden');
  setCategory('all');
}

function handleSort(sortType) {
  currentSort = sortType;
  renderProducts();
}

function resetToHome() {
  clearSearch();
  setCategory('all');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== PRODUCT DETAILS BOTTOM SHEET MODAL ====================
function openProductModal(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  activeModalProduct = product;
  selectedModalSize = product.sizes[0] || 'M';
  selectedModalColor = product.colors && product.colors.length > 0 ? product.colors[0].name : 'Default';
  modalQuantity = 1;

  // Set modal elements
  document.getElementById('modal-img').src = product.image;
  document.getElementById('modal-title').textContent = product.name;
  document.getElementById('modal-category').textContent = product.category.toUpperCase();
  document.getElementById('modal-badge').textContent = product.badge || 'Samarland Pick';
  document.getElementById('modal-description').textContent = product.description;
  document.getElementById('modal-qty').textContent = modalQuantity;
  document.getElementById('btn-cart-badge').textContent = modalQuantity;
  
  updateModalPrice();

  // Render sizes
  const sizesContainer = document.getElementById('modal-sizes-container');
  sizesContainer.innerHTML = product.sizes.map((size, idx) => {
    const isSelected = size === selectedModalSize;
    return `
      <button 
        type="button" 
        onclick="selectSize('${size}')" 
        class="size-chip w-11 h-11 rounded-full border text-xs font-bold flex items-center justify-center transition ${isSelected ? 'active bg-yellow-400 text-black border-yellow-400 font-extrabold' : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-100'}"
      >
        ${size}
      </button>
    `;
  }).join('');
  document.getElementById('selected-size-label').textContent = `Size: ${selectedModalSize}`;

  // Render colors
  const colorsSection = document.getElementById('color-section');
  const colorsContainer = document.getElementById('modal-colors-container');
  if (product.colors && product.colors.length > 0) {
    colorsSection.classList.remove('hidden');
    colorsContainer.innerHTML = product.colors.map((c, idx) => {
      const isSelected = c.name === selectedModalColor;
      return `
        <button 
          type="button"
          onclick="selectColor('${c.name}')"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition ${isSelected ? 'border-yellow-400 bg-yellow-50 text-black font-bold ring-1 ring-yellow-400' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}"
        >
          <span class="w-3 h-3 rounded-full border border-black/10 shadow-inner" style="background-color: ${c.hex};"></span>
          <span>${c.name}</span>
        </button>
      `;
    }).join('');
    document.getElementById('selected-color-label').textContent = selectedModalColor;
  } else {
    colorsSection.classList.add('hidden');
  }

  // Show modal
  const modal = document.getElementById('product-detail-modal');
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  lucide.createIcons();
}

function closeProductModal() {
  const modal = document.getElementById('product-detail-modal');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function updateModalPrice() {
  if (!activeModalProduct) return;
  const totalPrice = activeModalProduct.price * modalQuantity;
  document.getElementById('modal-price').textContent = `Br ${totalPrice.toLocaleString()}`;
  document.getElementById('modal-buy-now-text').textContent = `Buy Now · Br ${totalPrice.toLocaleString()}`;
  document.getElementById('btn-cart-badge').textContent = modalQuantity;
}

function incrementModalQty() {
  modalQuantity++;
  document.getElementById('modal-qty').textContent = modalQuantity;
  updateModalPrice();
}

function decrementModalQty() {
  if (modalQuantity > 1) {
    modalQuantity--;
    document.getElementById('modal-qty').textContent = modalQuantity;
    updateModalPrice();
  }
}

function selectSize(size) {
  selectedModalSize = size;
  document.getElementById('selected-size-label').textContent = `Size: ${size}`;
  document.querySelectorAll('#modal-sizes-container .size-chip').forEach(chip => {
    if (chip.textContent.trim() === size) {
      chip.classList.add('active', 'bg-yellow-400', 'text-black', 'border-yellow-400', 'font-extrabold');
      chip.classList.remove('border-gray-200', 'text-gray-700', 'bg-white');
    } else {
      chip.classList.remove('active', 'bg-yellow-400', 'text-black', 'border-yellow-400', 'font-extrabold');
      chip.classList.add('border-gray-200', 'text-gray-700', 'bg-white');
    }
  });
}

function selectColor(colorName) {
  selectedModalColor = colorName;
  document.getElementById('selected-color-label').textContent = colorName;
  openProductModal(activeModalProduct.id); // re-render buttons
}

// ==================== CART ACTIONS ====================
function addToCartFromModal() {
  if (!activeModalProduct) return;

  const existingIndex = cart.findIndex(item => 
    item.id === activeModalProduct.id && 
    item.size === selectedModalSize && 
    item.color === selectedModalColor
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity += modalQuantity;
  } else {
    cart.push({
      id: activeModalProduct.id,
      name: activeModalProduct.name,
      price: activeModalProduct.price,
      image: activeModalProduct.image,
      size: selectedModalSize,
      color: selectedModalColor,
      quantity: modalQuantity
    });
  }

  saveCart();
  updateCartBadges();
  showToast(`Added ${modalQuantity}x ${activeModalProduct.name} to Cart!`);
  closeProductModal();
}

function buyNowFromModal() {
  addToCartFromModal();
  openCartDrawer();
}

function saveCart() {
  localStorage.setItem('samarland_cart', JSON.stringify(cart));
}

function updateCartBadges() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const headerBadge = document.getElementById('cart-badge-count');
  if (headerBadge) headerBadge.textContent = totalCount;
  
  const bottomBadge = document.getElementById('bottom-cart-badge-count');
  if (bottomBadge) bottomBadge.textContent = totalCount;

  const titleCount = document.getElementById('cart-count-title');
  if (titleCount) titleCount.textContent = `${totalCount} item${totalCount === 1 ? '' : 's'}`;
}

function openCartDrawer() {
  renderCartItems();
  const drawer = document.getElementById('cart-drawer');
  drawer.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  lucide.createIcons();
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  drawer.classList.add('hidden');
  document.body.style.overflow = '';
}

function renderCartItems() {
  const container = document.getElementById('cart-items-container');
  const footer = document.getElementById('cart-footer');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center">
        <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-yellow-50 text-yellow-500 flex items-center justify-center">
          <i data-lucide="shopping-bag" class="w-8 h-8"></i>
        </div>
        <h4 class="font-extrabold text-base text-gray-900">Your Cart is empty</h4>
        <p class="text-xs text-gray-400 mt-1">Discover best jeans & t-shirts in Adama</p>
        <button onclick="closeCartDrawer(); setCategory('all')" class="mt-4 bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs px-5 py-2.5 rounded-full shadow transition">
          Start Shopping
        </button>
      </div>
    `;
    if (footer) footer.classList.add('hidden');
    lucide.createIcons();
    return;
  }

  if (footer) footer.classList.remove('hidden');

  let subtotal = 0;

  container.innerHTML = cart.map((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    return `
      <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-20 rounded-xl object-cover bg-white shrink-0">
        <div class="flex-1 min-w-0">
          <h4 class="font-bold text-gray-900 text-xs truncate">${item.name}</h4>
          <p class="text-[11px] text-gray-500 mt-0.5">
            Size: <span class="font-bold text-gray-800">${item.size}</span>
            ${item.color ? `• Color: <span class="font-bold text-gray-800">${item.color}</span>` : ''}
          </p>
          <div class="flex items-center justify-between mt-2">
            <span class="font-extrabold text-xs text-gray-900">Br ${itemTotal.toLocaleString()}</span>
            <div class="flex items-center gap-2 bg-white rounded-full px-2 py-0.5 border border-gray-200">
              <button onclick="updateCartItemQty(${index}, -1)" class="w-5 h-5 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold">
                <i data-lucide="minus" class="w-3 h-3"></i>
              </button>
              <span class="text-xs font-bold w-4 text-center">${item.quantity}</span>
              <button onclick="updateCartItemQty(${index}, 1)" class="w-5 h-5 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold">
                <i data-lucide="plus" class="w-3 h-3"></i>
              </button>
            </div>
          </div>
        </div>
        <button onclick="removeCartItem(${index})" class="text-gray-400 hover:text-rose-500 p-1">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
    `;
  }).join('');

  document.getElementById('cart-subtotal').textContent = `Br ${subtotal.toLocaleString()}`;
  document.getElementById('cart-total').textContent = `Br ${subtotal.toLocaleString()}`;
  document.getElementById('checkout-total-amt').textContent = `Br ${subtotal.toLocaleString()}`;

  lucide.createIcons();
}

function updateCartItemQty(index, delta) {
  if (cart[index]) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    saveCart();
    updateCartBadges();
    renderCartItems();
  }
}

function removeCartItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartBadges();
  renderCartItems();
  showToast("Item removed from cart");
}

// ==================== WISHLIST / FAVORITES ====================
function toggleWishlist(e, productId) {
  e.stopPropagation();
  const index = wishlist.indexOf(productId);
  if (index > -1) {
    wishlist.splice(index, 1);
    showToast("Removed from wishlist");
  } else {
    wishlist.push(productId);
    showToast("Saved to Samarland wishlist! ❤️");
  }

  localStorage.setItem('samarland_wishlist', JSON.stringify(wishlist));
  updateWishlistBadges();
  renderProducts();
}

function updateWishlistBadges() {
  const count = wishlist.length;
  const badge = document.getElementById('wishlist-badge-count');
  if (badge) {
    if (count > 0) {
      badge.textContent = count;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }
}

function openWishlistDrawer() {
  if (wishlist.length === 0) {
    showToast("Your wishlist is empty! Heart items to save them.");
    return;
  }
  // Filter products by wishlist
  searchQuery = '';
  currentCategory = 'all';
  const grid = document.getElementById('products-grid');
  const countLabel = document.getElementById('product-count-label');
  const titleEl = document.getElementById('category-title');
  
  if (titleEl) titleEl.textContent = "Your Wishlist ❤️";
  const favProducts = PRODUCTS_DATA.filter(p => wishlist.includes(p.id));
  
  if (countLabel) countLabel.textContent = `Showing ${favProducts.length} saved item${favProducts.length === 1 ? '' : 's'}`;
  
  // Re-render only wishlist items
  grid.innerHTML = favProducts.map(product => {
    return `
      <div class="product-card bg-white rounded-2xl border border-gray-100/90 shadow-sm overflow-hidden flex flex-col justify-between group cursor-pointer" onclick="openProductModal('${product.id}')">
        <div class="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden">
          <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
          <button onclick="toggleWishlist(event, '${product.id}')" class="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center text-rose-500">
            <i data-lucide="heart" class="w-4 h-4 fill-rose-500 text-rose-500"></i>
          </button>
        </div>
        <div class="p-3">
          <h4 class="font-bold text-gray-900 text-xs sm:text-sm line-clamp-1">${product.name}</h4>
          <span class="font-extrabold text-sm text-gray-900 block mt-1">Br ${product.price.toLocaleString()}</span>
          <button onclick="openProductModal('${product.id}'); event.stopPropagation();" class="mt-2.5 w-full bg-brand-yellow font-extrabold text-xs py-2 px-3 rounded-xl shadow-sm text-black">
            Select options
          </button>
        </div>
      </div>
    `;
  }).join('');
  
  lucide.createIcons();
}

// ==================== CHECKOUT & ORDER DISPATCH ====================
function openCheckoutModal() {
  if (cart.length === 0) {
    showToast("Please add items to cart before checkout!");
    return;
  }
  closeCartDrawer();
  const modal = document.getElementById('checkout-modal');
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  lucide.createIcons();
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function buildOrderMessage(name, phone, locality, address, paymentMethod) {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let msg = `🛍️ *NEW ORDER - SUMMERLAND (ADAMA)*\n`;
  msg += `_Style On Point • Next to Ras Hotel_\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `👤 *Customer:* ${name}\n`;
  msg += `📞 *Phone:* +251 ${phone}\n`;
  msg += `📍 *Delivery / Pickup:* ${locality}\n`;
  msg += `🏠 *Address / Notes:* ${address}\n`;
  msg += `💳 *Payment Method:* ${paymentMethod}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📦 *ITEMS ORDERED:*\n`;

  cart.forEach((item, i) => {
    msg += `${i + 1}. *${item.name}*\n`;
    msg += `   └ Size: ${item.size}${item.color ? ' | Color: ' + item.color : ''}\n`;
    msg += `   └ Qty: ${item.quantity} × Br ${item.price.toLocaleString()} = *Br ${(item.price * item.quantity).toLocaleString()}*\n`;
  });

  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💰 *TOTAL AMOUNT: Br ${total.toLocaleString()}*\n`;
  msg += `📍 *Summerland Adama (TikTok: @summerlandfashion)*\n`;
  msg += `✨ *Not for everyone. For those who appreciate excellence.*`;

  return msg;
}

function handlePlaceOrder(e) {
  e.preventDefault();
  const name = document.getElementById('cust-name').value;
  const phone = document.getElementById('cust-phone').value;
  const locality = document.getElementById('cust-locality').value;
  const address = document.getElementById('cust-address').value;
  const paymentMethod = document.querySelector('input[name="payment_method"]:checked')?.value || 'Telebirr';

  const orderText = buildOrderMessage(name, phone, locality, address, paymentMethod);
  
  // Send via Telegram WebApp or Open Telegram Bot link
  const encodedMsg = encodeURIComponent(orderText);
  const telegramBotUrl = `https://t.me/samarland_adama?text=${encodedMsg}`;
  
  if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.sendData) {
    window.Telegram.WebApp.sendData(JSON.stringify({
      orderText,
      name,
      phone,
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    }));
  }

  // Open Telegram Chat
  window.open(telegramBotUrl, '_blank');

  // Clear cart and show congratulations
  cart = [];
  saveCart();
  updateCartBadges();
  closeCheckoutModal();
  showToast("🎉 Order placed! Opening Telegram to confirm with Samarland...");
}

function handleWhatsAppOrder() {
  const name = document.getElementById('cust-name').value || 'Customer';
  const phone = document.getElementById('cust-phone').value || '';
  const locality = document.getElementById('cust-locality').value;
  const address = document.getElementById('cust-address').value || 'Adama';
  const paymentMethod = document.querySelector('input[name="payment_method"]:checked')?.value || 'Telebirr';

  const orderText = buildOrderMessage(name, phone, locality, address, paymentMethod);
  const waUrl = `https://wa.me/251912345678?text=${encodeURIComponent(orderText)}`;
  
  window.open(waUrl, '_blank');
  
  cart = [];
  saveCart();
  updateCartBadges();
  closeCheckoutModal();
  showToast("Order forwarded to WhatsApp!");
}

// ==================== PROFILE & CONTACT MODALS ====================
function openProfileModal() {
  document.getElementById('profile-modal').classList.remove('hidden');
  lucide.createIcons();
}

function closeProfileModal() {
  document.getElementById('profile-modal').classList.add('hidden');
}

function openContactModal() {
  openProfileModal();
}

// ==================== TOAST FEEDBACK ====================
function showToast(message) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-message');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.remove('opacity-0', 'translate-y-[-10px]', 'pointer-events-none');
  toast.classList.add('opacity-100', 'translate-y-0');

  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-[-10px]', 'pointer-events-none');
  }, 2500);
}
