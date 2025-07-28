document.addEventListener('DOMContentLoaded', () => {
    const ordersList = document.getElementById('orders-list');
    const emptyMessage = document.getElementById('empty-message');
    const currentUserToken = localStorage.getItem('userToken');

    let userName = localStorage.getItem('userName');
    let ordersKey = `orders_${userName}`;

    let orders = JSON.parse(localStorage.getItem(ordersKey)) || [];


    if (orders.length === 0) {
        emptyMessage.style.display = 'block';
    } else {
        orders.forEach(order => {
        const card = document.createElement('div');
        card.className = 'order-card mb-3 p-3';

        card.innerHTML = `
            <div class="order-header d-flex justify-content-between mb-2">
            <span><strong>${order.customerName}</strong></span>
            <span>${order.date}</span>
            </div>
            <p>Order #: <strong>${order.id}</strong></p>
            <p>Address: ${order.address}</p>
            <p>Total: <strong>${order.total} EGP</strong></p>
            <div class="order-products d-flex flex-wrap gap-2">
            ${order.products.map(p => `
                <div class="order-product text-center">
                <img src="${p.image}" alt="${p.title}" style="width:50px; height:50px; object-fit:cover;">
                <div style="font-size:0.9em;">${p.title}</div>
                <div>x${p.count}</div>
                </div>
            `).join('')}
            </div>
        `;
        ordersList.appendChild(card);
        });
    }
});
