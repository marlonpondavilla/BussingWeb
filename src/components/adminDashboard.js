import { toggleAdminNav } from "../utils/pagination.js";
import { logoutAdmin } from '../utils/user.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { firebaseConfig } from '../services/firebaseConfig.js';
import { toggleBusOperations } from "../utils/pagination.js";
import { showSuccessAlert, handleDeleteInformation } from "../utils/alert.js";
import { addDataToFirestore, getFirestoreData, getSingleFirestoreData, getSingleFirestoreDocument, updateSingleFirestoreData, checkBusNumberExists, deleteSingleFirestoreData, deleteSingleFirestoreDocument } from "../firebase/db.js";

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

// bus ticket inventory admin
const ticketGenratedCollection = await getFirestoreData('TicketGeneratedCollection');
let ticketTrHTML = '';

for(let ticketGeneratedDoc of ticketGenratedCollection){
    ticketTrHTML += `
        <tr class="border-2 border-b-black">
            <td class="border py-2 text-center">${ticketGeneratedDoc.uid}</td>
            <td class="border py-2 text-center">${ticketGeneratedDoc.ticketCode}</td>
            <td class="border py-2 text-center">${ticketGeneratedDoc.from} - ${ticketGeneratedDoc.to}</td>
            <td class="border py-2 text-center">${ticketGeneratedDoc.discount}</td>
            <td class="border py-2 text-center">₱${ticketGeneratedDoc.price}</td>
            <td class="border py-2 text-center">${ticketGeneratedDoc.createdAt}</td>
            <td class="border py-2 text-center">
                <button class="border py-2 px-3 bg-green-500 hover:bg-green-600" data-ticket-confirm="${ticketGeneratedDoc.ticketCode}">Confirm</button> 
                <button class="border p-2 bg-red-500 hover:bg-red-600 text-white" data-ticket-reject="${ticketGeneratedDoc.ticketCode}">reject</button>
            </td>
       </tr>
    `;
}

document.getElementById('ticket-inventory-table').innerHTML = ticketTrHTML;

const ticketConfirmBtns = document.querySelectorAll('[data-ticket-confirm]');
const ticketRejectBtns = document.querySelectorAll('[data-ticket-reject]');

ticketConfirmBtns.forEach((confirmBtn) => {
    const userClickedBtn = confirmBtn.getAttribute('data-ticket-confirm');

    confirmBtn.addEventListener('click', async () => {
        const confirmedTicketReq = await getSingleFirestoreDocument('ticketCode', userClickedBtn, 'TicketGeneratedCollection');
        await addDataToFirestore('TicketConfirmedCollection', confirmedTicketReq);
        await deleteSingleFirestoreDocument('ticketCode', userClickedBtn, 'TicketGeneratedCollection');
        showSuccessAlert('Ticket confirmed successfully');
    })
});

