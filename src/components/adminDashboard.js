import { toggleAdminNav } from "../utils/pagination.js";
import { logoutAdmin } from '../utils/user.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { firebaseConfig } from '../services/firebaseConfig.js';
import { toggleBusOperations } from "../utils/pagination.js";
import { showSuccessAlert, handleDeleteInformation } from "../utils/alert.js";
import { addDataToFirestore, getFirestoreData, getSingleFirestoreData, getSingleFirestoreDocument, updateSingleFirestoreData, checkBusNumberExists, deleteSingleFirestoreDocument, getSearchTerm, getCollectionSize, getAllFirestoreDocumentById, getCollectionSizeRDB, getRDBUsers } from "../firebase/db.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const logoutButton = document.getElementById('logout-btn');
logoutAdmin(logoutButton, auth);

// Get the sizes of both collections
const ticketSoldSize = await getCollectionSize('VerifiedTicketsCollection');
const ticketGeneratedSize = await getCollectionSize('TicketGeneratedCollection');

const ticketUnsoldSize = ticketGeneratedSize - ticketSoldSize;

// Update total sold display
document.getElementById('total-ticket-sold').textContent = ticketSoldSize;

const chart1 = new Chart(document.getElementById("chart1"), {
    type: "doughnut",
    data: {
        labels: ["Sold Tickets", "Unconfirmed Tickets"],
        datasets: [{
            data: [ticketSoldSize, ticketUnsoldSize],
            backgroundColor: ["#3498db", "#ecf0f1"],
            hoverBackgroundColor: ["#2980b9", "#bdc3c7"]
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    generateLabels: function (chart) {
                        const data = chart.data.datasets[0].data;
                        return chart.data.labels.map((label, i) => ({
                            text: `${label}: ${data[i].toLocaleString()}`,
                            fillStyle: chart.data.datasets[0].backgroundColor[i],
                            strokeStyle: chart.data.datasets[0].backgroundColor[i],
                            lineWidth: 1,
                            hidden: false,
                            index: i
                        }));
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.label}: ${context.parsed.toLocaleString()}`;
                    }
                }
            }
        }
    }
});


// Operational vs Inactive buses chart
const activeBuses = await getAllFirestoreDocumentById('status', 'Active', 'ScheduleDocumentsCollection');
const inactiveBuses = await getAllFirestoreDocumentById('status', 'Inactive', 'ScheduleDocumentsCollection');
document.getElementById('active-buses').textContent = activeBuses.length;

const chart2 = new Chart(document.getElementById("chart2"), {
    type: "doughnut",
    data: {
        labels: ["Active Buses", "Inactive Buses"],
        datasets: [{
            data: [activeBuses.length, inactiveBuses.length],
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

// all payment records chart
const payments = await getFirestoreData('BussingPaymentsCollection');

let thisMonthTotal = 0;
let previousMonthsTotal = 0;

const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

const monthNames = {
    January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
    July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
};

for (let payment of payments) {
    const amount = Number(payment.amountPaid || 0);
    const parts = payment.dateTime?.split(' ');

    if (parts && parts.length === 2) {
        const [, rawDate] = parts;

        // Extract day, month name, and year
        const match = rawDate.match(/^(\d{2})([A-Za-z]+)(\d{2})$/); 
        if (match) {
            const [, dayStr, monthStr, yearStr] = match;
            const day = parseInt(dayStr);
            const monthName = monthStr;
            const year = 2000 + parseInt(yearStr);
            const month = monthNames[monthName];
            if (month !== undefined) {
                const paymentDate = new Date(year, month, day);

                if (year === currentYear && month === currentMonth) {
                    thisMonthTotal += amount;
                } else if (
                    year < currentYear || 
                    (year === currentYear && month < currentMonth)
                ) {
                    previousMonthsTotal += amount;
                } else {
                    console.warn('Skipping future-dated payment:', payment);
                }

                continue;
            }
        }

        console.warn('Unrecognized date format in:', payment.dateTime);
        previousMonthsTotal += amount;
    } else {
        previousMonthsTotal += amount;
    }
}

const totalEarnings = thisMonthTotal + previousMonthsTotal;
document.getElementById('total-earnings-value').innerHTML = `₱${totalEarnings.toLocaleString()}`;

// Chart
const chart3 = new Chart(document.getElementById("chart3"), {
    type: "doughnut",
    data: {
        labels: ["This Month", "Previous Months"],
        datasets: [{
            data: [thisMonthTotal, previousMonthsTotal],
            backgroundColor: ["#FF90BB", "#ecf0f1"],
            hoverBackgroundColor: ["#FF90BB", "#bdc3c7"]
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    generateLabels: (chart) => {
                        const data = chart.data;
                        return data.labels.map((label, i) => ({
                            text: `${label}: ₱${chart.data.datasets[0].data[i].toLocaleString()}`,
                            fillStyle: chart.data.datasets[0].backgroundColor[i],
                            strokeStyle: chart.data.datasets[0].backgroundColor[i],
                            lineWidth: 1,
                            hidden: false,
                            index: i
                        }));
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.label}: ₱${context.parsed.toLocaleString()}`
                }
            }
        }
    }
});


