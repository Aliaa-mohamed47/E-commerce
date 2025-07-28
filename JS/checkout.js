document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    window.location.href = 'login-register.html';
    return;
  }

  let cartId = null;
  try {
    const res = await fetch('https://ecommerce.routemisr.com/api/v1/cart', { headers: { token } });
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

    const customerName = document.getElementById('name').value;
    const address = document.getElementById('address').value;

    spinner.classList.remove('d-none');
    showMessage('', '');

    try {
      // fetch cart data
      const cartRes = await fetch('https://ecommerce.routemisr.com/api/v1/cart', { headers: { token } });
      const cartData = await cartRes.json();
      const cart = cartData.data;

      if (!cart || !cart.products || cart.products.length === 0) {
        showMessage('❌ Your cart is empty!', 'danger');
        spinner.classList.add('d-none');
        return;
      }

      // place order
      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/${cartId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token },
        body: JSON.stringify({
          shippingAddress: { details: address, phone: "01000000000", city: "Cairo" }
        })
      });
      const result = await res.json();

      if (res.ok) {
        showMessage('✅ Order placed successfully!', 'success');
        form.reset();

        // generate order number
        let lastOrderNumber = parseInt(localStorage.getItem('lastOrderNumber')) || 0;
        let newOrderNumber = lastOrderNumber + 1;
        localStorage.setItem('lastOrderNumber', newOrderNumber);

        // create new order object
        const newOrder = {
          id: newOrderNumber,
          customerName: customerName,
          userToken: token,  // لربطه باليوزر
          date: new Date().toLocaleString(),
          total: cart.totalCartPrice,
          status: 'Pending',
          address: address,
          products: cart.products.map(p => ({
            id: p.product.id,
            title: p.product.title,
            price: p.price,
            count: p.count,
            image: p.product.imageCover
          }))
        };

        let userName = localStorage.getItem('userName'); // 👈 أو ممكن email لو مسجلاه
        let ordersKey = `orders_${userName}`;

        let orders = JSON.parse(localStorage.getItem(ordersKey)) || [];
        orders.push(newOrder);
        localStorage.setItem(ordersKey, JSON.stringify(orders));


        // ممكن تعملي تحويل لصفحة الطلبات
        // window.location.href = 'orders.html';
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
