// script.js

const logoutBtn = document.getElementById('logoutBtn');
const logoutBtnMobile = document.getElementById('logoutBtnMobile');

// Selectors for buttons and modals
const loginBtn = document.getElementById('loginBtn');
const loginBtnMobile = document.getElementById('loginBtnMobile');
const getStartedBtn = document.getElementById('getStartedBtn');
const loginModal = document.getElementById('loginModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const viewSampleBtn = document.getElementById('viewSampleBtn');
const sampleReportModal = document.getElementById('sampleReportModal');
const closeSampleReportModal = document.getElementById('closeSampleReportModal');
const loginForm = document.getElementById('loginForm');
const editGarageModal = document.getElementById("editGarageModal");
const closeEditGarageModal = document.getElementById("closeEditGarageModal");
const editGarageForm = document.getElementById("editGarageForm");

// --- Modal Control Functions ---
const openModal = (modal) => {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Disable scrolling
};

const closeModal = (modal) => {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto'; // Enable scrolling
};

// --- Event Listeners ---
// Open login modal
loginBtn.addEventListener('click', () => openModal(loginModal));
loginBtnMobile.addEventListener('click', () => openModal(loginModal));
getStartedBtn.addEventListener('click', () => openModal(loginModal));

// Close login modal
closeLoginModal.addEventListener('click', () => closeModal(loginModal));
loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) closeModal(loginModal);
});

// Open sample report modal
viewSampleBtn.addEventListener('click', () => openModal(sampleReportModal));

// Close sample report modal
closeSampleReportModal.addEventListener('click', () => closeModal(sampleReportModal));
sampleReportModal.addEventListener('click', (e) => {
    if (e.target === sampleReportModal) closeModal(sampleReportModal);
});

// Toggle mobile menu
menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

// --- Mock Login Logic (Enhanced) ---
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userRole = document.getElementById('userRole').value;
    const username = document.getElementById('username').value.trim();

    if (!username) {
        alert("Please enter your username.");
        return;
    }

    // Store current logged-in user in memory
    sessionStorage.setItem("loggedInUser", username);
    sessionStorage.setItem("loggedInRole", userRole);

    alert(`Logged in as ${username} (${userRole})`);

    // Show logout buttons, hide login buttons
    loginBtn.classList.add("hidden");
    loginBtnMobile.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
    logoutBtnMobile.classList.remove("hidden");

    closeModal(loginModal);

    if (userRole === "mechanic") {
        document.getElementById("upload-report").scrollIntoView({ behavior: "smooth" });
    } else if (userRole === "client") {
        displayReportsForUser(username);
        document.getElementById("client-dashboard").scrollIntoView({ behavior: "smooth" });
    }
});

// Filter reports for a specific client
function displayReportsForUser(clientName) {
    const reports = JSON.parse(localStorage.getItem("maintenanceReports")) || [];
    const tableBody = document.getElementById("reportTableBody");
    tableBody.innerHTML = "";

    reports
        .filter(r => r.owner.toLowerCase() === clientName.toLowerCase())
        .forEach(r => {
            const row = document.createElement("tr");
            row.className = "border-b hover:bg-gray-50";
            row.innerHTML = `
                <td class="p-3">${r.date}</td>
                <td class="p-3">${r.owner}</td>
                <td class="p-3">${r.vehicle}</td>
                <td class="p-3">${r.plate}</td>
                <td class="p-3">${r.mileage} km</td>
                <td class="p-3">${r.services}</td>
                <td class="p-3 text-accent-blue underline cursor-pointer"
                    onclick="scrollToGarage('${r.garageName}')">
                    ${r.garageName}
                </td>
            `;
            tableBody.appendChild(row);
        });
}

// --- Garage Display ---
let garages = JSON.parse(localStorage.getItem("garages")) || [
    { name: "SpeedyFix Auto Garage", location: "Kuala Lumpur", contact: "012-3456789", owner: "MechanicA" },
    { name: "ProMechanic Workshop", location: "Petaling Jaya", contact: "019-8765432", owner: "MechanicB" },
    { name: "City Auto Care", location: "Shah Alam", contact: "017-1122334", owner: "MechanicC" },
];

function displayGarages(filter = "") {
    const garageList = document.getElementById("garageList");
    garageList.innerHTML = "";

    const loggedInRole = sessionStorage.getItem("loggedInRole");
    const loggedInUser = sessionStorage.getItem("loggedInUser");

    garages
        .filter(g => g.name.toLowerCase().includes(filter.toLowerCase()))
        .forEach((g, index) => {
            const card = document.createElement("div");
            card.className = "bg-white p-6 rounded-xl shadow-md";
            card.innerHTML = `
                <h3 class="font-bold text-xl mb-2">${g.name}</h3>
                <p class="text-text-light"><strong>Location:</strong> ${g.location}</p>
                <p class="text-text-light"><strong>Contact:</strong> ${g.contact}</p>
                ${loggedInRole === "mechanic" && loggedInUser === g.owner ? 
                    `<button onclick="openEditGarage(${index})" class="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600">Edit</button>` 
                    : ""}
            `;
            garageList.appendChild(card);
        });
}

