# Setup Checklist for Bonis Rubatosis E-commerce

## ✅ Step-by-Step Setup

### 1. Install PostgreSQL
```bash
brew install postgresql
brew services start postgresql
```

### 2. Create Database
```bash
createdb bonisrubatosis
psql bonisrubatosis < backend/database/schema.sql
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
```

### 4. Configure Environment Variables
```bash
cp .env.example .env
```

Edit `backend/.env` with your values:
- **DATABASE_URL**: `postgresql://YOUR_USERNAME@localhost:5432/bonisrubatosis`
- **JWT_SECRET**: Any random string (e.g., `my_super_secret_jwt_key_12345`)
- **STRIPE_SECRET_KEY**: Get from https://dashboard.stripe.com/test/apikeys
- **STRIPE_PUBLISHABLE_KEY**: Get from https://dashboard.stripe.com/test/apikeys

### 5. Test Your Setup
```bash
node test-setup.js
```

This will verify:
- ✓ Environment variables are set
- ✓ Database connection works
- ✓ Stripe API is configured
- ✓ All required tables exist

### 6. Start the Server
```bash
npm run dev
```

Server should start on http://localhost:3000

---

## 🧪 Testing the API

### Test 1: Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Test 2: Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the `token` from the response!

### Test 3: Create Payment Intent
```bash
curl -X POST http://localhost:3000/api/payment/create-payment-intent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "amount": 5000,
    "items": [
      {"id": 1, "name": "Test Product", "price": 50.00, "quantity": 1}
    ]
  }'
```

### Test 4: Get Orders
```bash
curl http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🌐 Frontend Integration

### Update HTML Files

Add to your checkout page (e.g., `cart_page.html`):

```html
<!-- Before </body> -->
<script src="https://js.stripe.com/v3/"></script>
<script src="asset/js/checkout.js"></script>
```

Add to login page (`login_page.html`):

```html
<!-- Before </body> -->
<script src="asset/js/auth.js"></script>
```

### Configure Stripe Public Key

Edit `asset/js/checkout.js` and replace:
```javascript
const stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY');
```

---

## 🎯 Test Stripe Payment

Use these test cards:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Any future expiry date (e.g., 12/25) and any 3-digit CVC.

---

## 🐛 Troubleshooting

### Database Connection Failed
```bash
# Check if PostgreSQL is running
brew services list

# Restart PostgreSQL
brew services restart postgresql

# Check your username
whoami
```

### Stripe API Error
- Verify keys at https://dashboard.stripe.com/test/apikeys
- Make sure you're using TEST keys (start with `sk_test_` and `pk_test_`)

### Port Already in Use
```bash
# Find process on port 3000
lsof -ti:3000

# Kill it
kill -9 $(lsof -ti:3000)
```

---

## 📝 What's Still Needed

1. ✅ Backend setup (DONE)
2. ✅ Database schema (DONE)
3. ✅ Stripe integration (DONE)
4. ⏳ Update HTML pages to use new auth/checkout JS
5. ⏳ Add product data to database
6. ⏳ Connect frontend forms to backend APIs

---

## 🚀 Quick Start (After Setup)

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Serve frontend (if needed)
cd ..
python3 -m http.server 8000
```

Visit: http://localhost:8000
