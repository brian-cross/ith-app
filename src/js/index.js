import { createDiv } from "./dom";
import getHolidays from "./holidays";
import months from "./months";
import monthContainer from "./calendar";
import "./scroll";

if (!localStorage.getItem("week")) {
  localStorage.setItem("week", "1");
}

let currentWeek = localStorage.getItem("week");
let currentYear = new Date().getFullYear();
let menuIsOpen = false;

// Mobile menu button handler
const hamburger = document.querySelector(".hamburger");
const mainMenu = document.querySelector(".main-menu");
hamburger.addEventListener("click", handleMenuOpenClose);

// Nav link handlers
const navLinks = document.querySelectorAll(".main-menu-item");
navLinks.forEach(navLink => {
  navLink.addEventListener("click", e => {
    currentWeek = e.currentTarget.dataset.week;
    localStorage.setItem("week", currentWeek);
    renderCalendar(currentYear, currentWeek);
    handleMenuOpenClose();
  });
});

// Page overlay for closing the menu
const overlay = document.querySelector(".overlay");
overlay.addEventListener("click", handleMenuOpenClose);

// Open or close the menu
function handleMenuOpenClose() {
  menuIsOpen = !menuIsOpen;
  if (menuIsOpen) {
    hamburger.classList.add("open");
    mainMenu.classList.add("open");
    overlay.style.display = "block";
  } else {
    hamburger.classList.remove("open");
    mainMenu.classList.remove("open");
    overlay.style.display = "none";
  }
}

// Create a container to hold the calendar
const calendarContainer = createDiv("", "calendar-container");
document.querySelector(".page-container").appendChild(calendarContainer);

// Render the calendar after removing any existing calendar
async function renderCalendar(year, week) {
  const holidays = await getHolidays(year); // Get list of stat holidays for the year
  while (calendarContainer.firstChild)
    calendarContainer.removeChild(calendarContainer.firstChild);
  months.forEach(month =>
    calendarContainer.appendChild(monthContainer(year, month, week, holidays))
  );
}

renderCalendar(currentYear, currentWeek);
