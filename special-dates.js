import { getUrlParams } from './url-params.js';

/** Map of shorthand character keys to their corresponding colors. */
export const colorMap = {
    'r': '#800020',  // Red
    'a': '#708090',  // Gray
    'g': '#608B4E',  // Green
    'm': '#8D5A2F',  // Mud
    'o': '#eea000',  // Orange
    'd': '#efca00',  // Gold
    'k': '#ea6ec8',  // Pink
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

