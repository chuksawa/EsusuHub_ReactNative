/**
 * Register Bob Test user via API
 */

import fetch from 'node-fetch';

async function registerBob() {
  try {
    const userData = {
      email: 'bob@example.com',
      phone: '+2348000000001',
      password: 'password123',
      fullName: 'Bob Test',
    };

    console.log('📝 Registering Bob Test user...\n');
    console.log('Credentials:');
    console.log(`  Email: ${userData.email}`);
    console.log(`  Password: ${userData.password}`);
    console.log(`  Phone: ${userData.phone}`);
    console.log(`  Name: ${userData.fullName}\n`);

    const response = await fetch('http://localhost:5166/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Bob Test user registered successfully!\n');
      console.log('📧 Login credentials:');
      console.log(`   Email: ${userData.email}`);
      console.log(`   Password: ${userData.password}`);
      console.log(`   User ID: ${result.user.id}`);
      if (result._devNote) {
        console.log(`\n⚠️  Note: ${result._devNote}`);
      }
      console.log('\n💡 You can now use these credentials to log in to the app!');
    } else {
      console.error('❌ Registration failed:');
      console.error(`   Status: ${response.status}`);
      console.error(`   Message: ${result.message || JSON.stringify(result)}`);
      if (result.code) {
        console.error(`   Code: ${result.code}`);
      }
      if (result.details) {
        console.error(`   Details: ${result.details}`);
      }
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Make sure the backend server is running on port 5166');
      console.error('   Run: cd backend && npm run dev');
    }
    process.exit(1);
  }
}

registerBob();

