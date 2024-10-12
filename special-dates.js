import { getUrlParams } from './url-params.js';

/** Map of shorthand character keys to their corresponding colors. */
export const colorMap = {
    'r': '#800020',  // Red
    'a': '#a49974',  // tAn
    'g': '#70a35b',  // Green
    'm': '#8D5A2F',  // Mud brown
    'o': '#eea000',  // Orange
    'd': '#efca00',  // golD
    'k': '#ea6ec8',  // pinK
    'p': '#7234aa',  // Purple
    'b': '#2a71e3',  // Blue
    't': '#007c7c',  // Teal
};

/**
 * Uses the colorMap and the parameters from the URL to apply specific color stylings 
 * to elements on the page that match the date criteria.
 */
export function applySpecialDates() {
    let params = getUrlParams();
    console.log(`params: ${params}`);
    Object.keys(colorMap).forEach(colorKey => {
        if (params[colorKey]) {
            console.log(`params[colorKey]: ${params[colorKey]}`);
            params[colorKey].forEach(dateString => {
                let year = parseInt(dateString.slice(0, 4));
                let month = parseInt(dateString.slice(4, 6)) - 1; // Convert to zero-indexed
                let day = parseInt(dateString.slice(6, 8));
                console.log(`year: ${year}, month: ${month}, day: ${day}`);
                
                // Adjust cell selection logic
                let firstDayOfMonth = new Date(year, month, 1).getDay();
                firstDayOfMonth = firstDayOfMonth === 0 ? 7 : firstDayOfMonth; // Adjust for Sunday as 7
                let cellIndex = day + firstDayOfMonth - 1;
                
                // Update selector to ensure proper month identification
                let cell = document.querySelector(`#month${month} .day-cell:nth-child(${cellIndex})`);
                
                if (cell) {
                    cell.style.backgroundColor = colorMap[colorKey];
                    cell.style.color = '#fff'; 
                }
            });
        }
    });
}
