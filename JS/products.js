document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById("products-row");
  const loading = document.getElementById("loading");
  let products = [];
  let cards = [];

  loading.style.display = "block";

  const params = new URLSearchParams(window.location.search);
  const keyword = params.get('search')?.toLowerCase();

  fetch("https://ecommerce.routemisr.com/api/v1/products")
    .then(res => res.json())
    .then(data => {
      products = data.data.filter(prod => prod.category?.name !== 'Electronics');

      if (keyword) {
        products = products.filter(prod =>
          prod.title.toLowerCase().includes(keyword)
        );
      }

      loading.style.display = "none";

      cards = products.map(prod => createProductCard(prod));

      cards.forEach(card => container.appendChild(card));
      initCardEvents();

      if (keyword) {
        const msg = document.createElement('p');
        msg.className = "text-center mt-3 fs-5";
        msg.textContent = `Showing results for: "${keyword}"`;
        container.before(msg);
      }
    })
    .catch(err => {
      console.error("Error:", err);
      loading.style.display = "none";
    });

  function createProductCard(prod) {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4 product-card";
    col.dataset.category = prod.category?.name?.toLowerCase().includes('women') ? 'women' : 'men';
    col.dataset.productId = prod.id; // ✅ أضفنا id هنا

    col.innerHTML = `
      <div class="card h-100 shadow-sm f60">
        <img src="${prod.imageCover}" class="card-img-top" alt="${prod.title}">
        <div class="card-body text-center">
          <h5 class="card-title f10 fa-2x fw-bold" style="color: #2c558f;">${prod.title}</h5>
          <p class="text-muted mb-2">Price: ${prod.price} EGP</p>
          <div class="d-flex justify-content-center align-items-center gap-2 mb-2">
            <button class="btn btn-outline-secondary minus">➖</button>
            <span class="count">0</span>
            <button class="btn btn-outline-secondary plus">➕</button>
          </div>
          <button class="btn btn-outline-primary mt-2 add-to-cart f5 w-100">Add to Cart</button>
          <button class="btn btn-outline-primary mt-2 view-details f5 w-100">View Details</button>
          <p class="cart-message mt-2 text-success small"></p>
          <p class="login-warning mt-2 text-danger small"></p>
        </div>
      </div>
    `;
    return col;
  }

  document.querySelectorAll('.filter-link').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.filter-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const filter = link.dataset.filter;
      container.innerHTML = '';

      let filtered = [];
      if (filter === 'all') {
        filtered = cards;
      } else {
        filtered = cards.filter(card => card.dataset.category === filter);
      }

      filtered.forEach(card => container.appendChild(card));

      initCardEvents(); // ✅ هنا بقى مش محتاجين نبعث prods، هنا بناخد من dataset
    });
  });

  function initCardEvents() {
    const cardsOnPage = document.querySelectorAll('.product-card');
    cardsOnPage.forEach((card) => {
      let count = 0;
      const productId = card.dataset.productId; // ✅ جبنا id من dataset
      const plusBtn = card.querySelector('.plus');
      const minusBtn = card.querySelector('.minus');
      const countSpan = card.querySelector('.count');
      const cartBtn = card.querySelector('.add-to-cart');
      const detailsBtn = card.querySelector('.view-details');
      const message = card.querySelector('.cart-message');
      const warning = card.querySelector('.login-warning');

      plusBtn.onclick = () => {
        count++;
        countSpan.textContent = count;
      };

      minusBtn.onclick = () => {
        count = Math.max(0, count - 1);
        countSpan.textContent = count;
      };

      cartBtn.onclick = async () => {
        const token = localStorage.getItem('userToken');
        warning.textContent = "";
        message.textContent = "";

        if (!token) {
          warning.textContent = "⚠️ You must log in before adding to cart.";
          return;
        }

        if (count === 0) {
          warning.textContent = "Please select a quantity first.";
          return;
        }

        try {
          const res = await fetch('https://ecommerce.routemisr.com/api/v1/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              token
            },
            body: JSON.stringify({
              productId: productId, // ✅ هنا id مباشر
              count: count
            })
          });
          const data = await res.json();

          if (res.ok) {
            message.textContent = `✅ You added ${count} item(s).`;
            warning.textContent = "";
          } else {
            warning.textContent = data.message || "❌ Failed to add to cart.";
          }
        } catch (err) {
          warning.textContent = "❌ Error adding to cart.";
          console.error(err);
        }
      };

      detailsBtn.onclick = () => {
        window.location.href = `product.html?id=${productId}`;
      };
    });
  }
});