ticketRejectBtns.forEach( (rejectBtn) => {
    const userClickedBtn = rejectBtn.getAttribute('data-ticket-reject');

    rejectBtn.addEventListener('click', async () => {
        await deleteSingleFirestoreDocument('ticketCode', userClickedBtn, 'TicketGeneratedCollection');
        showSuccessAlert('Ticket rejected successfully');
    })
})



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
    const scheduleData = await getFirestoreData('ScheduleDocumentsCollection');
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
        <td class="px-4 py-2 border-b">
            <span class="text-blue-500 cursor-pointer mr-4" data-row-edit="${scheduleDoc.busNo}" id="row-edit-${scheduleDoc.busNo}">Edit</span>
            <span class="text-red-500 cursor-pointer" data-row-delete="${scheduleDoc.busNo}" id="row-delete-${scheduleDoc.busNo}">Delete</span>
        </td>
    </tr>

    `;
    }
    // Update the table with the new row
    document.getElementById('schedule-table').innerHTML = newRowHTML;

    // Add event listener to the edit buttons
    const editButtons = document.querySelectorAll('[data-row-edit]');
    const deleteButtons = document.querySelectorAll('[data-row-delete]');
    const editModal = document.getElementById('edit-schedule-modal');
    
    editModal.style.display = 'none';
    
    document.getElementById('cancel-edit-btn').addEventListener('click', () => {
        editModal.style.display = 'none';
    })

    editButtons.forEach((rowData) => {
        rowData.addEventListener('click', async() => {
            // Show the modal to edit the schedule
            editModal.style.display = 'flex';

            // Get the bus number from the clicked row's data attribute
            const busNo = rowData.getAttribute('data-row-edit');
            const singleSchedData = await getSingleFirestoreData(busNo, 'ScheduleDocumentsCollection');

            if (singleSchedData) {
                // Populate the modal with the current data
                document.getElementById('editBusNo').value = singleSchedData.busNo;
                document.getElementById('editDepartureTime').value = singleSchedData.departureTime;
                document.getElementById('editFrom').value = singleSchedData.from;
                document.getElementById('editTo').value = singleSchedData.to;
                document.getElementById('editPrice').value = singleSchedData.price;
                document.getElementById('editAvailableSeats').value = singleSchedData.availableSeats;
                document.getElementById('editStatus').value = singleSchedData.status;
            }
        });
    });

    deleteButtons.forEach((rowData) => {
        const deleteBusNo = rowData.getAttribute('data-row-delete');

        rowData.addEventListener('click', async() => {
            handleDeleteInformation(deleteBusNo, 'ScheduleDocumentsCollection');
        })
    })

    // Attach the form submit listener just once, outside the click handler.
    document.getElementById('edit-schedule-modal').addEventListener('submit', async (event) => {
        event.preventDefault();

        // Gather the updated schedule data from the modal
        const updatedSingleScheduleData = {
            busNo: document.getElementById('editBusNo').value,
            departureTime: document.getElementById('editDepartureTime').value,
            from: document.getElementById('editFrom').value,
            to: document.getElementById('editTo').value,
            price: document.getElementById('editPrice').value,
            availableSeats: document.getElementById('editAvailableSeats').value,
            status: document.getElementById('editStatus').value
        };

        // Update the document in Firestore with the new data
        await updateSingleFirestoreData(updatedSingleScheduleData.busNo, 'ScheduleDocumentsCollection', updatedSingleScheduleData);
        showSuccessAlert('Schedule updated successfully');
    });


    // Handle form submission for adding/editing bus schedule
    const busNumErr = document.getElementById('bus-num-err-msg');
    const saveBtn = document.getElementById('modal-save-btn');

    document.getElementById('bus-number').addEventListener('input', async () => {
        try{
            if(await checkBusNumberExists(document.getElementById('bus-number').value, 'ScheduleDocumentsCollection')){
                busNumErr.classList.remove('hidden');
                saveBtn.classList.add('cursor-not-allowed');
                saveBtn.disabled = true
            } else{
                busNumErr.classList.add('hidden');
                saveBtn.classList.remove('cursor-not-allowed');
                saveBtn.disabled = false;
            }
        } catch(e){
            console.error('Error checking bus number: ', e);
        }
    })

  
  document.getElementById('schedule-form').addEventListener('submit', async (event) => {
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
        status: status,
        timeCreated: new Date().toLocaleString()
    }

    await addDataToFirestore('ScheduleDocumentsCollection', scheduleDataObject);
    showSuccessAlert('Schedule added successfully');
  });

//  Bus Information
const busInfoDataFirestore = await getFirestoreData('HomeDocumentsCollection');
let busInfoTr = "";

for(let busInfoDoc of busInfoDataFirestore){
    busInfoTr += `
        <tr>
            <td class="px-4 py-2 border-b">0${busInfoDoc.busNo}</td>
            <td class="px-4 py-2 border-b">${busInfoDoc.startingPoint}</td>
            <td class="px-4 py-2 border-b">${busInfoDoc.arrivalPoint}</td>
            <td class="px-4 py-2 border-b">${busInfoDoc.departureTime}</td>
            <td class="px-4 py-2 border-b">${busInfoDoc.plateNo}</td>
            <td class="px-4 py-2 border-b">${busInfoDoc.busModel}</td>
            <td class="px-4 py-2 border-b">${busInfoDoc.busCapacity}</td>
            <td class="px-4 py-2 border-b">${busInfoDoc.busConductor}</td>
            <td class="px-4 py-2 border-b">${busInfoDoc.busDriver}</td>
            <td class="px-4 py-2 border-b ${busInfoDoc.status === 'Active' ? 'text-green-500' : 'text-red-500'}">${busInfoDoc.status}</td>
            <td class=" flex flex-wrap gap-2 justify-start px-4 py-2 border-b cursor-pointer">
                <span class="edit-btn mr-4 text-blue-600" data-bus-info-edt-btn="${busInfoDoc.busNo}" id="bus-info-edit-btn">Edit</span>
                <span class=" text-red-600" data-bus-info-del-btn="${busInfoDoc.busNo}" id="bus-info-delete-btn">Delete</span>
            </td>
        </tr>
    `;
}
// Update the table with the new row
document.getElementById('bus-info-table').innerHTML = busInfoTr;

const busInfoEdtModal = document.getElementById('bus-info-edit-modal');
const busInfoAddModal = document.getElementById('bus-info-add-modal');

const busInfoAddForm = document.getElementById('bus-info-add-form');
const busInfoEdtForm = document.getElementById('bus-info-edt-form');

const busInfoNumErrMsg = document.getElementById('bus-info-num-err-msg');

const busInfoAddBtn = document.getElementById('add-bus-info-modal-btn');
const busInfoAddNowBtn = document.getElementById('info-add-now');
const busInfoAddCancelBtn = document.getElementById('info-add-cancel');
const busInfoEdtCancelBtn = document.getElementById('info-edt-cancel');

const busInfoEdtBtnAll = document.querySelectorAll('[data-bus-info-edt-btn]');
const busInfoDelBtnAll = document.querySelectorAll('[data-bus-info-del-btn]');

document.getElementById('busNo-add').addEventListener('input', async () => {
    try {
        // const busNumber = document.getElementById('busNo-add').value;
        const exists = await checkBusNumberExists(document.getElementById('busNo-add').value, 'HomeDocumentsCollection');
        console.log(`Bus number exists: ${exists}`);

        if (exists) {
            busInfoNumErrMsg.classList.remove('hidden');
            busInfoAddNowBtn.disabled = true;
            busInfoAddNowBtn.classList.add('cursor-not-allowed');
        } else {
            busInfoNumErrMsg.classList.add('hidden');
            busInfoAddNowBtn.disabled = false;
            busInfoAddNowBtn.classList.remove('cursor-not-allowed');
        }
    } catch (e) {
        console.error('Error checking bus number: ', e);
    }
});



// will show the modal and the hidden buttons for adding
busInfoAddBtn.addEventListener('click', () => {
    showBusInfoModal(busInfoAddModal)
    closeBusInfoModal(busInfoAddCancelBtn, busInfoAddModal);

})
busInfoAddForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const newBusInfoDataObj = {
        busNo: document.getElementById('busNo-add').value,
        startingPoint: document.getElementById('startingPoint-add').value,
        arrivalPoint: document.getElementById('arrivalPoint-add').value,
        departureTime: document.getElementById('departureTime-add').value,
        plateNo: document.getElementById('plateNo-add').value,
        busModel: document.getElementById('busModel-add').value,
        busCapacity: document.getElementById('busNo-add').value,
        busConductor: document.getElementById('busCapacity-add').value,
        busDriver: document.getElementById('busDriver-add').value,
        status: document.getElementById('status-add').value,
        timeCreated: new Date().toLocaleString()
    }
    
    await addDataToFirestore('HomeDocumentsCollection', newBusInfoDataObj);
    showSuccessAlert('Bus Information added successfully');
}) 



// will show the modal and the hidden buttons for editing
busInfoEdtBtnAll.forEach( (edtBtn) => {
    edtBtn.addEventListener('click', async() => {
        showBusInfoModal(busInfoEdtModal);
        closeBusInfoModal(busInfoEdtCancelBtn, busInfoEdtModal);

        const busNoEdt = edtBtn.getAttribute('data-bus-info-edt-btn');
        const singleBusInfo = await getSingleFirestoreData(busNoEdt, 'HomeDocumentsCollection');

        if(singleBusInfo){
            document.getElementById('busNo').value = singleBusInfo.busNo;
            document.getElementById('startingPoint').value = singleBusInfo.startingPoint;
            document.getElementById('arrivalPoint').value = singleBusInfo.arrivalPoint;
            document.getElementById('departureTime').value = singleBusInfo.departureTime;
            document.getElementById('plateNo').value = singleBusInfo.plateNo;
            document.getElementById('busModel').value = singleBusInfo.busModel;
            document.getElementById('busCapacity').value = singleBusInfo.busCapacity;
            document.getElementById('busConductor').value = singleBusInfo.busConductor;
            document.getElementById('busDriver').value = singleBusInfo.busDriver;
            document.getElementById('statusInfo').value = singleBusInfo.status;
        }
    })
})

busInfoEdtForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const updatedBusInfoData = {
        busNo: document.getElementById('busNo').value,
        startingPoint: document.getElementById('startingPoint').value,
        arrivalPoint: document.getElementById('arrivalPoint').value,
        departureTime: document.getElementById('departureTime').value,
        plateNo: document.getElementById('plateNo').value,
        busModel: document.getElementById('busModel').value,
        busCapacity: document.getElementById('busCapacity').value,
        busConductor: document.getElementById('busConductor').value,
        busDriver: document.getElementById('busDriver').value,
        status: document.getElementById('statusInfo').value
    }

    await updateSingleFirestoreData(updatedBusInfoData.busNo, 'HomeDocumentsCollection', updatedBusInfoData);
    showSuccessAlert('Bus Information updated successfully');
});

// delete bus information
busInfoDelBtnAll.forEach( (delBtn) => {
    const busNoDelete = delBtn.getAttribute('data-bus-info-del-btn');

    delBtn.addEventListener('click', () => {
        handleDeleteInformation(busNoDelete, 'HomeDocumentsCollection');
    })
})
 
function showBusInfoModal(modal){
    // loops through the divs and shows the div that was clicked
    [busInfoAddModal, busInfoEdtModal].forEach(m => {
        if(m !== modal){
            m.classList.add('hidden');
        } else{
            m.classList.remove('hidden');
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


