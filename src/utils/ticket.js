

export function generateTicket(from, to, discount, price) {
  alert(`Ticket from ${from} to ${to} with a ${discount}% discount costs ${price}`);
  
}

export function updatePrice(from, to, discount, priceHTML, fromHTML, toHTML, errHTML, button) {
    let updatedPrice = 0;
    let discountPrice = 0;

    if(discount === 'student'){
        discountPrice = 0.2;
    } else if(discount === 'senior'){
        discountPrice = 0.3;
    } else if(discount === 'pwd'){
        discountPrice = 0.4;
    } else {
        discountPrice = 0;
    }
    
    // Base price is 120 for these routes
    if(from.includes('Bulakan') || from.includes('Divisoria') || from.includes('Ermita')){
        updatedPrice = 120 - (120 * discountPrice);
    } else{
        updatedPrice = 105 - (105 * discountPrice);
    }

    // err handler
    if(from === to){
        updatedPrice = 0;
        fromHTML.classList.add('border-red-500');
        toHTML.classList.add('border-red-500');
        errHTML.classList.remove('hidden');
        button.disabled = true;
        button.classList.add('cursor-not-allowed');
    } else{
        fromHTML.classList.remove('border-red-500');
        toHTML.classList.remove('border-red-500');
        errHTML.classList.add('hidden');
        button.disabled = false;
        button.classList.remove('cursor-not-allowed');
    }

    priceHTML.innerHTML = updatedPrice.toFixed(2);
}