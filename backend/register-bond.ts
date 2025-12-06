/**
 * Register bond@example.com via the API
 */

import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.API_BASE_URL || 'http://localhost:5166/api';

async function registerBond() {
  try {
    console.log('Registering bond@example.com...');
    
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'bond@example.com',
        phone: '+2348000000001',
        password: 'Password123!',
        fullName: 'Bond Test',
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Registration successful!');
      console.log('User ID:', data.user?.id);
      console.log('Email:', data.user?.email);
      console.log('Full Name:', data.user?.fullName);
      console.log('\nYou can now login with:');
      console.log('  Email: bond@example.com');
      console.log('  Password: Password123!');
    } else {
      console.error('❌ Registration failed:');
      console.error('Status:', response.status);
      console.error('Error:', data.message || data);
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('Make sure the backend server is running on port 5166');
  }
}

registerBond();

