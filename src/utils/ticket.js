import QRCode from 'https://cdn.skypack.dev/qrcode';

export function generateTicket(from, to, discount, price, qrPopUp, qrDisplay, qrDiscount, qrFrom, qrTo, qrCode) {
    const text = `Ticket from ${from} to ${to} with a ${discount}% discount costs ₱${price}`;
  
    qrPopUp.classList.remove('hidden');
    qrPopUp.classList.add('flex');

    qrCode.innerHTML = generateTicketCode(); 
    qrFrom.innerHTML = from; 
    qrTo.innerHTML = to; 
    qrDiscount.innerHTML = discount; 

    // Create the QR Code
    QRCode.toCanvas(qrDisplay, text, function (error) {
        if (error) {
            console.error(error); 
        } else {
            console.log('QR Code generated successfully!');
        }
    });
}

function generateTicketCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; 
    let ticketCode = '';
    
    // Generate a random 8-character ticket code
    for (let i = 0; i < 8; i++) { 
        const randomIndex = Math.floor(Math.random() * characters.length); 
        ticketCode += characters[randomIndex];
    }

    return ticketCode; 
}

export function updatePrice(from, to, discount, priceHTML, fromHTML, toHTML, errHTML, button) {
    let updatedPrice = 0;
    let discountPrice = 0;

    if(discount.toLowerCase() === 'student'){
        discountPrice = 0.2;
    } else if(discount.toLowerCase() === 'senior'){
        discountPrice = 0.3;
    } else if(discount.toLowerCase() === 'pwd'){
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