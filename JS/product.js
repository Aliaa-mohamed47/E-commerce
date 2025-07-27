// File: products.js - Display products - Fatma & Rawan

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


// subscribe form validation
const form = document.getElementById("subscribeForm");
const emailInput = document.getElementById("emailInput");
const emailMessage = document.getElementById("emailMessage");

form.addEventListener("submit", function (e) {
  e.preventDefault();      // prevent refresh after clicking 'submit'
  const email = emailInput.value.trim();
  const valid = email.includes("@") && email.includes(".com");
  if (email == "") {
    emailMessage.textContent = "Please enter your email.";
    emailMessage.style.color = "red";
  } else if (!valid) {
    emailMessage.textContent = "Enter a valid email.";
    emailMessage.style.color = "red";
  } else {
    emailMessage.textContent = "Thank you for subscribing!";
    emailMessage.style.color = "#1ca429ff";
    emailInput.value = "";    // ba3d ma ye3mel submit yeshel el email
  }
  setTimeout(() => {
      emailMessage.textContent = "";
    }, 4000);
});

 

// --------------------------------------------------------------------------------------------------------------------------------
// product details

// quantity button
function increaseValue() {
  const increase = document.getElementById("quantityInput");
  increase.value = parseInt(increase.value) + 1;
}

function decreaseValue() {
  const decrease = document.getElementById("quantityInput");
  if (parseInt(decrease.value) > 1) {
    decrease.value = parseInt(decrease.value) - 1;
  }
}



/*// changing product details pictures & border color
function changeMainImage(clickedImg) {
  document.getElementById('mainImage').src = clickedImg.src;
  const x = document.querySelectorAll('.smallImg');
  x.forEach(div => div.classList.remove('selected'));
  clickedImg.parentElement.classList.add('selected');
}*/




// --------------------------------------------------------------------------------------------------------------------------------
// fetching

// fetching 3 products in home page
if (window.location.pathname.includes("index.html")) {
fetch("https://ecommerce.routemisr.com/api/v1/products")
  .then(response => response.json())
  .then(data => {
  const allProducts = data.data;

  const menProducts = allProducts.filter(product =>
  product.category.name.toLowerCase() === "men's fashion"
  );
  const twoMenProducts = menProducts.slice(0, 2);
  const womenProduct = allProducts.find(product =>
  product.category.name.toLowerCase() === "women's fashion"
  );
  const selectedProducts = [...twoMenProducts, womenProduct];
   
  const productCards = document.querySelectorAll(".products");
  selectedProducts.forEach((product, index) => {
  const card = productCards[index];
  const img = card.querySelector("img");
  const title = card.querySelector("h5");
  const price = card.querySelector("p");
  const button = card.querySelector(".viewDetails");

  img.src = product.imageCover;
  title.textContent = product.title;
  price.textContent = `EGP ${product.price}`;
   button.onclick = () => {
     console.log(product._id);
        window.location.href = `product.html?id=${product._id}`;
      };
  });
  })
  .catch(error => {
    console.error("Error fetching products:", error);
  });
}



// displaying details of each product clicked
if (window.location.pathname.includes("product.html")) {
  const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

if (productId) {
  fetch(`https://ecommerce.routemisr.com/api/v1/products/${productIdd}`)
    .then(res => res.json())
    .then(data => {
      const product = data.data;
      document.getElementById('mainImage').src = product.imageCover;
      document.querySelector('.product-title').textContent = product.title;
        });
}
}




/*const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

if (productId) {
  fetch(`https://ecommerce.routemisr.com/api/v1/products/${productId}`)
    .then(res => res.json())
    .then(data => {
      const product = data.data;
      console.log(product);

      // Main image
      document.getElementById('mainImage').src = product.imageCover;

      // Title
      document.querySelector('.product-title').textContent = product.title;

      // Rating
      document.querySelector('.product-rating').innerHTML = `
        ${product.ratingsAverage} <i class="fa-solid fa-star"></i> (${product.ratingsQuantity} reviews)
      `;

      // Price
      document.getElementById('discountPrice').textContent = `EGP ${product.price}`;
      if (product.priceAfterDiscount && product.priceAfterDiscount < product.price) {
        document.getElementById('originalPrice').textContent = `EGP ${product.price}`;
        document.getElementById('originalPrice').style.display = "inline";
        document.querySelector('.discount-badge').style.display = "inline-block";
      } else {
        document.getElementById('originalPrice').style.display = "none";
        document.querySelector('.discount-badge').style.display = "none";
      }

      // Description
      document.querySelector('.product-description').innerHTML = `
        <strong>Description:</strong><br> ${product.description || "No description available"}
      `;

      // Brand (you can change 'Modance' if you want dynamic brand from `product.brand`)
      document.querySelector('.product-brand').innerHTML = `
        <strong>Brand:</strong> Modance
      `;

      // Category
      let categoryText = "Unknown";
      if (product.category && product.category.name) {
        categoryText = product.category.name;
      }
      document.querySelector('.product-category').innerHTML = `
        <strong>Category:</strong> ${categoryText}
      `;

      // Small images
      const container = document.querySelector('.small-images-container');
      container.innerHTML = '';
      product.images.forEach((img, idx) => {
        const div = document.createElement('div');
        div.className = 'smallImg rounded-4 shadow-lg border border-3 border-secondary-subtle';
        if (idx === 0) div.classList.add('selected');
        div.innerHTML = `<img src="${img}" class="w-100 h-100" onclick="changeMainImage(this)">`;
        container.appendChild(div);
      });

    })
    .catch(err => {
      console.error("Error fetching product:", err);
    });
} else {
  console.error("No product ID found in URL");
}

// Change main image when thumbnail clicked
function changeMainImage(clickedImg) {
  document.getElementById('mainImage').src = clickedImg.src;
  document.querySelectorAll('.smallImg').forEach(div => div.classList.remove('selected'));
  clickedImg.parentElement.classList.add('selected');
}*/
