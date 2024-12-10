import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { firebaseConfig } from '../services/firebaseConfig.js'; 
import { busData } from '../data/data.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 

const userName = document.getElementById('user-name');
const userIMG = document.getElementById('user-img');
const userEmail = document.getElementById('user-email'); 

auth.onAuthStateChanged((user) => {
    if (user) {
        // Display user's credentials
        userName.textContent = `Hello, ${user.displayName}`;
        userIMG.src = user.photoURL;
        userEmail.textContent = user.email;
    } else {
        console.log('User is not signed in');
        window.location.href = '/index.html';
    }
});

const bussingArticle = document.getElementById('bussing-article');
let bussingHTML = "";

busData.forEach((busInfo) => {
    bussingHTML += `
    <article class="bus-card">
        <div class="card-header">
            <h2>BUS0${busInfo.busNumber}</h2>
            <h3>${busInfo.startingPoint} <span><i class="fa-solid fa-arrow-right"></i></span> <span class="bus-arrival">${busInfo.arrivalPoint}</span></h3>
        </div>
        <hr>
        <div class="card-main">
            <img src="../assets/img/bus_front.png" alt="">
            <div class="card-info">
                <h4>Current bus Location:</h4> <br>
                <p class="bus-status">${busInfo.currentLocation}</p>
            </div>
            <div class="card-time">
                <h5>Departure Time:</h5>
                <p class="">${busInfo.departureTime}</p>
            </div>
        </div>
        <hr>
        <div class="card-maps">
            <button>View Maps</button>
        </div>
    </article>
    `;
})

bussingArticle.innerHTML = bussingHTML;