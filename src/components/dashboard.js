import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { firebaseConfig } from '../services/firebaseConfig.js'; 
import { busData } from '../data/data.js';
import { showPage, showUserSettings } from '../utils/pagination.js';
import { logoutUser } from '../utils/user.js';
import { date } from '../utils/date.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Fetching user data from localStorage
window.onload = () => {
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userPhoto = localStorage.getItem('userPhoto');

    // Update the dashboard with user details
    if (userName || userEmail || userPhoto) {
        document.getElementById('user-name').textContent = userName;
        document.getElementById('user-email').textContent = userEmail;
        document.getElementById('user-img').src = userPhoto || user_png;
    } else {
        alert("There is no user data");
    }
}

// Display current date
document.querySelector('.current-date').innerHTML = date();

// User settings and logout
const logoutButton = document.getElementById('logout-btn');
const userSettingSection = document.querySelector('.user-profile-section');
const userIMG = document.getElementById('user-img');

showUserSettings(userIMG, userSettingSection);
logoutUser(logoutButton, auth);

// Bus data rendering
const bussingArticle = document.getElementById('bussing-article');
let bussingHTML = "";

busData.forEach((busInfo) => {
    bussingHTML += `
       <article class="bus-card w-full md:w-4/5 lg:w-1/2 bg-white rounded-lg shadow-lg p-6 mx-auto">
            <div class="card-header flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold text-gray-900">BUS0${busInfo.busNumber}</h2>
                <h3 class="text-lg">
                    <span class="text-gray-700">${busInfo.startingPoint}</span>
                    <span><i class="fa-solid fa-arrow-right text-yellow-500"></i></span> 
                    <span class="bus-arrival text-red-600 font-semibold">${busInfo.arrivalPoint}</span>
                </h3>
            </div>
            <hr class="border-gray-300 mb-4">
            <div class="card-main flex items-center justify-between mt-4 space-x-4">
                <img src="../assets/img/bus_front.png" alt="Bus Front" class="w-24 h-24 object-cover rounded-lg border-2 border-gray-300">
                <div class="card-info flex-1">
                    <h4 class="font-medium text-gray-700">Current bus Location:</h4>
                    <p class="bus-status text-gray-800">${busInfo.currentLocation}</p>
                </div>
                <div class="card-time text-right">
                    <h5 class="font-medium text-gray-700">Departure Time:</h5>
                    <p class="text-gray-800">${busInfo.departureTime}</p>
                </div>
            </div>
            <hr class="border-gray-300 my-4">
            <div class="card-maps w-full flex justify-between items-center bg-slate-800 p-4 rounded-lg">
                <h6 class="text-white font-semibold">Status:</h6>
                <button class="px-6 py-2 text-white rounded-md bg-purple-600 hover:bg-purple-500 font-semibold transition duration-200">
                    ${busInfo.status}
                </button>
            </div>
        </article>
    `;
});

bussingArticle.innerHTML = bussingHTML;

const homeTab = document.querySelector('.home');
const ticketTab = document.querySelector('.ticket');
const mapsTab = document.querySelector('.maps');
const historyTab = document.querySelector('.history');

const homeSection = document.querySelector('.home-section');
const ticketSection = document.querySelector('.ticket-section');
const mapsSection = document.querySelector('.maps-section');
const historySection = document.querySelector('.history-section');

showPage(homeTab, ticketTab, mapsTab, historyTab, 'highlighted', homeSection, ticketSection, mapsSection, historySection);
