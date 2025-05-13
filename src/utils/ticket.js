import { addDataToFirestore } from '../firebase/db.js';
import QRCode from 'https://cdn.skypack.dev/qrcode';

export function generateTicket(from, to, discount, price, qrPopUp, qrDisplay, qrDiscount, qrFrom, qrTo, qrCode, uid) {
    const ticketCode = generateTicketCode();
    const date = new Date();

    const text = `
        Ticket Code: ${ticketCode}
        Price: ${price}`;

    qrPopUp.classList.remove('hidden');
    qrPopUp.classList.add('flex');

    qrCode.innerHTML = ticketCode;
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

    sendGeneratedTicket({
        uid: uid,
        ticketCode: ticketCode,
        from: from,
        to: to,
        discount: discount,
        price: price,
        createdAt: date
    });
}

export function updatePrice(from, to, discount, priceHTML, fromHTML, toHTML, errHTML, button) {
    let updatedPrice = 0;
    let discountPrice = 0;

    const basePrice = 105;
    const regularPrice = 120;

    if (discount.toLowerCase() === 'student') {
        discountPrice = 0.2;
    } else if (discount.toLowerCase() === 'senior') {
        discountPrice = 0.3;
    } else if (discount.toLowerCase() === 'pwd') {
        discountPrice = 0.4;
    } else {
        discountPrice = 0;
    }

    if (from.includes('Bulakan') || from.includes('Cubao')) {
        updatedPrice = basePrice - (basePrice * discountPrice);
    } else {
        updatedPrice = regularPrice - (regularPrice * discountPrice);
    }

    // Error handler
    if (from === to) {
        updatedPrice = 0;
        fromHTML.classList.add('border-red-500');
        toHTML.classList.add('border-red-500');
        errHTML.classList.remove('hidden');
        button.disabled = true;
        button.classList.add('cursor-not-allowed');
    } else {
        fromHTML.classList.remove('border-red-500');
        toHTML.classList.remove('border-red-500');
        errHTML.classList.add('hidden');
        button.disabled = false;
        button.classList.remove('cursor-not-allowed');
    }

    priceHTML.innerHTML = updatedPrice.toFixed(2);
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

async function sendGeneratedTicket(ticketData) {
    await addDataToFirestore('TicketGeneratedCollection', ticketData);
}
