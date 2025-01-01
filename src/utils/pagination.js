export function showPage(homeTab, ticketTab, scheduleTab, historyTab, activeClass, homeSection, ticketSection, scheduleSection, historySection) {

    homeSection.classList.remove('hidden');
    ticketSection.classList.add('hidden');
    scheduleSection.classList.add('hidden');
    historySection.classList.add('hidden');

    function toggleTab(tab, section) {
        // Add the active class to the selected tab
        tab.classList.add(activeClass);

        // Show the corresponding section
        section.classList.remove('hidden');
        section.classList.add('block');

        // Hide all other sections
        [homeSection, ticketSection, scheduleSection, historySection].forEach((sec) => {
            if (sec !== section) {
                sec.classList.add('hidden');
                sec.classList.remove('block');
            }
        });

        // Remove active class and styles from other tabs
        [homeTab, ticketTab, scheduleTab, historyTab].forEach(t => {
            if (t !== tab) {
                t.classList.remove(activeClass);
                t.classList.remove('text-black', 'font-semibold', 'border-b-4'); 
            }
        });
    }

    // Event listeners for tab clicks
    homeTab.addEventListener('click', () => {
        toggleTab(homeTab, homeSection);
        homeTab.classList.add('text-black', 'font-semibold', 'border-b-4');
    });

    ticketTab.addEventListener('click', () => {
        toggleTab(ticketTab, ticketSection);
        ticketTab.classList.add('text-black', 'font-semibold', 'border-b-4');
    });

    scheduleTab.addEventListener('click', () => {
        toggleTab(scheduleTab, scheduleSection);
        scheduleTab.classList.add('text-black', 'font-semibold', 'border-b-4');
    });

    historyTab.addEventListener('click', () => {
        toggleTab(historyTab, historySection);
        historyTab.classList.add('text-black', 'font-semibold', 'border-b-4');
    });
}

// user dropdown settings
export function showUserSettings(button, section) {
    let timeout;

    // Show the section when the mouse enters the button
    button.addEventListener('mouseenter', () => {
        clearTimeout(timeout); 
        section.classList.remove('hidden');  
        section.classList.add('block');      
    });

    // Hide the section when the mouse leaves the button
    button.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => {
            section.classList.remove('block'); 
            section.classList.add('hidden');   
        }, 100); 
    });

    // If the section itself is hovered, keep it visible
    section.addEventListener('mouseenter', () => {
        clearTimeout(timeout);  
        section.classList.remove('hidden');  
        section.classList.add('block');      
    });

    // Hide the section again after the mouse leaves the section
    section.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => {
            section.classList.remove('block'); 
            section.classList.add('hidden');   
        }, 100); 
    });
}

// admin navigation
export function toggleAdminNav(dashboarBtn, ticketInventoryButton, busOperationsButton, customerSupportButton, dashboardSection, ticketInventorySection, busOperationsSection, customerSupportSection){
    dashboarBtn.classList.add('text-black', 'font-semibold', 'border-b-4');
    dashboardSection.classList.remove('hidden');
    ticketInventorySection.classList.add('hidden');
    busOperationsSection.classList.add('hidden');
    customerSupportSection.classList.add('hidden');

    function toggleTab(tab, section) {
        // Show the corresponding section
        section.classList.remove('hidden');
        section.classList.add('block');

        // Hide all other sections
        [dashboardSection, ticketInventorySection, busOperationsSection, customerSupportSection].forEach((sec) => {
            if (sec !== section) {
                sec.classList.add('hidden');
                sec.classList.remove('block');
            }
        });

        // Remove active class and styles from other tabs
        [dashboarBtn, ticketInventoryButton, busOperationsButton, customerSupportButton].forEach(t => {
            if (t !== tab) {
                t.classList.remove('text-black', 'font-semibold', 'border-b-4'); 
            }
        });
    }

    dashboarBtn.addEventListener('click', () => {
        toggleTab(dashboarBtn, dashboardSection);
        dashboarBtn.classList.add('text-black', 'font-semibold', 'border-b-4');
    });

    ticketInventoryButton.addEventListener('click', () => {
        toggleTab(ticketInventoryButton, ticketInventorySection);
        ticketInventoryButton.classList.add('text-black', 'font-semibold', 'border-b-4');
    });

    busOperationsButton.addEventListener('click', () => {
        toggleTab(busOperationsButton, busOperationsSection);
        busOperationsButton.classList.add('text-black', 'font-semibold', 'border-b-4');
    });

    customerSupportButton.addEventListener('click', () => {
        toggleTab(customerSupportButton, customerSupportSection);
        customerSupportButton.classList.add('text-black', 'font-semibold', 'border-b-4');
    });
}

export function toggleBusOperations(button1, button2, section1, section2){
    button1.classList.add("border-2", "p-2", "bg-gray-200");
    
    function toggleTab(tab, section){
        [section1, section2].forEach((sec) => {
            if(sec !== section){
                sec.classList.add('hidden');
                sec.classList.remove('block');
            } else{
                sec.classList.remove('hidden');
                sec.classList.add('block');
            }
        });

        [button1, button2].forEach(t => {
            if(t !== tab){
                t.classList.remove("border-2", "p-2", "bg-gray-200");
            } else{
                t.classList.add("border-2", "p-2", "bg-gray-200");
            }
        })
    }
    

    button1.addEventListener('click', () => {
        toggleTab(button1, section1);
    });

    button2.addEventListener('click', () => {
        toggleTab(button2, section2);
    });
}

