
// ⌨️ Shortcut for admin login
document.addEventListener('keydown', function(event) {
  if (event.altKey && (event.key === 'b' || event.key === 'B')) {
    window.location.href = './src/pages/adminLogin.html';
  }
});