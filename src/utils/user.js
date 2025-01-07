export function logoutUser(button, auth){
    button.addEventListener('click', () => {
        auth.signOut().then(() => {
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userPhoto');
            localStorage.removeItem('userId');
            alert("You will be redirected to the login page");
            window.location.href = '../index.html';
        }).catch((error) => {
            console.log(error.message);
        });
    })
}

export function logoutAdmin(button, auth){
    button.addEventListener('click', () => {
        auth.signOut().then(() => {
            localStorage.removeItem('adminName');
            localStorage.removeItem('adminEmail');
            localStorage.removeItem('adminPhoto');
            alert("You will be redirected to the login page");
            window.location.href = '../index.html';
        }).catch((error) => {
            console.log(error.message);
        });
    })
}
