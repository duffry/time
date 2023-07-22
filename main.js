function main() {
	updateDateTime();
	generateCalendarGrid();
	populateCalendarWithDates();
	applySpecialDates();
}


/**
 * Formats a given date object into a time string in the format: HH:MM:SS.
 *
 * @param {Date} date - The date object to be formatted.
 * @return {string} - The formatted time string.
 */
function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return `${hours}:${minutes}:${seconds}`;
}

/**
 * Formats a given date object into a full date string: Day DD Month YYYY.
 *
 * @param {Date} date - The date object to be formatted.
 * @return {string} - The formatted date string.
 */
function formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let day = days[date.getDay()];
    let dateNum = date.getDate();
    let month = months[date.getMonth()];
    let year = date.getFullYear();

    return `${day} ${dateNum} ${month} ${year}`;
}

/**
 * Formats a given date object into a short date string: DDD DD MMM.
 *
 * @param {Date} date - The date object to be formatted.
 * @return {string} - The formatted short date string.
 */
function formatShortDate(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let day = days[date.getDay()];
    let dateNum = date.getDate();
    let month = months[date.getMonth()];

    return `${day} ${dateNum} ${month}`;
}

/**
 * Parses the URL's query parameters. If a parameter has a date range (YYYYMMDD-YYYYMMDD), 
 * it breaks this range down into a list of individual dates. It then returns an object 
 * with these parsed parameters.
 *
 * @return {Object} An object containing parsed parameters.
 */
function getUrlParams() {
    let params = {};
    window.location.search.substring(1).split('&').forEach(pair => {
        let [key, value] = pair.split('=');

        // Check for 'start' parameter and handle it separately
        if (key === 'start' && value) {
            params[key] = decodeURIComponent(value);
        }
        // Handle date range parameters
        else if (value && value.includes('-')) { 
            let [startDate, endDate] = value.split('-');
            let currentDate = new Date(startDate.slice(0, 4), startDate.slice(4, 6) - 1, startDate.slice(6, 8));
            let end = new Date(endDate.slice(0, 4), endDate.slice(4, 6) - 1, endDate.slice(6, 8));

            while (currentDate <= end) {
                if (!params[key]) {
                    params[key] = [];
                }
                params[key].push(currentDate.toISOString().slice(0, 10).replace(/-/g, '')); 
                currentDate.setDate(currentDate.getDate() + 1);
            }
        } 
        // Handle other general parameters
        else if (value) {
            if (!params[key]) {
                params[key] = [];
            }
            params[key].push(decodeURIComponent(value));
        }
    });
    return params;
}

/**
 * Fetches the start date specified in the URL. If not present, 
 * it defaults to the month three months before the current month.
 * Now accepts dates in YYYYMM and YYYYMMDD format.
 * 
 * @returns {Date} - The specified start date or a default date.
 */
function getStartDateFromUrl() {
    let params = getUrlParams();
    
    // If 'start' is specified in the URL
    if (params.start) {
        let year, month, day = 1; // Default day to the 1st

        if (params.start.length === 6) {
            year = parseInt(params.start.slice(0, 4));
            month = parseInt(params.start.slice(4, 6)) - 1; // months are 0-indexed
        } else if (params.start.length === 8) {
            year = parseInt(params.start.slice(0, 4));
            month = parseInt(params.start.slice(4, 6)) - 1;
            day = parseInt(params.start.slice(6, 8));
        } else {
            console.error("Invalid date format in URL parameter. Expected YYYYMM or YYYYMMDD.");
            return getDefaultStartDate();
        }

        return new Date(year, month, day);
    }

    return getDefaultStartDate();
}

function getDefaultStartDate() {
    // Default to the month three months before the current month
    let currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 3);
    currentDate.setDate(1); // Ensure it starts on the first day of the month
    return currentDate;
}



/** Map of shorthand character keys to their corresponding colors. */
const colorMap = {
    'r': '#A0524D', // Red
    'g': '#608B4E', // Green
    'b': '#5C7295', // Blue
    'p': '#7D6C8C', // Purple
    'y': '#C0B43E', // Yellow
    'o': '#D79C4F', // Orange
    't': '#3B7F83', // Teal
    'm': '#9F5A4F', // Mud
};

