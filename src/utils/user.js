export function logoutUser(button, auth){
    button.addEventListener('click', () => {
        auth.signOut().then(() => {
            alert("You will be redirected to the login page");
            window.location.href = '../../index.html';
        }).catch((error) => {
            console.log(error.message);
        });
    })
}