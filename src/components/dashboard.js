import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { firebaseConfig } from '../services/firebaseConfig.js'; 
import { busData } from '../data/data.js';
import { showPage, showUserSettings } from '../utils/pagination.js';
import { logoutUser } from '../utils/user.js';
import { date } from '../utils/date.js';
import { generateTicket, updatePrice } from '../utils/ticket.js';

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
                    <h4 class="font-medium text-gray-700">Bus Information:</h4>
                    <details class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <summary class="text-base font-semibold cursor-pointer text-blue-600 hover:text-blue-800">
                            View Now
                        </summary>
                        <div class="mt-4 space-y-2">
                            <p class="text-gray-700">Bus Plate Number: <span class="font-medium text-gray-900">${busInfo.busInformation.busPlateNumber}</span></p>
                            <p class="text-gray-700">Bus Model: <span class="font-medium text-gray-900">${busInfo.busInformation.busModel}</span></p>
                            <p class="text-gray-700">Bus Capacity: <span class="font-medium text-gray-900">${busInfo.busInformation.busCapacity}</span></p>
                            <p class="text-gray-700">Bus Driver: <span class="font-medium text-gray-900">${busInfo.busInformation.busDriver}</span></p>
                            <p class="text-gray-700">Bus Conductor: <span class="font-medium text-gray-900">${busInfo.busInformation.busConductor}</span></p>
                        </div>
                    </details>

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

// Header navigation
bussingArticle.innerHTML = bussingHTML;

const homeTab = document.querySelector('.home');
const ticketTab = document.querySelector('.ticket');
const scheduleTab = document.querySelector('.schedule');
const historyTab = document.querySelector('.history');

const homeSection = document.querySelector('.home-section');
const ticketSection = document.querySelector('.ticket-section');
const scheduleSection = document.querySelector('.schedule-section');
const historySection = document.querySelector('.history-section');

showPage(homeTab, ticketTab, scheduleTab, historyTab, 'highlighted', homeSection, ticketSection, scheduleSection, historySection);

// Ticket generation
const ticketBtn = document.getElementById('ticket-btn');
const from = document.getElementById('from');
const to = document.getElementById('to');
const discount = document.getElementById('discount');
const price = document.getElementById('price');

from.addEventListener('change', () => {
    updatePrice(from.value, to.value, discount.value, price);
});
to.addEventListener('change', () => {
    updatePrice(from.value, to.value, discount.value, price);
});
discount.addEventListener('change', () => {
    updatePrice(from.value, to.value, discount.value, price);
});

ticketBtn.addEventListener('click', () => {
    alert(`Ticket from ${from.value} to ${to.value} with a ${discount.value}% discount costs ₱${price.innerHTML}`);
    
});





















