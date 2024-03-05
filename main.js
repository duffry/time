import { formatTime, formatDate } from './date-time-formatting.js';
import { updateURL } from './url-params.js';
import { generateCalendarGrid, populateCalendarWithDates } from './calendar-display.js';
import { applySpecialDates, colorMap } from './special-dates.js';

function main() {
	updateDateTime();
	generateCalendarGrid();
	populateCalendarWithDates();
	applySpecialDates();
}

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const paletteContainer = document.getElementById('color-palette');

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