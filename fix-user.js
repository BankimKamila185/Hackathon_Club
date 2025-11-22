// Quick fix script to create the user in MongoDB
// Run this if you don't want to delete from Firebase

const axios = require('axios');

async function createUser() {
    try {
        const response = await axios.post('http://localhost:5001/api/auth/register', {
            name: 'Bankim Kamila',  // Your name
            email: '2024.bankimc@isu.ac.in',
            password: 'YOUR_PASSWORD_HERE',  // Use the SAME password you used in Firebase
            role: 'co-lead'
        });
        console.log('✅ User created successfully:', response.data);
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

createUser();
