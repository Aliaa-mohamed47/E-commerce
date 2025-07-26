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

  let cartId = null;
  try {
    const res = await fetch('https://ecommerce.routemisr.com/api/v1/cart', {
      headers: { token }
    });
    const data = await res.json();
    cartId = data.data._id;
  } catch (error) {
    console.error('Error fetching cart:', error);
  }

  const form = document.getElementById('checkout-form');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'my-3 text-center';
  form.prepend(messageDiv);

  const spinner = document.createElement('div');
  spinner.className = 'spinner-border text-primary d-none';
  spinner.style.width = '2rem';
  spinner.style.height = '2rem';
  form.appendChild(spinner);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!cartId) {
      showMessage('❌ Cart not found! Please add products.', 'danger');
      return;
    }

    const address = document.getElementById('address').value;

    spinner.classList.remove('d-none');
    showMessage('', '');

    try {
      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/${cartId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token
        },
        body: JSON.stringify({
          shippingAddress: {
            details: address,
            phone: "01000000000",
            city: "Cairo"
          }
        })
      });

      const result = await res.json();

      if (res.ok) {
        showMessage('✅ Order placed successfully!', 'success');
        form.reset();
      } else {
        showMessage('❌ Failed: ' + result.message, 'danger');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      showMessage('❌ Something went wrong!', 'danger');
    } finally {
      spinner.classList.add('d-none');
    }
  });

  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `my-3 alert alert-${type}`;
  }
});