/**
 * Uses the colorMap and the parameters from the URL to apply specific color stylings 
 * to elements on the page that match the date criteria.
 */
function applySpecialDates() {
    let params = getUrlParams();
    Object.keys(colorMap).forEach(colorKey => {
        if (params[colorKey]) {
            params[colorKey].forEach(dateString => {
                let [year, month, day] = [dateString.slice(0, 4), dateString.slice(4, 6) - 1, dateString.slice(6, 8)];
                let cell = document.querySelector(`#month${month} .day-cell:nth-child(${parseInt(day) + new Date(year, month, 1).getDay() - 1})`);
                if (cell) {
                    cell.style.backgroundColor = colorMap[colorKey];
                    cell.style.color = '#fff'; 
                }
            });
        }
    });
}


/**
 * Updates the date and time displayed on the page and in the title bar.
 * The title bar displays the format: HH:MM DDD D MMM.
 * The page body displays the full time and date using helper functions.
 */
function updateDateTime() {
    let now = new Date();
    let time = formatTime(now);  // formatTime is a helper function that formats the time.
    let date = formatDate(now);  // formatDate is a helper function that formats the date.

    // Update the content of the 'time' and 'date' elements.
    document.getElementById('time').textContent = time;
    document.getElementById('date').textContent = date;

    // Update the title with the desired format: HH:MM DDD D MMM
    let hours = String(now.getHours()).padStart(2, '0');
    let minutes = String(now.getMinutes()).padStart(2, '0');
    let dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];
    let dayOfMonth = now.getDate();
    let monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][now.getMonth()];
    document.title = `${hours}:${minutes} ${dayName} ${dayOfMonth} ${monthName}`;
}
/**
 * Generates a calendar grid, starting 3 months ago and spanning 12 months in total.
 */
