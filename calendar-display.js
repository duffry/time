import { getStartDateFromUrl } from './url-params.js';
import { generateCalendarGrid, populateCalendarWithDates, createDayCell, getDaysInMonth, isLeapYear } from './calendar-display.js';

/**
 * Generates a calendar grid, starting 3 months ago and spanning 12 months in total.
 */
export function generateCalendarGrid() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const calendarContainer = document.getElementById('calendar');
    const startDate = getStartDateFromUrl();
    let year = startDate.getFullYear();
    let month = startDate.getMonth();

    for (let i = 0; i < 12; i++) { 
        const monthContainer = document.createElement('div');
        monthContainer.id = 'month' + month; 
        monthContainer.className = 'month-grid';
        monthContainer.innerHTML = '<h3>' + months[month] + ' ' + year + '</h3>';
        calendarContainer.appendChild(monthContainer);

        month++;
        if(month === 12) {
            month = 0;
            year++;
        }
    }
}

/**
 * Populates the previously generated calendar with the appropriate days for each month.
 */
export function populateCalendarWithDates() {
    const currentDate = new Date();
	currentDate.setHours(0, 0, 0, 0);
    const startDate = getStartDateFromUrl();
    let year = startDate.getFullYear();
    let month = startDate.getMonth();

    for (let i = 0; i < 12; i++) { 
        const monthContainer = document.getElementById('month' + month); 
        const daysContainer = document.createElement('div');
        monthContainer.appendChild(daysContainer);

        let firstDay = new Date(year, month, 1).getDay();
        firstDay = firstDay === 0 ? 7 : firstDay; // Adjust for Sunday

        // Add the blank cells before the first day of the month
        for (let k = 0; k < firstDay - 1; k++) {
            const blankCell = document.createElement('div');
            blankCell.className = 'day-cell blank';
            daysContainer.appendChild(blankCell);
        }

        // Number of days in the current month
        const daysInMonthCount = getDaysInMonth(month, year);

        // Add the actual days of the month
        for (let day = 1; day <= daysInMonthCount; day++) {
            const dayCell = createDayCell(day, firstDay, year, month, currentDate);
            daysContainer.appendChild(dayCell);
        }

        month++;
        if (month === 12) {
            month = 0;
            year++;
        }
    }
}

/**
 * Creates and returns a day cell element.
 * @param {number} day - The day number.
 * @param {number} firstDay - The first day of the month (0 = Sunday, 6 = Saturday).
 * @param {number} year - The current year.
 * @param {number} month - The current month.
 * @param {Date} currentDate - The current date (with no time component).
 * @returns {HTMLElement} - The created day cell.
 */
export function createDayCell(day, firstDay, year, month, currentDate) {
    const dayCell = document.createElement('div');
    dayCell.className = 'day-cell';
    dayCell.textContent = day;

    // Add the data-date attribute here
    const formattedDate = `${year}${String(month + 1).padStart(2, '0')}${String(day).padStart(2, '0')}`;
    dayCell.setAttribute('data-date', formattedDate);

    // Adjust firstDay to be from 1 (Monday) to 7 (Sunday)
    firstDay = firstDay === 0 ? 7 : firstDay;

    const dayOfWeek = (day + firstDay - 2) % 7 + 1;
    const isWeekend = dayOfWeek === 6 || dayOfWeek === 7;
    const isToday = (year === currentDate.getFullYear()) && (month === currentDate.getMonth()) && (day === currentDate.getDate());
    const isPast = (year < currentDate.getFullYear()) || (year === currentDate.getFullYear() && month < currentDate.getMonth()) || (year === currentDate.getFullYear() && month === currentDate.getMonth() && day < currentDate.getDate());

    if (isPast && isWeekend) {
        dayCell.classList.add('past-weekend');
    } else if (isPast) {
        dayCell.classList.add('past');
    } else if (isWeekend) {
        dayCell.classList.add('weekend');
    }

    if (isToday) {
        dayCell.classList.add('today');
    }

    return dayCell;
}

/**
 * Gets the number of days in a given month for a specific year.
 * 
 * @param {number} month - The month for which the number of days is required. (0-based: 0 = January, 11 = December)
 * @param {number} year - The year for the specified month.
 * @returns {number} - The number of days in the specified month for the given year.
 */
export function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}

/**
 * Checks if a given year is a leap year.
 * @param {number} year - The year to check.
 * @returns {boolean} - True if it's a leap year, false otherwise.
 */
export function isLeapYear(year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}


