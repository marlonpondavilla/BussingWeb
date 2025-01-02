import { toggleAdminNav } from "../utils/pagination.js";
import { logoutAdmin } from '../utils/user.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { firebaseConfig } from '../services/firebaseConfig.js';
import { toggleBusOperations } from "../utils/pagination.js";
import { addScheduleToFirestore, getFirestoreData, getSingleSchedule, updateSingleSchedule, checkBusNumberExists } from "../firebase/db.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 

const logoutButton = document.getElementById('logout-btn');
logoutAdmin(logoutButton, auth);

// Tickets sold and unsold chart
const chart1 = new Chart(document.getElementById("chart1"), {
    type: "doughnut",
    data: {
        labels: ["Tickets Sold", "Unsold Tickets"],
        datasets: [{
            data: [100, 50],
            backgroundColor: ["#3498db", "#ecf0f1"],
            hoverBackgroundColor: ["#2980b9", "#bdc3c7"]
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' }
        }
    }
});

// Operational vs Inactive buses chart
const chart2 = new Chart(document.getElementById("chart2"), {
    type: "doughnut",
    data: {
        labels: ["Operational Buses", "Inactive Buses"],
        datasets: [{
            data: [100, 20],
            backgroundColor: ["#1abc9c", "#ecf0f1"],
            hoverBackgroundColor: ["#16a085", "#bdc3c7"]
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' }
        }
    }
});

// Active vs Inactive routes chart
const chart3 = new Chart(document.getElementById("chart3"), {
    type: "doughnut",
    data: {
        labels: ["Active Routes", "Inactive Routes"],
        datasets: [{
            data: [40, 5],
            backgroundColor: ["#e67e22", "#ecf0f1"],
            hoverBackgroundColor: ["#d35400", "#bdc3c7"]
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' }
        }
    }
});

// Resolved vs Pending complaints chart
const chart4 = new Chart(document.getElementById("chart4"), {
    type: "doughnut",
    data: {
        labels: ["Resolved Complaints", "Pending Complaints"],
        datasets: [{
            data: [30, 5],
            backgroundColor: ["#9b59b6", "#ecf0f1"],
            hoverBackgroundColor: ["#8e44ad", "#bdc3c7"]
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' }
        }
    }
});

// Toggle the admin navigation bar
const dashboardButton = document.getElementById('dashboard-btn');
const ticketInventoryButton = document.getElementById('ticket-inventory-btn');
const busOperationsButton = document.getElementById('bus-operations-btn');
const customerSupportButton = document.getElementById('customer-support-btn');

const dashboardSection = document.getElementById('dashboard-section');
const ticketInventorySection = document.getElementById('ticket-inventory-section');
const busOperationsSection = document.getElementById('bus-operations-section');
const customerSupportSection = document.getElementById('customer-support-section');

toggleAdminNav(dashboardButton, ticketInventoryButton, busOperationsButton, customerSupportButton, dashboardSection, ticketInventorySection, busOperationsSection, customerSupportSection);

// bus operations admin

const busScheduleTab = document.getElementById('bus-schedule-tab');
const busInfoTab = document.getElementById('bus-info-tab');
const busScheduleSection = document.getElementById('bus-schedule-section');
const busInfoSection = document.getElementById('bus-info-section');
toggleBusOperations(busScheduleTab, busInfoTab, busScheduleSection, busInfoSection);


const scheduleModal = document.getElementById('schedule-modal');
scheduleModal.style.display = 'none';

document.getElementById('add-schedule-btn').addEventListener('click', function() {
    scheduleModal.style.display = 'flex';
  });

  // Close the modal
  document.getElementById('modal-cancel-btn').addEventListener('click', () => {
    scheduleModal.style.display = 'none';
  })

    //   Get the schedules from Firestore
    const scheduleData = await getFirestoreData('ScheduleDocuments');
    let newRowHTML = "";

    for(let scheduleDoc of scheduleData){
        // Update the schedule table dynamically
        newRowHTML += `
        <tr>
            <td class="px-4 py-2 border-b">Bus 0${scheduleDoc.busNo}</td>
            <td class="px-4 py-2 border-b">${scheduleDoc.departureTime}</td>
            <td class="px-4 py-2 border-b">${scheduleDoc.from}</td>
            <td class="px-4 py-2 border-b">${scheduleDoc.to}</td>
            <td class="px-4 py-2 border-b">₱${scheduleDoc.price}</td>
            <td class="px-4 py-2 border-b">${scheduleDoc.availableSeats} seats</td>
            <td class="px-4 py-2 border-b ${scheduleDoc.status === 'Active' ? 'text-green-600' : 'text-red-600'}">${scheduleDoc.status}</td>
            <td class="px-4 py-2 border-b text-blue-500 cursor-pointer" data-row-edit="${scheduleDoc.busNo}" id="row-edit-${scheduleDoc.busNo}">Edit</td>
        </tr>
    `;
    }
    // Update the table with the new row
    document.getElementById('schedule-table').innerHTML = newRowHTML;

    // Add event listener to the edit buttons
    const editButtons = document.querySelectorAll('[data-row-edit]');
    const editModal = document.getElementById('edit-schedule-modal');
    
    editModal.style.display = 'none';
    
    document.getElementById('cancel-edit-btn').addEventListener('click', () => {
        editModal.style.display = 'none';
    })

    editButtons.forEach((rowData) => {

        rowData.addEventListener('click', async() => {
            editModal.style.display = 'flex';

            const busNo = rowData.getAttribute('data-row-edit');
            const singleSchedData = await getSingleSchedule(busNo);

            if(singleSchedData){
                const busNo = document.getElementById('editBusNo').value = singleSchedData.busNo;
                document.getElementById('editDepartureTime').value = singleSchedData.departureTime;
                document.getElementById('editFrom').value = singleSchedData.from;
                document.getElementById('editTo').value = singleSchedData.to;
                document.getElementById('editPrice').value = singleSchedData.price;
                document.getElementById('editAvailableSeats').value = singleSchedData.availableSeats;
                document.getElementById('editStatus').value = singleSchedData.status;

                // handle form submission for editing bus schedule
                document.getElementById('edit-schedule-modal').addEventListener('submit', async (event) => {
                    event.preventDefault();
                    
                    const updatedSingleScheduleData = {
                        busNo: document.getElementById('editBusNo').value,
                        departureTime: document.getElementById('editDepartureTime').value,
                        from: document.getElementById('editFrom').value,
                        to: document.getElementById('editTo').value,
                        price: document.getElementById('editPrice').value,
                        availableSeats: document.getElementById('editAvailableSeats').value,
                        status: document.getElementById('editStatus').value
                    }

                    await updateSingleSchedule(busNo, updatedSingleScheduleData)
                    alert('Schedule updated successfully');
                    location.reload();
                });
            }
        })
    })

    // Handle form submission for adding/editing bus schedule
    const busNumErr = document.getElementById('bus-num-err-msg');
    const saveBtn = document.getElementById('modal-save-btn');

    document.getElementById('bus-number').addEventListener('input', async () => {
        try{
            if(await checkBusNumberExists(document.getElementById('bus-number').value)){
                busNumErr.classList.remove('hidden');
                saveBtn.classList.add('cursor-not-allowed');
                saveBtn.disabled = true
            } else{
                busNumErr.classList.add('hidden');
                saveBtn.classList.remove('cursor-not-allowed');
            }
        } catch(e){
            console.error('Error checking bus number: ', e);
        }
    })

  
  document.getElementById('schedule-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const busNumber = document.getElementById('bus-number').value;
    const departureTime = document.getElementById('departure-time').value;
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const price = document.getElementById('price').value;
    const availableSeats = document.getElementById('available-seats').value;
    const status = document.getElementById('status').value;

    // Add the schedule to Firestore
    const scheduleDataObject = {
        busNo: busNumber,
        departureTime: departureTime,
        from: from,
        to: to,
        price: price,
        availableSeats: availableSeats,
        status: status
    }

    await addScheduleToFirestore(scheduleDataObject);
    location.reload();

  });

//  Bus Information
const busInfoData = await getFirestoreData('HomeDocuments')
let busInfoTr = "";

for(let busInfoDoc of busInfoData){
    busInfoTr += `
        <tr>
            <td class="px-4 py-2 border-b">${busInfoDoc.busNo}</td>
            <td class="px-4 py-2 border-b">${busInfoDoc.startingPoint}</td>
            <td class="px-4 py-2 border-b">${busInfoDoc.arrivalPoint}</td>
            <td class="px-4 py-2 border-b">${busInfoDoc.departureTime}</td>
            <td class="px-4 py-2 border-b">${busInfoDoc.plateNo}</td>
            <td class="px-4 py-2 border-b">${busInfoDoc.busModel}</td>
            <td class="px-4 py-2 border-b">${busInfoDoc.busCapacity}</td>
            <td class="px-4 py-2 border-b">${busInfoDoc.busConductor}</td>
            <td class="px-4 py-2 border-b">${busInfoDoc.busDriver}</td>
            <td class="px-4 py-2 border-b">${busInfoDoc.status}</td>
            <td class="px-4 py-2 border-b text-blue-600 cursor-pointer">
            <button class="edit-btn" data-bus-info-edt-btn="${busInfoDoc.busNo}" id="bus-info-edit-btn">Edit</button>
            <button class="ml-2 text-red-600" data-bus-info-del-btn="${busInfoDoc.busNo}" id="bus-info-delete-btn">Delete</button>
            </td>
        </tr>
    `;
}
// Update the table with the new row
document.getElementById('bus-info-table').innerHTML = busInfoTr;

const busInfoAddBtn = document.getElementById('add-bus-info-modal-btn');
const busInfoModal = document.getElementById('bus-info-modal');
const busInfoEdtDiv = document.getElementById('bus-info-edt');
const busInfoAddDiv = document.getElementById('bus-info-add');

const busInfoEdtCancelBtn = document.getElementById('info-edt-cancel');
const busInfoEdtSaveBtn = document.getElementById('info-edt-save');

const busInfoAddCancelBtn = document.getElementById('info-add-cancel');
const busInfoAddSaveBtn = document.getElementById('info-add-save');

const busInfoEdtBtn = document.querySelectorAll('[data-bus-info-edt-btn]');
const busInfoDelBtn = document.querySelectorAll('[data-bus-info-del-btn]');

// will show the modal and the hidden buttons for editing
busInfoEdtBtn.forEach(edtBtn => {
    edtBtn.addEventListener('click', () => {
        showBusInfoModal(busInfoEdtDiv, busInfoModal);
        closeBusInfoModal(busInfoEdtCancelBtn, busInfoModal);
    })
})

// will show the modal and the hidden buttons for adding
busInfoAddBtn.addEventListener('click', () => {
    showBusInfoModal(busInfoAddDiv, busInfoModal)
    closeBusInfoModal(busInfoAddCancelBtn, busInfoModal);
})

function showBusInfoModal(div, modal){
    // loops through the divs and shows the div that was clicked
    [busInfoEdtDiv, busInfoAddDiv].forEach(d => {
        if(d !== div){
            d.classList.add('hidden');
        } else{
            d.classList.remove('hidden');
        }
    })
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeBusInfoModal(closeBtn, modal){
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    })
}

