export function logoutUser(button, auth){
    button.addEventListener('click', () => {
        console.log('MEOWWWWW')
        auth.signOut().then(() => {
            alert("You will be redirected to the login page");
            window.location.href = '../../Public/index.html';
        }).catch((error) => {
            console.log(error.message);
        });
    })
}