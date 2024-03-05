/**
 * Formats a given date object into a time string in the format: HH:MM:SS.
 *
 * @param {Date} date - The date object to be formatted.
 * @return {string} - The formatted time string.
 */
export function formatTime(date) {
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
export function formatDate(date) {
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
export function formatShortDate(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let day = days[date.getDay()];
    let dateNum = date.getDate();
    let month = months[date.getMonth()];

    return `${day} ${dateNum} ${month}`;
}
