const API_URL = 'http://localhost:3000/api';
let stripe, elements, paymentElement;

async function initStripe() {
  const response = await fetch(`${API_URL}/payment/config`);
  const { publishableKey } = await response.json();
  stripe = Stripe(publishableKey);
}

async function checkout(items, shippingAddress, total) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/payment/create-payment-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ items, shippingAddress, amount: total })
  });

  const { clientSecret } = await response.json();
  
  elements = stripe.elements({ clientSecret });
  paymentElement = elements.create('payment');
  paymentElement.mount('#payment-element');
}

async function confirmPayment(items, shippingAddress, total) {
  const { error, paymentIntent } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: window.location.origin + '/order-confirmation.html'
    },
    redirect: 'if_required'
  });

  if (error) {
    alert(error.message);
    return;
  }

  if (paymentIntent.status === 'succeeded') {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/payment/confirm-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        paymentIntentId: paymentIntent.id,
        items,
        shippingAddress,
        total
      })
    });

    const { order } = await response.json();
    window.location.href = `/order-confirmation.html?orderId=${order.id}`;
  }
}

initStripe();
