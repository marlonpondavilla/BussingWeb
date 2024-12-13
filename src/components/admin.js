
const username = document.getElementById('username');
const password = document.getElementById('password');
const loginButton = document.getElementById('login-btn');

loginButton.addEventListener('click', (e) => {
    e.preventDefault();

    const adminUsername = username.value;
    const adminPassword = password.value;

    if (adminUsername === '' || adminPassword === '') {
        alert('Please fill in all fields');
    } else if (adminUsername === 'root' && adminPassword === 'admin') {
        alert('Admin successfully logged in');
        setTimeout(() => {
            window.location.replace('../pages/adminDashboard.html');
        }, 500);
    } else {
        alert('Invalid credentials');
    }
});


