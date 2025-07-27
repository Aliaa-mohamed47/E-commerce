 document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById("products-row");
  const loading = document.getElementById("loading");
  let products = [];
  let cards = [];

  loading.style.display = "block";

  fetch("https://ecommerce.routemisr.com/api/v1/products")
    .then(res => res.json())
    .then(data => {
      products = data.data.filter(prod => prod.category?.name !== 'Electronics');
      loading.style.display = "none";

      cards = products.map(prod => createProductCard(prod));

      cards.forEach(card => container.appendChild(card));
      initCardEvents(products);
    })
    .catch(err => {
      console.error("Error:", err);
      loading.style.display = "none";
    });

  function createProductCard(prod) {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4 product-card";
    col.dataset.category = prod.category?.name?.toLowerCase().includes('women') ? 'women' : 'men';

    col.innerHTML = `
      <div class="card h-100 shadow-sm f60">
        <img src="${prod.imageCover}" class="card-img-top" alt="${prod.title}">
        <div class="card-body">
          <h5 class="card-title f10">${prod.title}</h5>
          <p class="card-text f15">${prod.description.slice(0, 100)}...</p>
          <p class="text-muted">Price: ${prod.price} EGP</p>
          <div class="d-flex justify-content-center align-items-center gap-2">
            <button class="btn btn-outline-secondary minus">➖</button>
            <span class="count">0</span>
            <button class="btn btn-outline-secondary plus">➕</button>
          </div>
          <button class="btn btn-outline-primary mt-2 add-to-cart f5 w-100">Add to Cart</button>
          <button class="btn btn-outline-primary mt-2 view-details f5 w-100">View Details</button>
          <p class="cart-message mt-2 text-success small"></p>
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

      const filteredProducts = products.filter(prod =>
        filter === 'all' ? true :
        filter === 'women' ? prod.category?.name?.toLowerCase().includes('women') :
        prod.category?.name?.toLowerCase().includes('men')
      );
      initCardEvents(filteredProducts);
    });
  });

  function initCardEvents(prods) {
    const cardsOnPage = document.querySelectorAll('.product-card');
    cardsOnPage.forEach((card, idx) => {
      let count = 0;
      const product = prods[idx];
      const plusBtn = card.querySelector('.plus');
      const minusBtn = card.querySelector('.minus');
      const countSpan = card.querySelector('.count');
      const cartBtn = card.querySelector('.add-to-cart');
      const detailsBtn = card.querySelector('.view-details');
      const message = card.querySelector('.cart-message');

      plusBtn.onclick = () => {
        count++;
        countSpan.textContent = count;
      };
      minusBtn.onclick = () => {
        count = Math.max(0, count - 1);
        countSpan.textContent = count;
      };
      cartBtn.onclick = () => {
        if (count === 0) {
          message.textContent = "Please select a quantity first.";
          return;
        }
        message.textContent = `✅ You added ${count} item(s).`;
      };
      detailsBtn.onclick = () => {
        window.location.href = "product.html";
      };
    });
  }
});

