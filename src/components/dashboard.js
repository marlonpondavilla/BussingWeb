import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { firebaseConfig } from '../services/firebaseConfig.js'; 
import { busData } from '../data/data.js';
import { showPage, showUserSettings } from '../utils/pagination.js';
import { logoutUser } from '../utils/user.js';
import { date } from '../utils/date.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  

// fetching all data stored in localstorage
window.onload = () => {
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userPhoto = localStorage.getItem('userPhoto');

    // Update the dashboard with user details
    if (userName || userEmail || userPhoto) {
        document.getElementById('user-name').textContent = userName;
        document.getElementById('user-email').textContent = userEmail;
        document.getElementById('user-img').src = userPhoto || user_png;
    } else{
        alert("there is no user data");
    }
}

// display current date
const currentDate = document.querySelector('.current-date').innerHTML = date();

// User settings and logout 
const logoutButton = document.getElementById('logout-btn');
const userSettingSection = document.querySelector('.user-profile-section');
const userIMG = document.getElementById('user-img');

showUserSettings(userIMG, userSettingSection, 'active');
logoutUser(logoutButton, auth);

// bus card and data render
const bussingArticle = document.getElementById('bussing-article');
let bussingHTML = "";

busData.forEach((busInfo) => {
    bussingHTML += `
    <section class="home-section">
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
            <button>${busInfo.status}</button>
        </div>
    </article>
    </section>
    `;
})

bussingArticle.innerHTML = bussingHTML;

// Header pagination
const home = document.querySelector('.home');
const ticket = document.querySelector('.ticket');
const maps = document.querySelector('.maps');
const history = document.querySelector('.history');

const homeSection = document.querySelector('.home-section');
const ticketSection = document.querySelector('.ticket-section');
const mapsSection = document.querySelector('.maps-section');
const historySection = document.querySelector('.history-section');

showPage(home, ticket, maps, history, 'highlighted', homeSection, ticketSection, mapsSection, historySection);

