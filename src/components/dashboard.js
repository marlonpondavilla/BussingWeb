import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { firebaseConfig } from '../services/firebaseConfig.js'; 
import { busData } from '../data/data.js';
import { showPage, showUserSettings } from '../utils/pagination.js';
import { logoutUser } from '../utils/user.js';
import { date } from '../utils/date.js';
import { generateTicket, updatePrice } from '../utils/ticket.js';
import { getFirestoreData } from '../firebase/db.js';

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
const homeData = await getFirestoreData('HomeDocumentsCollection');

// check if the data is empty
if(homeData.length === 0){
    bussingHTML = 
        `<h2 class="text-2xl text-center text-gray-700">No bus data available</h2>`;
}

for (let homeDoc of homeData){
    bussingHTML += `
       <article class="bus-card w-full md:w-4/5 lg:w-1/2 bg-white rounded-lg shadow-lg p-6 mx-auto">
            <div class="card-header flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold text-gray-900">BUS 0${homeDoc.busNo}</h2>
                <h3 class="text-lg">
                    <span class="text-gray-700">${homeDoc.startingPoint}</span>
                    <span><i class="fa-solid fa-arrow-right text-yellow-500"></i></span> 
                    <span class="bus-arrival text-red-600 font-semibold">${homeDoc.arrivalPoint}</span>
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
                            <p class="text-gray-700">Bus Plate Number: <span class="font-medium text-gray-900">${homeDoc.plateNo}</span></p>
                            <p class="text-gray-700">Bus Model: <span class="font-medium text-gray-900">${homeDoc.busModel}</span></p>
                            <p class="text-gray-700">Bus Capacity: <span class="font-medium text-gray-900">${homeDoc.busCapacity}</span></p>
                            <p class="text-gray-700">Bus Driver: <span class="font-medium text-gray-900">${homeDoc.busDriver}</span></p>
                            <p class="text-gray-700">Bus Conductor: <span class="font-medium text-gray-900">${homeDoc.busConductor}</span></p>
                        </div>
                    </details>

                </div>
                <div class="card-time text-right">
                    <h5 class="font-medium text-gray-700">Departure Time:</h5>
                    <p class="text-gray-800">${homeDoc.departureTime}</p>
                </div>
            </div>
            <hr class="border-gray-300 my-4">
            <div class="card-maps w-full flex justify-between items-center bg-slate-800 p-4 rounded-lg">
                <h6 class="text-white font-semibold">Status:</h6>
                <button class="px-6 py-2 text-white rounded-md bg-purple-600 hover:bg-purple-500 font-semibold transition duration-200">
                    ${homeDoc.status}
                </button>
            </div>
        </article>
    `;
}

bussingArticle.innerHTML = bussingHTML;

// Ticket generation
const ticketForm = document.getElementById('ticket-form');
const ticketBtn = document.getElementById('ticket-btn');
const from = document.getElementById('from');
const to = document.getElementById('to');
const discount = document.getElementById('discount');
const price = document.getElementById('price');
const errHTML = document.getElementById('route-err-msg');
const qrPopUp = document.getElementById('qr-popup');
const qrCodeDiv = document.getElementById('qr-code');
const qrDiscount = document.getElementById('qr-discount');
const qrFrom = document.getElementById('qr-from');
const qrTo = document.getElementById('qr-to');
const qrCodeLabel = document.getElementById('qr-code-label');
const closePopUp = document.getElementById('close-popup');

from.addEventListener('change', () => {
    updatePrice(from.value, to.value, discount.value, price, from, to, errHTML, ticketBtn);
});
to.addEventListener('change', () => {
    updatePrice(from.value, to.value, discount.value, price, from, to, errHTML, ticketBtn);
});
discount.addEventListener('change', () => {
    updatePrice(from.value, to.value, discount.value, price, from, to, errHTML, ticketBtn);
});

ticketForm.addEventListener('submit', (e) => {
    e.preventDefault();
    generateTicket(from.value, to.value, discount.value, price.innerHTML, qrPopUp, qrCodeDiv, qrDiscount, qrFrom, qrTo, qrCodeLabel);
    
});

closePopUp.addEventListener('click', () => {
    qrPopUp.classList.add('hidden');
    qrPopUp.classList.remove('flex');
});

// schedule rendering
const scheduleData = await getFirestoreData('ScheduleDocumentsCollection');
const scheduleSectionHTML = document.getElementById('schedule-table');
let scheduleHTML = "";

// check if the data is empty
if(scheduleData.length === 0){
    scheduleHTML = 
        `<h2 class="text-2xl text-center text-gray-700">No schedule available</h2>`;
}

for (let scheduleDoc of scheduleData){
    scheduleHTML += `
    <tr>
        <td class="px-4 py-2 border-b text-center font-semibold">Bus 0${scheduleDoc.busNo}</td>
        <td class="px-4 py-2 border-b text-center">${scheduleDoc.departureTime}</td>
        <td class="px-4 py-2 border-b text-center font-semibold">${scheduleDoc.from}</td>
        <td class="px-4 py-2 border-b text-center font-semibold">${scheduleDoc.to}</td>
        <td class="px-4 py-2 border-b text-center">₱${scheduleDoc.price}</td>
        <td class="px-4 py-2 border-b text-center">${scheduleDoc.availableSeats} seats</td>
        <td class="px-4 py-2 border-b text-center ${scheduleDoc.status === 'Active' ? 'text-green-600' : 'text-red-600'}">${scheduleDoc.status}</td>
    </tr>
    `;
}
scheduleSectionHTML.innerHTML = scheduleHTML;

// Header navigation
const homeTab = document.querySelector('.home');
const ticketTab = document.querySelector('.ticket');
const scheduleTab = document.querySelector('.schedule');
const historyTab = document.querySelector('.history');

const homeSection = document.querySelector('.home-section');
const ticketSection = document.querySelector('.ticket-section');
const scheduleSection = document.querySelector('.schedule-section');
const historySection = document.querySelector('.history-section');

showPage(homeTab, ticketTab, scheduleTab, historyTab, 'highlighted', homeSection, ticketSection, scheduleSection, historySection);