// Users chart
const users = await getCollectionSizeRDB("Users");
const drivers = await getCollectionSizeRDB("DUsers");
const admins = await getCollectionSizeRDB("Admins");

const userDataTb = await getRDBUsers("Users");
const driverDataTb = await getRDBUsers("DUsers");
const adminDataTb = await getRDBUsers("Admins");

const chart4 = new Chart(document.getElementById("chart4"), {
    type: "doughnut",
    data: {
        labels: ["Users", "Drivers", "Admins",],
        datasets: [{
            data: [users, drivers, admins],
            backgroundColor: ["#4E71FF", "#D50B8B", "#7F55B1"],
            hoverBackgroundColor: ["#4E71FF", "#D50B8B", "#7F55B1"]
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' }
        }
    }
});

let userTbHTML = '';
let driverTbHTML = '';
let adminTbHTML = '';

userDataTb.forEach((user) => {

    userTbHTML += `
        <tr class="border-2 border-b-black">
            <td class="border py-2 text-center">${user.id}</td>
            <td class="border py-2 text-center">User</td>
            <td class="border py-2 text-center">${user.email}</td>
            <td class="border py-2 text-center">${user.createdAt}</td>
        </tr>
    `;
});

driverDataTb.forEach((driver) => {
    driverTbHTML += `
        <tr class="border-2 border-b-black">
            <td class="border py-2 text-center">${driver.id}</td>
            <td class="border py-2 text-center">
            ${driver.email.includes('@bussing.com') ? 'Driver' : 'User'}
            </td>
            <td class="border py-2 text-center">${driver.email}</td>
            <td class="border py-2 text-center">${driver.createdAt}</td>
        </tr>
    `;
})

adminDataTb.forEach((admin) => {
    adminTbHTML += `
        <tr class="border-2 border-b-black">
            <td class="border py-2 text-center">${admin.id}</td>
            <td class="border py-2 text-center">
            ${admin.email.includes('@admin.com') ? 'Admin' : 'User'}
            </td>
            <td class="border py-2 text-center">${admin.email}</td>
            <td class="border py-2 text-center">${admin.createdAt}</td>
        </tr>
    `;
})

document.getElementById("total-users").innerHTML = users + drivers + admins;
document.getElementById("users-table").innerHTML = userTbHTML + driverTbHTML + adminTbHTML;

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

ticketGenratedCollection.sort((a, b) => {
    const aTime = a.createdAt?.toDate?.().getTime?.() || 0;
    const bTime = b.createdAt?.toDate?.().getTime?.() || 0;
    return bTime - aTime;
});

let currentPage = 1;
const itemsPerPage = 10;
const totalPages = Math.ceil(ticketGenratedCollection.length / itemsPerPage);

// render tickets and attach delete buttons
function renderTickets(tickets) {
    let ticketTrHTML = '';
    tickets.forEach((ticketGeneratedDoc) => {
        let formattedDate = 'N/A';

        if (ticketGeneratedDoc.createdAt && typeof ticketGeneratedDoc.createdAt.toDate === 'function') {
            const dateObj = ticketGeneratedDoc.createdAt.toDate();
            formattedDate = dateObj.toLocaleString('en-PH', {
                timeZone: 'Asia/Manila',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
            });
        }

        ticketTrHTML += `
            <tr class="border-2 border-b-black">
                <td class="border py-2 text-center">${ticketGeneratedDoc.uid}</td>
                <td class="border py-2 text-center">${ticketGeneratedDoc.ticketCode}</td>
                <td class="border py-2 text-center">${ticketGeneratedDoc.from} - ${ticketGeneratedDoc.to}</td>
                <td class="border py-2 text-center">${ticketGeneratedDoc.discount}</td>
                <td class="border py-2 text-center">₱${ticketGeneratedDoc.price}</td>
                <td class="border py-2 text-center">${formattedDate}</td>
                <td class="border py-2 text-center">
                    <button class="border p-2 bg-red-500 hover:bg-red-600 text-white" data-ticket-reject="${ticketGeneratedDoc.ticketCode}">Delete</button>
                </td>
            </tr>
        `;
    });

    document.getElementById('ticket-inventory-table').innerHTML = ticketTrHTML;

    // Add event listeners to the delete buttons
    const ticketRejectBtns = document.querySelectorAll('[data-ticket-reject]');
    ticketRejectBtns.forEach((rejectBtn) => {
        const userClickedBtn = rejectBtn.getAttribute('data-ticket-reject');

        rejectBtn.addEventListener('click', async () => {
            await deleteSingleFirestoreDocument('ticketCode', userClickedBtn, 'TicketGeneratedCollection');
            showSuccessAlert('Ticket deleted successfully');
        });
    });
}

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderTablePage(currentPage);
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        renderTablePage(currentPage);
    }
});

