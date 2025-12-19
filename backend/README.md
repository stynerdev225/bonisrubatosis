# Bonis Rubatosis Backend

E-commerce backend with Stripe payment integration, user authentication, and order management.

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup PostgreSQL Database
```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb bonisrubatosis

# Run schema
psql bonisrubatosis < database/schema.sql
```

### 3. Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
- Get Stripe keys from: https://dashboard.stripe.com/test/apikeys
- Generate JWT secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Add your database URL
- Add email credentials (optional, for order notifications)

### 4. Start Server
```bash
npm run dev
```

Server runs on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/addresses` - Add shipping address
- `GET /api/profile/addresses` - Get all addresses

### Payment
- `GET /api/payment/config` - Get Stripe publishable key
- `POST /api/payment/create-payment-intent` - Create payment
- `POST /api/payment/confirm-payment` - Confirm payment and create order

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get specific order
- `PUT /api/orders/:id/status` - Update order status

## Frontend Integration

Add to your HTML pages:

```html
<script src="https://js.stripe.com/v3/"></script>
<script src="asset/js/checkout.js"></script>
```

## Testing Stripe

Use test card: 4242 4242 4242 4242
- Any future expiry date
- Any 3-digit CVC
- Any ZIP code