function generateCalendarGrid() {
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
 * Checks if a given year is a leap year.
 * @param {number} year - The year to check.
 * @returns {boolean} - True if it's a leap year, false otherwise.
 */
function isLeapYear(year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
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
function createDayCell(day, firstDay, year, month, currentDate) {
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
function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}


/**
 * Populates the previously generated calendar with the appropriate days for each month.
 */
function populateCalendarWithDates() {
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


// Just a reminder to also have your monthNames array somewhere accessible:
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


/**
 * Parses a date string in various formats (YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY, MM-DD-YYYY) 
 * into a Date object.
 *
 * @param {string} dateStr - The string representation of the date to be parsed.
 * @return {Date|null} - Returns the Date object or null if parsing fails.
 */
function parseDate(dateStr) {
    const patterns = [
        /^(\d{4})-(\d{2})-(\d{2})$/, 
        /^(\d{2})\/(\d{2})\/(\d{4})$/, 
        /^(\d{2})-(\d{2})-(\d{4})$/, 
        /^(\d{2})-(\d{2})-(\d{4})$/ 
    ];

    for (let pattern of patterns) {
        const match = dateStr.match(pattern);
        if (match) {
            if (pattern === /^(\d{2})\/(\d{2})\/(\d{4})$/) {
                return new Date(match[3], match[2] - 1, match[1]);
            } else if (pattern === /^(\d{2})-(\d{2})-(\d{4})$/) {
                return new Date(match[3], match[2] - 1, match[1]);
            } else {
                const dateObj = new Date(dateStr);
                if (!isNaN(dateObj)) {
                    return dateObj;
                }
            }
        }
    }
    return null;
}


const paletteContainer = document.getElementById('color-palette');

// Loop through each color in the colorMap
for (let colorKey in colorMap) {
    const colorBlock = document.createElement('div');
    colorBlock.className = 'color-block';
    colorBlock.style.backgroundColor = colorMap[colorKey];
    colorBlock.dataset.color = colorKey; // Store the color key in a data attribute
    paletteContainer.appendChild(colorBlock);
}

// Add a special block for removal of custom highlighting
const removeBlock = document.createElement('div');
removeBlock.className = 'color-block remove-highlight';
paletteContainer.appendChild(removeBlock);

let selectedColor = null; // This variable will store the currently selected color

// Add event listener to each color block
const colorBlocks = document.querySelectorAll('.color-block:not(.remove-highlight)'); // Select all color blocks except the remove-highlight block

colorBlocks.forEach(block => {
    block.addEventListener('click', function() {
        // Remove the 'selected' class from previously selected block
        colorBlocks.forEach(b => b.classList.remove('selected'));
        
        // Remove the 'selected' class from the remove-highlight block
        removeHighlightBlock.classList.remove('selected');

        // Add the 'selected' class to the clicked block
        block.classList.add('selected');

        // Store the selected color
        selectedColor = block.dataset.color; // Recall that we stored the color key in a data attribute
    });
});


// Add event listener to the remove-highlight block
const removeHighlightBlock = document.querySelector('.color-block.remove-highlight');
removeHighlightBlock.addEventListener('click', function() {
    // Remove the 'selected' class from previously selected block
    colorBlocks.forEach(b => b.classList.remove('selected'));

    // Add the 'selected' class to the remove-highlight block
    removeHighlightBlock.classList.add('selected');

    // Reset the selected color
    selectedColor = null;
});

// Add event listener to the remove-highlight block
document.querySelector('.color-block.remove-highlight').addEventListener('click', function() {
    // Remove the 'selected' class from previously selected block
    colorBlocks.forEach(b => b.classList.remove('selected'));

    // Reset the selected color
    selectedColor = null;
});

function updateURL(date, colorKey) {
    const currentURL = new URL(window.location.href);
    
    // If a color key is selected (i.e., not remove-highlight)
    if (colorKey && colorKey !== 'remove-highlight') {
        // Remove any existing color for this date
        for (const key in colorMap) {
            if (currentURL.searchParams.getAll(key).includes(date)) {
                const datesForColor = currentURL.searchParams.getAll(key).filter(d => d !== date);
                currentURL.searchParams.delete(key);
                datesForColor.forEach(d => currentURL.searchParams.append(key, d));
            }
        }
        // Add the new color for this date
        currentURL.searchParams.append(colorKey, date);
    } else {
        // If remove-highlight is selected or no color key
        // search for and remove the date from all color parameters
        for (const key in colorMap) {
            if (currentURL.searchParams.getAll(key).includes(date)) {
                const datesForColor = currentURL.searchParams.getAll(key).filter(d => d !== date);
                currentURL.searchParams.delete(key);
                datesForColor.forEach(d => currentURL.searchParams.append(key, d));
                break;
            }
        }
    }

    // Update the URL without refreshing the page
    history.pushState({}, "", currentURL.toString());
}



document.addEventListener("DOMContentLoaded", function() {
    // Call the main function once the DOM is fully loaded
    main();

    // Start the interval to update the date and time
    setInterval(updateDateTime, 1000);

    const calendarCells = document.querySelectorAll('.day-cell');

    console.log(`Found ${calendarCells.length} calendar cells.`);  // Log the number of calendar cells found.
    if (calendarCells.length === 0) {
        console.warn("The calendar cells are not generated yet. Ensure the main() function runs before this script.");
    }
    
    calendarCells.forEach(cell => {
        cell.addEventListener('click', function() {
            console.log(`Calendar cell clicked. Selected color: ${selectedColor}`);  // Log when a cell is clicked and the current selected color.
    
            if (selectedColor) {
                // Set the background color of the cell to the selected color
                cell.style.backgroundColor = colorMap[selectedColor];
            } else {
                // Reset the cell's background color to its default
                cell.style.backgroundColor = ''; 
            }

            const cellDate = cell.getAttribute('data-date');
            console.log("Clicked on cell with date:", cellDate);  // Log the date of the clicked cell
            console.log("Selected color:", selectedColor);  // Log the current selected color
            updateURL(cellDate, selectedColor);
        });
    });

    document.getElementById('clearHighlights').addEventListener('click', function() {
        // Clear all custom highlights from the calendar
        const calendarCells = document.querySelectorAll('.day-cell');
        calendarCells.forEach(cell => {
            cell.removeAttribute('style'); // Remove any inline styles set by JavaScript
        });
    
        // Reset the URL
        const currentURL = new URL(window.location.href);
        for (const key in colorMap) {
            currentURL.searchParams.delete(key);
        }
        history.pushState({}, "", currentURL.toString());
    });
    
});

// EOF