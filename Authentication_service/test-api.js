import http from 'http';

const testApi = async () => {
    try {
        console.log('--- Starting API Tests ---');
        
        // 1. Register Admin
        console.log('\n[1] Register Admin');
        const adminRes = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Admin User', email: 'admin@test.com', password: 'password123', role: 'Admin' })
        });
        const adminData = await adminRes.json();
        console.log('Status:', adminRes.status);
        console.log('Response:', adminData);

        // 2. Register Technician
        console.log('\n[2] Register Technician');
        const techRes = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Tech User', email: 'tech@test.com', password: 'password123', role: 'Technician' })
        });
        const techData = await techRes.json();
        console.log('Status:', techRes.status);
        console.log('Response:', techData);

        // 3. Login Admin
        console.log('\n[3] Login Admin');
        const loginRes = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@test.com', password: 'password123' })
        });
        const loginData = await loginRes.json();
        console.log('Status:', loginRes.status);
        console.log('Login Token:', loginData.token ? 'Received' : 'Not received');
        
        const token = loginData.token;

        // 4. Get Me (Protected)
        console.log('\n[4] Get Me (Protected)');
        const meRes = await fetch('http://localhost:3000/api/auth/me', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const meData = await meRes.json();
        console.log('Status:', meRes.status);
        console.log('Me Data:', meData);

        // 5. Logout
        console.log('\n[5] Logout Admin');
        const logoutRes = await fetch('http://localhost:3000/api/auth/logout', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const logoutData = await logoutRes.json();
        console.log('Status:', logoutRes.status);
        console.log('Logout Data:', logoutData);

        // 6. Get Me again (Should fail)
        console.log('\n[6] Get Me After Logout (Should Fail)');
        const meFailRes = await fetch('http://localhost:3000/api/auth/me', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const meFailData = await meFailRes.json();
        console.log('Status:', meFailRes.status);
        console.log('Response (Expected auth failure):', meFailData);

    } catch (err) {
        console.error('Test script error:', err);
    }
};

testApi();
