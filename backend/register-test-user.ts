/**
 * Register a test user via the API
 */

import fetch from 'node-fetch';

async function registerTestUser() {
  try {
    const userData = {
      email: 'bob@example.com',
      phone: '+2348000000001',
      password: 'password123',
      fullName: 'Bob Test',
    };

    console.log('📝 Registering test user via API...\n');

    const response = await fetch('http://localhost:5166/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Test user created successfully!\n');
      console.log('📧 Login credentials:');
      console.log(`   Email: ${userData.email}`);
      console.log(`   Password: ${userData.password}`);
      console.log(`   Name: ${userData.fullName}`);
      console.log(`   User ID: ${result.user.id}`);
      console.log('\n💡 You can now use these credentials to log in to the app!');
    } else {
      console.error('❌ Registration failed:');
      console.error(`   ${result.message || JSON.stringify(result)}`);
      if (result.code) {
        console.error(`   Code: ${result.code}`);
      }
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Make sure the backend server is running on port 5166');
    }
    process.exit(1);
  }
}

registerTestUser();

