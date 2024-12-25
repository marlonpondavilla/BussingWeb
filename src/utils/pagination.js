export function showPage(homeTab, ticketTab, mapsTab, historyTab, activeClass, homeSection, ticketSection, mapsSection, historySection) {

    homeSection.classList.remove('hidden');
    ticketSection.classList.add('hidden');
    mapsSection.classList.add('hidden');
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
        [homeSection, ticketSection, mapsSection, historySection].forEach((sec) => {
            if (sec !== section) {
                sec.classList.add('hidden');
                sec.classList.remove('block');
            }
        });

        // Remove active class and styles from other tabs
        [homeTab, ticketTab, mapsTab, historyTab].forEach(t => {
            if (t !== tab) {
                t.classList.remove(activeClass);
                t.classList.remove('underline', 'text-black', 'font-semibold', 'border-b-4'); 
            }
        });
    }

    // Event listeners for tab clicks
    homeTab.addEventListener('click', () => {
        toggleTab(homeTab, homeSection);
        homeTab.classList.add('underline', 'text-black', 'font-semibold', 'border-b-4');
    });

    ticketTab.addEventListener('click', () => {
        toggleTab(ticketTab, ticketSection);
        ticketTab.classList.add('underline', 'text-black', 'font-semibold', 'border-b-4');
    });

    mapsTab.addEventListener('click', () => {
        toggleTab(mapsTab, mapsSection);
        mapsTab.classList.add('underline', 'text-black', 'font-semibold', 'border-b-4');
    });

    historyTab.addEventListener('click', () => {
        toggleTab(historyTab, historySection);
        historyTab.classList.add('underline', 'text-black', 'font-semibold', 'border-b-4');
    });
}

// user dropdown settings
export function showUserSettings(button, section) {
    let timeout;

    // Show the section when the mouse enters the button
    button.addEventListener('mouseenter', () => {
        clearTimeout(timeout); // Clear any previous timeouts
        section.classList.remove('hidden');  // Ensure it's visible
        section.classList.add('block');      // Add the block class to display it
    });

    // Hide the section when the mouse leaves the button
    button.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => {
            section.classList.remove('block'); // Remove the block class
            section.classList.add('hidden');   // Add the hidden class to hide the section
        }, 100); // Delay before hiding (in ms)
    });

    // If the section itself is hovered, keep it visible
    section.addEventListener('mouseenter', () => {
        clearTimeout(timeout);  // Clear any timeouts so it stays visible
        section.classList.remove('hidden');  // Ensure it's visible
        section.classList.add('block');      // Keep it visible
    });

    // Hide the section again after the mouse leaves the section
    section.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => {
            section.classList.remove('block'); // Remove the block class
            section.classList.add('hidden');   // Add the hidden class
        }, 100); // Delay before hiding
    });
}
