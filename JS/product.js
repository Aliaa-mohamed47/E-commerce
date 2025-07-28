const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

if (productId) {
  fetch(`https://ecommerce.routemisr.com/api/v1/products/${productId}`)
    .then(res => res.json())
    .then(data => {
      const product = data.data;
      console.log(product); // للمتابعة في الكونسول

      // الصورة الرئيسية
      document.getElementById('mainImage').src = product.imageCover;

      // العنوان
      document.querySelector('.product-title').textContent = product.title;

      // التقييم
      document.querySelector('.product-rating').innerHTML =
        `${product.ratingsAverage} <i class="fa-solid fa-star"></i> (${product.ratingsQuantity} reviews)`;

      // السعر والخصم
      const discountPriceElement = document.getElementById('discountPrice');
      const originalPriceElement = document.getElementById('originalPrice');

      discountPriceElement.textContent = `EGP ${product.priceAfterDiscount && product.priceAfterDiscount < product.price
        ? product.priceAfterDiscount
        : product.price}`;

      if (product.priceAfterDiscount && product.priceAfterDiscount < product.price) {
        originalPriceElement.textContent = `EGP ${product.price}`;
        originalPriceElement.style.display = "inline";
      } else {
        originalPriceElement.style.display = "none";
      }

      // الوصف
      document.querySelector('.product-description').innerHTML =
        `<strong>Description:</strong><br> ${product.description || "No description available"}`;

      // الكاتيجوري
      document.querySelector('.product-category').innerHTML =
        `<strong>Category:</strong> ${product.category?.name || "Unknown"}`;

      // الصور الصغيرة
      const container = document.querySelector('.small-images-container');
      container.innerHTML = '';
      product.images.forEach((img, idx) => {
        const div = document.createElement('div');
        div.className = 'smallImg rounded-4 shadow-lg border border-3 border-secondary-subtle';
        if (idx === 0) div.classList.add('selected');
        div.innerHTML = `<img src="${img}" class="w-100 h-100" onclick="changeMainImage(this)">`;
        container.appendChild(div);
      });

      // ---------------------------
      // زرار Add to Cart
      const addToCartBtn = document.querySelector('.AddToCart');
      const quantityInput = document.getElementById('quantityInput');

      const warningMsg = document.createElement('p');
      warningMsg.className = "text-danger mt-2 small";
      addToCartBtn.parentElement.appendChild(warningMsg);

      const successMsg = document.createElement('p');
      successMsg.className = "text-success mt-2 small";
      addToCartBtn.parentElement.appendChild(successMsg);

      addToCartBtn.onclick = async () => {
        warningMsg.textContent = "";
        successMsg.textContent = "";

        const token = localStorage.getItem('userToken');
        const count = parseInt(quantityInput.value);

        if (!token) {
          warningMsg.textContent = "⚠️ You must log in before adding to cart.";
          return;
        }

        if (count <= 0) {
          warningMsg.textContent = "Please select a valid quantity.";
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
              productId: product.id,
              count: count
            })
          });
          const data = await res.json();

          if (res.ok) {
            successMsg.textContent = `✅ You added ${count} item(s) to your cart.`;
          } else {
            warningMsg.textContent = data.message || "❌ Failed to add to cart.";
          }
        } catch (err) {
          warningMsg.textContent = "❌ Error adding to cart.";
          console.error(err);
        }
      };
      // ---------------------------

    })
    .catch(err => {
      console.error("Error fetching product:", err);
    });
} else {
  console.error("No product ID found in URL");
}

// دالة تغيير الصورة الرئيسية
function changeMainImage(clickedImg) {
  document.getElementById('mainImage').src = clickedImg.src;
  document.querySelectorAll('.smallImg').forEach(div => div.classList.remove('selected'));
  clickedImg.parentElement.classList.add('selected');
}

// quantity buttons
function increaseValue() {
  const input = document.getElementById("quantityInput");
  input.value = parseInt(input.value) + 1;
}
function decreaseValue() {
  const input = document.getElementById("quantityInput");
  if (parseInt(input.value) > 1) {
    input.value = parseInt(input.value) - 1;
  }
}


