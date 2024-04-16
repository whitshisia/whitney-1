// Load reservations from JSON file
let reservations = [];

// Function to fetch reservations
const fetchReservations = () => {
    const url = 'http://localhost:3000/rooms';
    fetch(url)
        .then(response => response.json())
        .then(data => {
            reservations = data;
            renderReservations(reservations);
        })
        .catch(error => console.error('Error fetching reservations:', error));
};

// Function to render reservations
const renderReservations = (reservations) => {
    const reservationList = document.getElementById('reservationList');
    reservationList.innerHTML = '';

    reservations.forEach((reservation) => {
        const reservationItem = document.createElement('div');
        reservationItem.className = 'border-2 border-black p-4 m-4 rounded';
        reservationItem.innerHTML = `
            <h2 class="text-2xl font-bold mb-4">${reservation.name}</h2>
            <p><strong>Date:</strong> ${reservation.date}</p>
            <p><strong>Time:</strong> ${reservation.time}</p>
            <p><strong>Details:</strong> ${reservation.details}</p>
            <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onclick="deleteReservation(${reservation.id})">Delete</button>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onclick="editReservation(${reservation.id})">Edit</button>
        `;
        reservationList.appendChild(reservationItem);
    });
};

// Function to handle reservation form submission
const submitReservation = () => {
    const url = 'http://localhost:3000/rooms';
    const name = document.getElementById('name').value.trim();
    const date = document.getElementById('date').value.trim();
    const time = document.getElementById('time').value.trim();
    const details = document.getElementById('details').value.trim();

    if (name && date && time && details) {
        const reservation = {
            name,
            date,
            time,
            details
        };
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservation)
        })
        .then(response => response.json())
        .then(data => {
            reservations.push(data);
            renderReservations(reservations);
            alert('Reservation made successfully');
        })
        .catch(error => console.error('Error submitting reservation:', error));
    } else {
        alert('Please fill in all fields');
    }
};

// Function to delete a reservation
const deleteReservation = (id) => {
    const url = `http://localhost:3000/rooms/${id}`;
    fetch(url, {
        method: 'DELETE'
    })
    .then(() => {
        reservations = reservations.filter(reservation => reservation.id !== id);
        renderReservations(reservations);
    })
    .catch(error => console.error('Error deleting reservation:', error));
};

const editReservation = (index) => {
    const reservation = reservations[index];
    const url = 'http://localhost:3000/rooms/';

    document.getElementById('name').value = reservation.name;
    document.getElementById('date').value = reservation.date;
    document.getElementById('time').value = reservation.time;
    document.getElementById('details').value = reservation.details;
    document.getElementById('reservationFormContainer').classList.remove('hidden');
    
    const submitEditButton = document.getElementById('submitEdit');
    
    // Remove existing event listeners before adding a new one
    submitEditButton.removeEventListener('click', submitEditHandler);
    
    const submitEditHandler = () => {
        const newName = document.getElementById('name').value.trim();
        const newDate = document.getElementById('date').value.trim();
        const newTime = document.getElementById('time').value.trim();
        const newDetails = document.getElementById('details').value.trim();

        if (newName && newDate && newTime && newDetails) {
            const updatedReservation = {
                ...reservation,
                name: newName,
                date: newDate,
                time: newTime,
                details: newDetails
            };

            fetch(`${url}${reservation.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedReservation)
            })
            .then(() => {
                reservations[index] = updatedReservation;
                renderReservations(reservations);
                alert('Reservation updated successfully');
            })
            .catch(error => console.error('Error updating reservation:', error));
        } else {
            alert('Please fill in all fields');
        }
    };
    
    submitEditButton.addEventListener('click', submitEditHandler);
};

    // Function to handle "Book Now" button click and update room availability
const bookNowAndUpdateAvailability = () => {
    const name = document.getElementById('name').value.trim();
    const date = document.getElementById('date').value.trim();
    const time = document.getElementById('time').value.trim();
    const details = document.getElementById('details').value.trim();

    if (name && date && time && details) {
        const reservation = {
            name,
            date,
            time,
            details
        };
        fetch('http://localhost:3000/rooms/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservation)
        })
        .then(response => response.json())
        .then(data => {
            // Assuming the reservation is successfully stored in the backend,
            // you can display a success message to the user
            alert('Booking successfully made!');
            // Disable the clicked button and update its text
            const clickedButton = event.target;
            clickedButton.disabled = true;
            clickedButton.textContent = 'Room Unavailable';
        })
        .catch(error => console.error('Error making reservation:', error));
    } else {
        alert('Please fill in all fields');
    }
};

// Select all "Book Now" buttons and add event listeners to each
document.querySelectorAll('.bookNowButton').forEach(button => {
    button.addEventListener('click', bookNowAndUpdateAvailability);
});
           


// Function to show reservation form
document.getElementById('reservationButton').addEventListener('click', () => {
    document.getElementById('reservationFormContainer').classList.remove('hidden');
});

// Function to cancel reservation
document.getElementById('cancelReservation').addEventListener('click', () => {
    document.getElementById('reservationFormContainer').classList.add('hidden');
});

// Fetch reservations on page load
fetchReservations();

