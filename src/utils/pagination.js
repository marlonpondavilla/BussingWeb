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


export function showUserSettings(button, section, activeClass) {
    let timeout;

    button.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
        section.classList.add(activeClass);
    });

    button.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => {
            section.classList.remove(activeClass);
        }, 100);
    });

    section.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
        section.classList.add(activeClass);
    });

    section.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => {
            section.classList.remove(activeClass);
        }, 100);
    });
}
