document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    window.location.href = 'login-register.html';
    return;
  }

  const title = document.querySelector(".moving-title");
  const text = title.textContent;
  title.textContent = "";
  [...text].forEach((char, i) => {
    const span = document.createElement("span");
    span.textContent = char;
    if (char !== " ") {
      span.style.animationDelay = `${i * 0.1}s`;
    } else {
      span.style.display = "inline";
    }
    title.appendChild(span);
  });

  const cartBody = document.getElementById('cart-body');
  const totalSpan = document.getElementById('total');

  try {
    const res = await fetch('https://ecommerce.routemisr.com/api/v1/cart', {
      headers: { token }
    });
    const data = await res.json();

    const products = data.data.products || [];

    products.forEach(product => {
      const row = document.createElement('tr');
      row.dataset.id = product.product.id;
      row.innerHTML = `
        <td><img src="${product.product.imageCover}" alt="${product.product.title}" class="img-fluid" style="width:50px;height:50px;object-fit:cover;"></td>
        <td>${product.product.title}</td>
        <td class="price-cell">${product.price} EGP</td>
        <td class="text-center">
          <input type="number" min="1" value="${product.count}" class="form-control form-control-sm quantity-input mx-auto" style="width:70px;">
        </td>
        <td class="item-total">${product.price * product.count} EGP</td>
        <td>
          <button class="btn btn-danger btn-sm remove-btn">Remove</button>
        </td>
      `;
      cartBody.appendChild(row);
    });

    updateTotal(data.data.totalCartPrice);
    attachEvents();

  } catch (error) {
    console.error('Error loading cart:', error)
  } finally {

  }

  function updateTotal(total) {
    totalSpan.textContent = total;
  }

  function attachEvents() {
    document.querySelectorAll(".quantity-input").forEach(input => {
      input.addEventListener("change", async function () {
        const row = this.closest('tr');
        const productId = row.dataset.id;
        const newQty = parseInt(this.value);

        if (newQty >= 1) {
          try {
            const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                token
              },
              body: JSON.stringify({ count: newQty })
            });
            const data = await res.json();

            if (res.ok) {
              const product = data.data.products.find(p => p.product.id === productId);
              row.querySelector(".item-total").textContent = `${product.price * product.count} EGP`;
              updateTotal(data.data.totalCartPrice);
            } else {
              console.error('Update quantity failed:', data.message);
            }
          } catch (error) {
            console.error('Error updating quantity:', error);
          }
        }
      });
    });

    document.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", async function () {
        const row = this.closest('tr');
        const productId = row.dataset.id;

        try {
          const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
            method: 'DELETE',
            headers: { token }
          });
          const data = await res.json();

          if (res.ok) {
            row.remove();
            updateTotal(data.data.totalCartPrice);
          } else {
            console.error('Remove failed:', data.message);
          }
        } catch (error) {
          console.error('Error removing product:', error);
        }
      });
    });
  }
});
