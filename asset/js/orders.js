const API_URL = 'http://localhost:3000/api';

async function getOrders() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/orders`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}

async function getOrder(orderId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/orders/${orderId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}

function displayOrders(orders) {
  const container = document.getElementById('orders-container');
  container.innerHTML = orders.map(order => `
    <div class="order-card">
      <h3>Order #${order.id}</h3>
      <p>Status: <span class="status-${order.status}">${order.status}</span></p>
      <p>Total: $${order.total}</p>
      <p>Date: ${new Date(order.created_at).toLocaleDateString()}</p>
      ${order.tracking_number ? `<p>Tracking: ${order.tracking_number}</p>` : ''}
      <a href="/order-detail.html?id=${order.id}">View Details</a>
    </div>
  `).join('');
}
