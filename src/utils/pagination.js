export function showPage(homeTab, ticketTab, scheduleTab, historyTab, activeClass, homeSection, ticketSection, scheduleSection, historySection) {

    homeSection.classList.remove('hidden');
    ticketSection.classList.add('hidden');
    scheduleSection.classList.add('hidden');
    historySection.classList.add('hidden');

    function toggleTab(tab, section) {
        console.log('Tab clicked:', tab);
        console.log('Section to show:', section);

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
