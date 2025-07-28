document.addEventListener('DOMContentLoaded', async () => {
  const headerContainer = document.getElementById('header');
  if (headerContainer) {
    const response = await fetch('header.html');
    const headerHtml = await response.text();
    headerContainer.innerHTML = headerHtml;
    buildNavLinks();
  }
});

function buildNavLinks() {
  const navCenter = document.getElementById('nav-center-links');
  const navRight = document.getElementById('nav-right-links');
  const userName = localStorage.getItem('userName') || '';
  const firstName = userName.split(' ')[0];
  const currentPage = window.location.pathname.split('/').pop();

  let centerLinks = `
    <li class="nav-item mx-3">
      <a class="nav-link ${currentPage === 'index.html' ? 'active' : ''}" href="index.html">
        <i class="fas fa-home"></i> Home
      </a>
    </li>
    <li class="nav-item mx-3">
      <a class="nav-link ${currentPage === 'products.html' ? 'active' : ''}" href="products.html">
        <i class="fas fa-box-open"></i> Products
      </a>
    </li>
    <li class="nav-item mx-3">
      <a class="nav-link ${currentPage === 'cart.html' ? 'active' : ''}" href="cart.html">
        <i class="fas fa-shopping-cart"></i> View Cart
      </a>
    </li>
    <li class="nav-item mx-3">
      <a class="nav-link ${currentPage === 'orders.html' ? 'active' : ''}" href="orders.html">
        <i class="fas fa-shopping-cart"></i> View Orders
      </a>
    </li>
    <li class="nav-item mx-3">
      <form class="d-flex" role="search" id="searchForm">
        <input class="form-control form-control-sm me-2" type="search" placeholder="Search" aria-label="Search" id="searchInput">
        <button class="btn btn-outline-secondary btn-sm" type="submit"><i class="fas fa-search"></i></button>
      </form>
    </li>
  `;

  let rightLinks = '';
  if (userName) {
    rightLinks += `
      <li class="nav-item mx-2">
        <span class="nav-link">
          Hello, <span class="username-highlight">${firstName}</span>
        </span>
      </li>
      <li class="nav-item mx-2">
        <a class="nav-link" href="#" id="logoutBtn">
          <i class="fas fa-sign-out-alt"></i> Logout
        </a>
      </li>
    `;
  } else {
    rightLinks += `
      <li class="nav-item mx-2">
        <a class="nav-link ${currentPage === 'login-register.html' ? 'active' : ''}" href="login-register.html">
          <i class="fas fa-sign-in-alt"></i> Login
        </a>
      </li>
      <li class="nav-item mx-2">
        <a class="nav-link ${currentPage === 'login-register.html' ? 'active' : ''}" href="login-register.html">
          <i class="fas fa-user-plus"></i> Register
        </a>
      </li>
    `;
  }

  navCenter.innerHTML = centerLinks;
  navRight.innerHTML = rightLinks;

  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const searchInput = document.getElementById('searchInput');
      const keyword = searchInput.value.trim();
      if (keyword) {
        window.location.href = `products.html?search=${encodeURIComponent(keyword)}`;
      }
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userName');
      localStorage.removeItem('user');
      window.location.href = 'login-register.html';
    });
  }
}
fetch('footer.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('footer').innerHTML = data;
  })
  .catch(error => console.error('Error loading footer:', error));


  // go to top btn
let BackToTop = document.getElementById("backToTop")
BackToTop.onclick = () => {
    window.scrollTo ({
        top: 0,
        behavior: "smooth",
    })
}
window.onscroll = () => {
  if (window.scrollY > 300) {
    BackToTop.style.display = "block";
  } else {
    BackToTop.style.display = "none";
  }
};