// function to render a specific page
function renderTablePage(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentTickets = ticketGenratedCollection.slice(start, end);
    renderTickets(currentTickets);

    // disable pagination buttons appropriately
    document.getElementById('prev-btn').disabled = currentPage === 1;
    document.getElementById('next-btn').disabled = currentPage === totalPages;
}

renderTablePage(currentPage);

// handle search functionality
document.getElementById('search-ticket').addEventListener('input', async () => {
    const searchTicket = document.getElementById('search-ticket').value;

    if (!searchTicket) {
        renderTablePage(currentPage);
        return;
    }

    const ticketFound = await getSearchTerm('ticketCode', searchTicket, 'TicketGeneratedCollection');

    if (ticketFound && ticketFound.length > 0) {
        const limitedResults = ticketFound.slice(0, 10);
        renderTickets(limitedResults);
    } else {
        document.getElementById('ticket-inventory-table').innerHTML = '<tr><td colspan="7" class="text-center py-2">No tickets found</td></tr>';
    }
});

// bus operations admin
const busScheduleTab = document.getElementById('bus-schedule-tab');
const busInfoTab = document.getElementById('bus-info-tab');
const busScheduleSection = document.getElementById('bus-schedule-section');
const busInfoSection = document.getElementById('bus-info-section');
toggleBusOperations(busScheduleTab, busInfoTab, busScheduleSection, busInfoSection);

const scheduleModal = document.getElementById('schedule-modal');
scheduleModal.style.display = 'none';

