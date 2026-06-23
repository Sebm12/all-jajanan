// ===== DATA PRODUK =====
const PRODUCTS = [
  {
    id: "sp01",
    name: "Sempol Ayam Original",
    desc: "Sempol ayam digoreng renyah, dicelup saus kacang gurih klasik.",
    price: 5000,
    unit: "/tusuk",
    cat: "original",
    emoji: "🍢",
    tag: null,
  },
  {
    id: "sp02",
    name: "Sempol Ayam Keju",
    desc: "Original plus taburan keju parut melimpah di atas saus kacang.",
    price: 7000,
    unit: "/tusuk",
    cat: "original",
    emoji: "🧀",
    tag: "Favorit",
  },
  {
    id: "sp03",
    name: "Sempol Pedas Level 1",
    desc: "Dicelup sambal cabe rawit pedas sedang, bikin nagih.",
    price: 6000,
    unit: "/tusuk",
    cat: "pedas",
    emoji: "🌶️",
    tag: "Pedas",
  },
  {
    id: "sp04",
    name: "Sempol Pedas Level 3",
    desc: "Untuk pencinta pedas sejati. Sambal full cabe rawit + bawang.",
    price: 6500,
    unit: "/tusuk",
    cat: "pedas",
    emoji: "🔥",
    tag: "Extra Pedas",
  },
  {
    id: "sp05",
    name: "Sempol Mozarella Pedas",
    desc: "Isian keju mozarella leleh, dicelup sambal pedas khas kami.",
    price: 8500,
    unit: "/tusuk",
    cat: "pedas",
    emoji: "🧀",
    tag: "Best Seller",
  },
  {
    id: "pk01",
    name: "Paket Hemat 5 Tusuk",
    desc: "5 tusuk campur (original & pedas) + saus tambahan gratis.",
    price: 22000,
    unit: "/paket",
    cat: "paket",
    emoji: "📦",
    tag: "Hemat",
  },
  {
    id: "pk02",
    name: "Paket Sempol + Es Teh",
    desc: "5 tusuk sempol original plus es teh manis segar.",
    price: 25000,
    unit: "/paket",
    cat: "paket",
    emoji: "🥤",
    tag: null,
  },
  {
    id: "mn01",
    name: "Es Teh Manis",
    desc: "Teh manis dingin segar, teman pas makan sempol pedas.",
    price: 4000,
    unit: "/gelas",
    cat: "minuman",
    emoji: "🧊",
    tag: null,
  },
  {
    id: "mn02",
    name: "Es Jeruk Segar",
    desc: "Perasan jeruk asli, manis asam segar.",
    price: 5000,
    unit: "/gelas",
    cat: "minuman",
    emoji: "🍊",
    tag: null,
  },
];

const WHATSAPP_NUMBER = "6281362046827"; // ganti dengan nomor WA toko

// ===== STATE =====
let cart = JSON.parse(localStorage.getItem("sempol_cart") || "{}");
let activeCat = "semua";

// ===== HELPERS =====
function formatRupiah(num) {
  return "Rp " + num.toLocaleString("id-ID");
}
function saveCart() {
  localStorage.setItem("sempol_cart", JSON.stringify(cart));
  renderCartCount();
  renderDrawer();
}
function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}
function cartTotalQty() {
  return Object.values(cart).reduce((a, b) => a + b, 0);
}
function cartSubtotal() {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = getProduct(id);
    return sum + (p ? p.price * qty : 0);
  }, 0);
}

