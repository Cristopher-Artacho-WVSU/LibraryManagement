const _id = localStorage.getItem("_id");
document.getElementById("_id").value = _id;

const username = localStorage.getItem("username");
document.getElementById("username").textContent = username;

const password = localStorage.getItem("password");
document.getElementById("password").value = password;


const last_name = localStorage.getItem("last_name");
document.getElementById("lastName").value = last_name;

const given_name = localStorage.getItem("given_name");
document.getElementById("givenName").value = given_name;

const email_address = localStorage.getItem("email_address");
document.getElementById("emailAddress").value = email_address;

const contact_number = localStorage.getItem("contact_number");
document.getElementById("contactNumber").value = contact_number;

const profile_picture = localStorage.getItem("profile_picture");
document.getElementById("profilePicture").src = profile_picture;
    

const city = localStorage.getItem("city");
const province = localStorage.getItem("province");
const barangay = localStorage.getItem("barangay");

let address = barangay + ", " + province + ", " + city
document.getElementById("address").value = address;


function toggleSidebar() {
var sidebar = document.getElementById("sidebar");
sidebar.classList.toggle('active');
}

function toggleSubMenu() {
var subMenu = document.getElementById("bookSubMenu");
subMenu.classList.toggle('active');
}

function hideSubMenu() {
var subMenu = document.getElementById("bookSubMenu");
subMenu.classList.remove('active'); // Add inactive class to hide submenu
subMenu.classList.add('inactive')
}