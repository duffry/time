/** Map of shorthand character keys to their corresponding colors. */
export const colorMap = {
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