// ===== RENDER PRODUCT GRID =====
function renderGrid() {
  const grid = document.getElementById("productGrid");
  const list =
    activeCat === "semua"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.cat === activeCat);
  grid.innerHTML = list
    .map((p) => {
      const qty = cart[p.id] || 0;
      return `
      <div class="card" data-id="${p.id}">
        <div class="card-img">
          ${p.tag ? `<span class="card-tag ${p.cat === "pedas" ? "spicy" : ""}">${p.tag}</span>` : ""}
          <span style="font-size:52px;">${p.emoji}</span>
        </div>
        <div class="card-body">
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <div class="card-foot">
            <div class="price">${formatRupiah(p.price)} <span>${p.unit}</span></div>
            <div>
              <button class="add-btn" data-action="add" data-id="${p.id}" style="${qty > 0 ? "display:none" : ""}" aria-label="Tambah ${p.name}">+</button>
              <div class="qty-control ${qty > 0 ? "show" : ""}" data-id="${p.id}">
                <button data-action="dec" data-id="${p.id}" aria-label="Kurangi">−</button>
                <span class="n">${qty}</span>
                <button data-action="inc" data-id="${p.id}" aria-label="Tambah">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

function updateCardQty(id) {
  const card = document.querySelector(`.card[data-id="${id}"]`);
  if (!card) return;
  const qty = cart[id] || 0;
  const addBtn = card.querySelector('[data-action="add"]');
  const qtyControl = card.querySelector(".qty-control");
  const n = card.querySelector(".n");
  if (qty > 0) {
    addBtn.style.display = "none";
    qtyControl.classList.add("show");
    n.textContent = qty;
  } else {
    addBtn.style.display = "";
    qtyControl.classList.remove("show");
  }
}

// ===== CART ACTIONS =====
function addToCart(id, showToastMsg = true) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  updateCardQty(id);
  if (showToastMsg) showToast("Ditambahkan ke keranjang");
}
function incItem(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  updateCardQty(id);
}
function decItem(id) {
  if (!cart[id]) return;
  cart[id] -= 1;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  updateCardQty(id);
}
function removeItem(id) {
  delete cart[id];
  saveCart();
  updateCardQty(id);
}

// ===== TOAST =====
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = "✅ " + msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

// ===== CART COUNT =====
function renderCartCount() {
  document.getElementById("cartCount").textContent = cartTotalQty();
}

// ===== DRAWER =====
function renderDrawer() {
  const body = document.getElementById("drawerBody");
  const foot = document.getElementById("drawerFoot");
  const entries = Object.entries(cart);

  if (entries.length === 0) {
    body.innerHTML = `
      <div class="empty-cart">
        <div class="e">🍢</div>
        <p>Keranjang masih kosong.<br>Yuk pilih sempol favoritmu dulu!</p>
      </div>`;
    foot.innerHTML = "";
    return;
  }

  body.innerHTML = entries
    .map(([id, qty]) => {
      const p = getProduct(id);
      if (!p) return "";
      return `
      <div class="cart-item" data-id="${id}">
        <div class="thumb">${p.emoji}</div>
        <div class="info">
          <h4>${p.name}</h4>
          <div class="row">
            <div class="qty-control show">
              <button data-action="dec" data-id="${id}" aria-label="Kurangi">−</button>
              <span class="n">${qty}</span>
              <button data-action="inc" data-id="${id}" aria-label="Tambah">+</button>
            </div>
            <strong style="font-size:14px;">${formatRupiah(p.price * qty)}</strong>
          </div>
          <button class="remove" data-action="remove" data-id="${id}">Hapus</button>
        </div>
      </div>
    `;
    })
    .join("");

  const subtotal = cartSubtotal();
  foot.innerHTML = `
    <div class="subtotal-row"><span>Subtotal</span><span>${formatRupiah(subtotal)}</span></div>
    <div class="total-row"><span>Total</span><span>${formatRupiah(subtotal)}</span></div>

    <div class="form-group">
      <label for="custName">Nama Pemesan</label>
      <input type="text" id="custName" placeholder="Nama kamu" required>
    </div>
    <div class="form-group">
      <label for="custPhone">Nomor WhatsApp</label>
      <input type="tel" id="custPhone" placeholder="08xxxxxxxxxx" required>
    </div>
    <div class="form-group">
      <label for="orderType">Metode Pesan</label>
      <select id="orderType">
        <option value="Ambil Sendiri">Ambil Sendiri di Tempat</option>
        <option value="Diantar">Diantar (alamat di catatan)</option>
      </select>
    </div>
    <div class="form-group">
      <label for="custNote">Catatan (opsional)</label>
      <textarea id="custNote" placeholder="Contoh: alamat antar, level pedas, dll."></textarea>
    </div>

    <button class="checkout-btn" id="checkoutBtn">Checkout via WhatsApp 🟢</button>
  `;

  document
    .getElementById("checkoutBtn")
    .addEventListener("click", handleCheckout);
}

// ===== CHECKOUT =====
function handleCheckout() {
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const orderType = document.getElementById("orderType").value;
  const note = document.getElementById("custNote").value.trim();

  if (!name || !phone) {
    showToast("Isi nama & nomor WA dulu ya");
    return;
  }

  const entries = Object.entries(cart);
  let message = `Halo D'Celup Sempol Ayam! 🍢\nSaya mau pesan:\n\n`;
  entries.forEach(([id, qty]) => {
    const p = getProduct(id);
    if (!p) return;
    message += `• ${p.name} x${qty} = ${formatRupiah(p.price * qty)}\n`;
  });
  message += `\nTotal: ${formatRupiah(cartSubtotal())}\n\n`;
  message += `Nama: ${name}\n`;
  message += `No. WA: ${phone}\n`;
  message += `Metode: ${orderType}\n`;
  if (note) message += `Catatan: ${note}\n`;
  message += `\nMohon konfirmasi pesanan saya ya, terima kasih! 🙏`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

// ===== DRAWER OPEN/CLOSE =====
function openDrawer() {
  document.getElementById("drawer").classList.add("show");
  document.getElementById("overlay").classList.add("show");
}
function closeDrawer() {
  document.getElementById("drawer").classList.remove("show");
  document.getElementById("overlay").classList.remove("show");
}

// ===== EVENT DELEGATION =====
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id;

  if (action === "add") addToCart(id);
  if (action === "inc") incItem(id);
  if (action === "dec") decItem(id);
  if (action === "remove") removeItem(id);
});

document.getElementById("cartToggle").addEventListener("click", openDrawer);
document.getElementById("drawerClose").addEventListener("click", closeDrawer);
document.getElementById("overlay").addEventListener("click", closeDrawer);

document.getElementById("catRow").addEventListener("click", (e) => {
  const pill = e.target.closest(".cat-pill");
  if (!pill) return;
  document
    .querySelectorAll(".cat-pill")
    .forEach((p) => p.classList.remove("active"));
  pill.classList.add("active");
  activeCat = pill.dataset.cat;
  renderGrid();
});

// Close drawer on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDrawer();
});

// ===== INIT =====
renderGrid();
renderCartCount();
renderDrawer();
