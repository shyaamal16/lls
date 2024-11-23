// Handle Login Form Submission
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const userId = document.getElementById('userId').value;
            const password = document.getElementById('password').value;
  
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, password }),
                });
  
                const result = await response.json();
                if (response.ok) {
                    // Store token and role in localStorage
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('userRole', result.role);
                    window.location.href = '/dashboard.html'; // Redirect to dashboard after successful login
                } else {
                    alert(result.message); // Show error message
                }
            } catch (error) {
                console.error('Login Error:', error);
                alert('Error during login. Please try again.');
            }
        });
    }
  });
  
  // Check authentication status on page load
  document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const currentPage = window.location.pathname;
  
    if (!token && currentPage !== '/login.html' && currentPage !== '/index.html') {
        // Redirect to login page if not authenticated
        window.location.href = '/login.html';
    } else if (token && (currentPage === '/login.html' || currentPage === '/index.html')) {
        // Redirect to dashboard if already authenticated
        window.location.href = '/dashboard.html';
    }
  });
  
  // Function to make authenticated API calls
  async function authenticatedFetch(url, options = {}) {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }
  
    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };
  
    const response = await fetch(url, { ...options, headers });
  
    if (response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = '/login.html';
        throw new Error('Authentication failed');
    }
  
    return response;
  }
  
  