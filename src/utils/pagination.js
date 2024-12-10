
export function showPage(homeTab, ticketTab, mapsTab, historyTab, classList, homeSection, ticketSection, mapsSection, historySection) {
    homeTab.addEventListener('click', () =>{
        homeTab.classList.add(classList);
        homeSection.style.display = 'block';

        ticketSection.style.display = 'none';
        mapsSection.style.display = 'none';
        historySection.style.display = 'none';

        if(ticketTab.classList.contains(classList)){
            ticketTab.classList.remove(classList);
        }
        if(mapsTab.classList.contains(classList)){
            mapsTab.classList.remove(classList);
        }
        if(historyTab.classList.contains(classList)){
            historyTab.classList.remove(classList);
        }
    });

    ticketTab.addEventListener('click', () =>{
        ticketTab.classList.add(classList);
        ticketSection.style.display = 'block';

        homeSection.style.display = 'none';
        mapsSection.style.display = 'none';
        historySection.style.display = 'none';

        if(homeTab.classList.contains(classList)){
            homeTab.classList.remove(classList);
        }
        if(mapsTab.classList.contains(classList)){
            mapsTab.classList.remove(classList);
        }
        if(historyTab.classList.contains(classList)){
            historyTab.classList.remove(classList);
        }
    });

    mapsTab.addEventListener('click', () =>{
        mapsTab.classList.add(classList);
        mapsSection.style.display = 'block';

        homeSection.style.display = 'none';
        ticketSection.style.display = 'none';
        historySection.style.display = 'none';
        

        if(homeTab.classList.contains(classList)){
            homeTab.classList.remove(classList);
        }
        if(ticketTab.classList.contains(classList)){
            ticketTab.classList.remove(classList);
        }
        if(historyTab.classList.contains(classList)){
            historyTab.classList.remove(classList);
        }
    });

    historyTab.addEventListener('click', () =>{
        historyTab.classList.add(classList);
        historySection.style.display = 'block';

        homeSection.style.display = 'none';
        ticketSection.style.display = 'none';
        mapsSection.style.display = 'none';

        if(homeTab.classList.contains(classList)){
            homeTab.classList.remove(classList);
        }
        if(ticketTab.classList.contains(classList)){
            ticketTab.classList.remove(classList);
        }
        if(mapsTab.classList.contains(classList)){
            mapsTab.classList.remove(classList);
        }
    });

}