// Search Garages
document.getElementById("garageSearch").addEventListener("input", (e) => {
    displayGarages(e.target.value);
});

// Initial Load
displayGarages();

// --- Report Form Submission ---
document.getElementById("reportForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const loggedInUser = sessionStorage.getItem("loggedInUser");
    const mechanicGarage = garages.find(g => g.owner === loggedInUser);

    const report = {
        owner: document.getElementById("ownerName").value,
        vehicle: document.getElementById("vehicleModel").value,
        plate: document.getElementById("licensePlate").value,
        mileage: document.getElementById("mileage").value,
        services: document.getElementById("servicesPerformed").value,
        date: new Date().toLocaleDateString(),
        garageName: mechanicGarage ? mechanicGarage.name : "Independent Mechanic"
    };

    const reports = JSON.parse(localStorage.getItem("maintenanceReports")) || [];
    reports.push(report);
    localStorage.setItem("maintenanceReports", JSON.stringify(reports));

    displayReports();
    e.target.reset();
    alert("Report uploaded successfully!");
});

// --- Display Reports ---
function displayReports(filter = "") {
    const reports = JSON.parse(localStorage.getItem("maintenanceReports")) || [];
    const tableBody = document.getElementById("reportTableBody");
    tableBody.innerHTML = "";

    reports
        .filter(r => 
            r.owner.toLowerCase().includes(filter.toLowerCase()) ||
            r.vehicle.toLowerCase().includes(filter.toLowerCase()) ||
            r.plate.toLowerCase().includes(filter.toLowerCase())
        )
        .forEach(r => {
            const row = document.createElement("tr");
            row.className = "border-b hover:bg-gray-50";
            row.innerHTML = `
                <td class="p-3">${r.date}</td>
                <td class="p-3">${r.owner}</td>
                <td class="p-3">${r.vehicle}</td>
                <td class="p-3">${r.plate}</td>
                <td class="p-3">${r.mileage} km</td>
                <td class="p-3">${r.services}</td>
                <td class="p-3 text-accent-blue underline cursor-pointer"
                    onclick="scrollToGarage('${r.garageName}')">
                    ${r.garageName}
                </td>
            `;
            tableBody.appendChild(row);
        });
}

// Search in Client Dashboard
document.getElementById("reportSearch").addEventListener("input", (e) => {
    displayReports(e.target.value);
});

// Load reports on page load
displayReports();

// --- Scroll to Garage ---
function scrollToGarage(garageName) {
    const cards = document.querySelectorAll("#garageList > div");
    cards.forEach(card => {
        if (card.querySelector("h3").innerText === garageName) {
            card.scrollIntoView({ behavior: "smooth", block: "center" });
            card.classList.add("ring-4", "ring-accent-blue");
            setTimeout(() => card.classList.remove("ring-4", "ring-accent-blue"), 2000);
        }
    });
}

// --- Logout ---
function logoutUser() {
    sessionStorage.clear();
    alert("Logged out successfully!");

    // Reset UI
    loginBtn.classList.remove("hidden");
    loginBtnMobile.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
    logoutBtnMobile.classList.add("hidden");

    // Show all reports again
    displayReports();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
}

logoutBtn.addEventListener("click", logoutUser);
logoutBtnMobile.addEventListener("click", logoutUser);

// --- Auto-login Check ---
window.addEventListener("DOMContentLoaded", () => {
    const savedUser = sessionStorage.getItem("loggedInUser");
    const savedRole = sessionStorage.getItem("loggedInRole");

    if (savedUser && savedRole) {
        loginBtn.classList.add("hidden");
        loginBtnMobile.classList.add("hidden");
        logoutBtn.classList.remove("hidden");
        logoutBtnMobile.classList.remove("hidden");

        if (savedRole === "mechanic") {
            document.getElementById("upload-report").scrollIntoView();
        } else if (savedRole === "client") {
            displayReportsForUser(savedUser);
            document.getElementById("client-dashboard").scrollIntoView();
        }
    }
});

// --- Edit Garage ---
let editingGarageIndex = null;

function openEditGarage(index) {
    editingGarageIndex = index;
    document.getElementById("editGarageName").value = garages[index].name;
    document.getElementById("editGarageLocation").value = garages[index].location;
    document.getElementById("editGarageContact").value = garages[index].contact;
    openModal(editGarageModal);
}

closeEditGarageModal.addEventListener("click", () => closeModal(editGarageModal));
editGarageModal.addEventListener("click", (e) => {
    if (e.target === editGarageModal) closeModal(editGarageModal);
});

editGarageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    garages[editingGarageIndex].name = document.getElementById("editGarageName").value;
    garages[editingGarageIndex].location = document.getElementById("editGarageLocation").value;
    garages[editingGarageIndex].contact = document.getElementById("editGarageContact").value;

    localStorage.setItem("garages", JSON.stringify(garages));
    displayGarages();
    closeModal(editGarageModal);
    alert("Garage info updated successfully!");
});
