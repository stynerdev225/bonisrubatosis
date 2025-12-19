require('dotenv').config();
const { Pool } = require('pg');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

async function testDatabase() {
  console.log('\n🔍 Testing Database Connection...');
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const result = await pool.query('SELECT NOW()');
    console.log(`${colors.green}✓ Database connected successfully${colors.reset}`);
    
    // Check tables
    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log(`${colors.green}✓ Found ${tables.rows.length} tables:${colors.reset}`, 
      tables.rows.map(r => r.table_name).join(', '));
    
    await pool.end();
    return true;
  } catch (error) {
    console.log(`${colors.red}✗ Database error: ${error.message}${colors.reset}`);
    return false;
  }
}

async function testStripe() {
  console.log('\n🔍 Testing Stripe Configuration...');
  try {
    const balance = await stripe.balance.retrieve();
    console.log(`${colors.green}✓ Stripe connected successfully${colors.reset}`);
    console.log(`${colors.green}✓ Account currency: ${balance.available[0].currency.toUpperCase()}${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}✗ Stripe error: ${error.message}${colors.reset}`);
    return false;
  }
}

function testEnvVariables() {
  console.log('\n🔍 Checking Environment Variables...');
  const required = [
    'DATABASE_URL',
    'JWT_SECRET',
    'STRIPE_SECRET_KEY',
    'STRIPE_PUBLISHABLE_KEY'
  ];
  
  let allPresent = true;
  required.forEach(key => {
    if (process.env[key] && !process.env[key].includes('your_')) {
      console.log(`${colors.green}✓ ${key} is set${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ ${key} is missing or not configured${colors.reset}`);
      allPresent = false;
    }
  });
  
  return allPresent;
}

async function runTests() {
  console.log('='.repeat(50));
  console.log('🚀 Bonis Rubatosis Backend Setup Test');
  console.log('='.repeat(50));
  
  const envOk = testEnvVariables();
  const dbOk = await testDatabase();
  const stripeOk = await testStripe();
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Summary:');
  console.log('='.repeat(50));
  console.log(`Environment: ${envOk ? colors.green + '✓ PASS' : colors.red + '✗ FAIL'}${colors.reset}`);
  console.log(`Database: ${dbOk ? colors.green + '✓ PASS' : colors.red + '✗ FAIL'}${colors.reset}`);
  console.log(`Stripe: ${stripeOk ? colors.green + '✓ PASS' : colors.red + '✗ FAIL'}${colors.reset}`);
  
  if (envOk && dbOk && stripeOk) {
    console.log(`\n${colors.green}🎉 All tests passed! Ready to start server.${colors.reset}`);
    console.log(`\nRun: ${colors.yellow}npm run dev${colors.reset}`);
  } else {
    console.log(`\n${colors.red}❌ Some tests failed. Please fix the issues above.${colors.reset}`);
  }
  
  process.exit(envOk && dbOk && stripeOk ? 0 : 1);
}

runTests();