// Populate bus number dropdown from Firestore
async function populateBusNumberDropdown() {
    try {
        const busDropdown = document.getElementById('bus-number');
        const homeDocs = await getFirestoreData('HomeDocumentsCollection');

        // Clear existing options and set default
        busDropdown.innerHTML = `<option value="" disabled selected>Select a bus</option>`;

        // Populate with busNo values
        homeDocs.forEach(doc => {
            if (doc.busNo) {
                const option = document.createElement('option');
                option.value = doc.busNo;
                option.textContent = doc.busNo;
                busDropdown.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Failed to load bus numbers:', error);
    }
}

// Open modal and populate dropdown
document.getElementById('add-schedule-btn').addEventListener('click', function () {
    scheduleModal.style.display = 'flex';
    populateBusNumberDropdown();
});

// Close the modal
document.getElementById('modal-cancel-btn').addEventListener('click', () => {
    scheduleModal.style.display = 'none';
})

// Get the schedules from Firestore
let scheduleData = await getFirestoreData('ScheduleDocumentsCollection');

// Sort by busNo in ascending numeric order
scheduleData.sort((a, b) => {
    return parseInt(a.busNo) - parseInt(b.busNo);
});

let newRowHTML = "";
for (let scheduleDoc of scheduleData) {
    newRowHTML += `
        <tr>
            <td class="px-4 py-2 border-b">Bus ${scheduleDoc.busNo}</td>
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
    rowData.addEventListener('click', async () => {
        // Show the modal to edit the schedule
        editModal.style.display = 'flex';


        // Get the bus number from the clicked row's data attribute
        const busNo = rowData.getAttribute('data-row-edit');
        const singleSchedData = await getSingleFirestoreData(busNo, 'ScheduleDocumentsCollection');
        const singleBusInfoData = await getSingleFirestoreData(busNo, 'HomeDocumentsCollection');

        document.getElementById('editAvailableSeats').addEventListener('input', (e) => {
            const currentValue = parseInt(e.target.value);
            const maxSeats = parseInt(singleBusInfoData.busCapacity);
            const errMsg = document.getElementById('availableSeatsErrMsg');
            const updateBtn = document.getElementById('update-edit-btn');

            if (currentValue > maxSeats) {
                errMsg.style.display = 'block';
                updateBtn.classList.add('cursor-not-allowed');
                updateBtn.disabled = true;
            } else if (currentValue < 1) {
                alert("invalid value");
                updateBtn.classList.add('cursor-not-allowed');
                updateBtn.disabled = true;
            } else {
                errMsg.style.display = 'none';
                updateBtn.disabled = false;
                updateBtn.classList.remove('cursor-not-allowed');
            }
        });


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

    rowData.addEventListener('click', async () => {
        handleDeleteInformation(deleteBusNo, 'ScheduleDocumentsCollection');
    });
})

// Attach the form submit listener just once, outside the click handler
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
const busNo = document.getElementById('bus-number');

document.getElementById('bus-number').addEventListener('input', async () => {

    try {
        if (await checkBusNumberExists(busNo.value, 'ScheduleDocumentsCollection')) {
            busNumErr.classList.remove('hidden');
            saveBtn.classList.add('cursor-not-allowed');
            saveBtn.disabled = true;
        } else {
            busNumErr.classList.add('hidden');
            saveBtn.classList.remove('cursor-not-allowed');
            saveBtn.disabled = false;
        }
    } catch (e) {
        console.error('Error checking bus number: ', e);
    }
});

document.getElementById('available-seats').addEventListener('input', async (e) => {
    const singleBusInfoData = await getSingleFirestoreData(busNo.value, 'HomeDocumentsCollection');
    const availableSeatsExceed = document.getElementById('available-seats-err-msg');
    const seatValue = parseInt(e.target.value);
    const seatLimit = parseInt(singleBusInfoData.busCapacity);

    if (seatValue > seatLimit) {
        availableSeatsExceed.classList.remove('hidden');
        saveBtn.classList.add('cursor-not-allowed');
        saveBtn.disabled = true;
    } else if (seatValue < 1) {
        alert("invalid value")
        saveBtn.classList.add('cursor-not-allowed');
        saveBtn.disabled = true;
    } else {
        availableSeatsExceed.classList.add('hidden');
        saveBtn.classList.remove('cursor-not-allowed');
        saveBtn.disabled = false;
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
    };

    await addDataToFirestore('ScheduleDocumentsCollection', scheduleDataObject);
    showSuccessAlert('Schedule added successfully');
});


//  Bus Information
let busInfoDataFirestore = await getFirestoreData('HomeDocumentsCollection');

busInfoDataFirestore.sort((a, b) => {
    return parseInt(a.busNo) - parseInt(b.busNo);
});

let busInfoTr = "";

for (let busInfoDoc of busInfoDataFirestore) {
    busInfoTr += `
        <tr>
            <td class="px-4 py-2 border-b">${busInfoDoc.busNo}</td>
            <td class="px-4 py-2 border-b">${busInfoDoc.plateNo}</td>
            <td class="px-4 py-2 border-b">${busInfoDoc.busModel}</td>
            <td class="px-4 py-2 border-b">${busInfoDoc.busCapacity}</td>
            <td class="px-4 py-2 border-b">${busInfoDoc.busConductor}</td>
            <td class="px-4 py-2 border-b">${busInfoDoc.busDriver}</td>
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
busInfoAddForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newBusInfoDataObj = {
        busNo: document.getElementById('busNo-add').value,
        plateNo: document.getElementById('plateNo-add').value,
        busModel: document.getElementById('busModel-add').value,
        busCapacity: document.getElementById('busCapacity-add').value,
        busConductor: document.getElementById('busConductor-add').value,
        busDriver: document.getElementById('busDriver-add').value,
        timeCreated: new Date().toLocaleString()
    }

    await addDataToFirestore('HomeDocumentsCollection', newBusInfoDataObj);
    showSuccessAlert('Bus Information added successfully');
})



// will show the modal and the hidden buttons for editing
busInfoEdtBtnAll.forEach((edtBtn) => {
    edtBtn.addEventListener('click', async () => {
        showBusInfoModal(busInfoEdtModal);
        closeBusInfoModal(busInfoEdtCancelBtn, busInfoEdtModal);

        const busNoEdt = edtBtn.getAttribute('data-bus-info-edt-btn');
        const singleBusInfo = await getSingleFirestoreData(busNoEdt, 'HomeDocumentsCollection');

        if (singleBusInfo) {
            document.getElementById('busNo').value = singleBusInfo.busNo;
            document.getElementById('plateNo').value = singleBusInfo.plateNo;
            document.getElementById('busModel').value = singleBusInfo.busModel;
            document.getElementById('busCapacity').value = singleBusInfo.busCapacity;
            document.getElementById('busConductor').value = singleBusInfo.busConductor;
            document.getElementById('busDriver').value = singleBusInfo.busDriver;
        }
    })
})

busInfoEdtForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const updatedBusInfoData = {
        busNo: document.getElementById('busNo').value,
        plateNo: document.getElementById('plateNo').value,
        busModel: document.getElementById('busModel').value,
        busCapacity: document.getElementById('busCapacity').value,
        busConductor: document.getElementById('busConductor').value,
        busDriver: document.getElementById('busDriver').value,
    }

    await updateSingleFirestoreData(updatedBusInfoData.busNo, 'HomeDocumentsCollection', updatedBusInfoData);
    showSuccessAlert('Bus Information updated successfully');
});

// delete bus information
busInfoDelBtnAll.forEach((delBtn) => {
    const busNoDelete = delBtn.getAttribute('data-bus-info-del-btn');

    delBtn.addEventListener('click', () => {
        handleDeleteInformation(busNoDelete, 'HomeDocumentsCollection');
    })
})

function showBusInfoModal(modal) {
    // loops through the divs and shows the div that was clicked
    [busInfoAddModal, busInfoEdtModal].forEach(m => {
        if (m !== modal) {
            m.classList.add('hidden');
        } else {
            m.classList.remove('hidden');
        }
    })
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeBusInfoModal(closeBtn, modal) {
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    })
}


