import { colorMap } from './special-dates.js';

/**
 * Parses the URL's query parameters. If a parameter has a date range (YYYYMMDD-YYYYMMDD), 
 * it breaks this range down into a list of individual dates. It then returns an object 
 * with these parsed parameters.
 *
 * @return {Object} An object containing parsed parameters.
 */

export function getUrlParams() {
    let params = {};
    window.location.search.substring(1).split('&').forEach(pair => {
        let [key, value] = pair.split('=');
        value = decodeURIComponent(value);

        // Handling color key parameters (e.g., "kr=Dom")
        if (key.startsWith('k') && key.length === 2) {
            const color = key[1]; // Extract color letter (e.g., 'r' from 'kr')
            if (!params.keys) params.keys = {};
            params.keys[color] = value; // Assigning key value to color
        }
        // Handling start parameter and date range parameters
        else if (key === 'start' && value) {
            params[key] = value;
        } else if (value && value.includes('-')) {
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
        } else if (value) {
            if (!params[key]) {
                params[key] = [];
            }
            params[key].push(value);
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
export function getStartDateFromUrl() {
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

export function getDefaultStartDate() {
    // Default to the month three months before the current month
    let currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 3);
    currentDate.setDate(1); // Ensure it starts on the first day of the month
    return currentDate;
}

export function updateURL(date, colorKey) {
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

    // Update color key descriptions
    if (keyText !== null) {
        // Assuming keyText is provided to associate with a color
        const keyParam = `k${colorKey}`; // Constructing key parameter name (e.g., "kr")
        if (keyText) { // If keyText is not empty, update or add the key
            currentURL.searchParams.set(keyParam, keyText);
        } else { // If keyText is empty, remove the key
            currentURL.searchParams.delete(keyParam);
        }
    }

    // Update the URL without refreshing the page
    history.pushState({}, "", currentURL.toString());
}