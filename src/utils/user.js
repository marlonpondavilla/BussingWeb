export function logoutUser(button, auth){
    button.addEventListener('click', () => {
        auth.signOut().then(() => {
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userPhoto');
            alert("You will be redirected to the login page");
            window.location.href = '../../index.html';
        }).catch((error) => {
            console.log(error.message);
        });
    })
}
