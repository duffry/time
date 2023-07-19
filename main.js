function main() {
	updateDateTime();
	generateCalendarGrid();
	populateCalendarWithDates();
	applySpecialDates();
}


function formatTime(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();

	hours = hours < 10 ? '0' + hours : hours;
	minutes = minutes < 10 ? '0' + minutes : minutes;
	seconds = seconds < 10 ? '0' + seconds : seconds;

	return hours + ':' + minutes + ':' + seconds;
}

function formatDate(date) {
	var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	var day = days[date.getDay()];
	var dateNum = date.getDate();
	var month = months[date.getMonth()];
	var year = date.getFullYear();

	return day + ' ' + dateNum + ' ' + month + ' ' + year;
}

function formatShortDate(date) {
	var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	var day = days[date.getDay()];
	var dateNum = date.getDate();
	var month = months[date.getMonth()];

	return day + ' ' + dateNum + ' ' + month;
}

function getUrlParams() {
	var params = {};
	window.location.search.substring(1).split('&').forEach(function(pair) {
		var [key, value] = pair.split('=');
		if (value && value.includes('-')) { // If it's a range
			var [startDate, endDate] = value.split('-');
			var currentDate = new Date(startDate.slice(0, 4), startDate.slice(4, 6) - 1, startDate.slice(6, 8));
			var end = new Date(endDate.slice(0, 4), endDate.slice(4, 6) - 1, endDate.slice(6, 8));

			while (currentDate <= end) {
				if (!params[key]) {
					params[key] = [];
				}
				params[key].push(currentDate.toISOString().slice(0, 10).replace(/-/g, '')); // Adding each date of the range to the params
				currentDate.setDate(currentDate.getDate() + 1); // Move to the next date
			}
		} else if (value) {
			if (!params[key]) {
				params[key] = [];
			}
			params[key].push(decodeURIComponent(value));
		}
	});
	return params;
}

var colorMap = {
	'r': '#A0524D',
	'g': '#608B4E',
	'b': '#5C7295',
	'p': '#7D6C8C'
};

function applySpecialDates() {
	var params = getUrlParams();
	Object.keys(colorMap).forEach(colorKey => {
		if (params[colorKey]) {
			params[colorKey].forEach(dateString => {
				var [year, month, day] = [dateString.slice(0, 4), dateString.slice(4, 6) - 1, dateString.slice(6, 8)];
				var cell = document.querySelector(`#month${month} .day-cell:nth-child(${parseInt(day) + new Date(year, month, 1).getDay() - 1})`);
				if (cell) {
					cell.style.backgroundColor = colorMap[colorKey];
					cell.style.color = '#fff'; // Set text color to white for better visibility
				}
			});
		}
	});
}


function updateDateTime() {
	var now = new Date();
	var time = formatTime(now);  // formatTime is a helper function that formats the time.
	var date = formatDate(now);  // formatDate is a helper function that formats the date.

	// These lines update the content of the 'time' and 'date' elements instead of the 'dateTime' element.
	document.getElementById('time').textContent = time;
	document.getElementById('date').textContent = date;

	// The title is formatted with another helper function, formatShortDate.
	document.title = time + ' ' + formatShortDate(now);
}

setInterval(updateDateTime, 1000);

function generateCalendarGrid() {
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	var calendarContainer = document.getElementById('calendar');
	var currentDate = new Date();
	var currentYear = currentDate.getFullYear();
	var currentMonth = currentDate.getMonth();

	for (var i = 0; i < 12; i++) { // Create 12 month containers
		var month = (currentMonth + i + 12 - 3) % 12; // Start from 3 months ago
		var year = currentYear + Math.floor((currentMonth + i + 12 - 3) / 12);

		var monthContainer = document.createElement('div');
		monthContainer.id = 'month' + month; // Create ids based on actual month number
		monthContainer.className = 'month-grid';
		monthContainer.innerHTML = '<h3>' + months[month] + ' ' + year + '</h3>';

		calendarContainer.appendChild(monthContainer);
	}
}

function populateCalendarWithDates() {
	var currentDate = new Date();
	var currentYear = currentDate.getFullYear();
	var currentMonth = currentDate.getMonth();
	var currentDay = currentDate.getDate();

	// Leap year check
	var isLeapYear = ((currentYear % 4 === 0) && (currentYear % 100 !== 0)) || (currentYear % 400 === 0);

	// The number of days in each month. February is adjusted for leap years.
	var daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	for (var i = 0; i < 12; i++) { // For each month
		var month = (currentMonth + i + 12 - 3) % 12; // Start from 3 months ago
		var year = currentYear + Math.floor((currentMonth + i + 12 - 3) / 12) - 1;
		isLeapYear = ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
		daysInMonth[1] = isLeapYear ? 29 : 28; // Update February's days for leap years
		
		var monthContainer = document.getElementById('month' + month); // Use month index directly
		var daysContainer = document.createElement('div');
		monthContainer.appendChild(daysContainer);
		var firstDay = new Date(year, month, 1).getDay();

		// The Date object in JavaScript counts days of the week from 0 (Sunday) to 6 (Saturday)
		// Adjust it to be from 1 (Monday) to 7 (Sunday)
		firstDay = firstDay === 0 ? 7 : firstDay;

		for (var j = 0; j < daysInMonth[month]; j++) { // For each day
			var dayCell = document.createElement('div');
			dayCell.className = 'day-cell';
			dayCell.textContent = j + 1; // +1 because days are 1-indexed

			var isWeekend = ((j + firstDay - 1) % 7 === 5) || ((j + firstDay - 1) % 7 === 6);
			var isToday = (year === currentDate.getFullYear()) && (month === currentDate.getMonth()) && (j === currentDate.getDate() - 1);
			var isPast = (year < currentDate.getFullYear()) || (year === currentDate.getFullYear() && month < currentDate.getMonth()) || (year === currentDate.getFullYear() && month === currentDate.getMonth() && j < currentDate.getDate());

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

			// Insert blank cells for the days before the first of the month
			if (j === 0) {
				for (var k = 1; k < firstDay; k++) {
					var blankCell = document.createElement('div');
					blankCell.className = 'day-cell';
					blankCell.textContent = '';
					daysContainer.appendChild(blankCell);
				}
			}

			daysContainer.appendChild(dayCell);
		}
	}
}

function parseDate(dateStr) {
	const patterns = [
		/^(\d{4})-(\d{2})-(\d{2})$/, // YYYY-MM-DD
		/^(\d{2})\/(\d{2})\/(\d{4})$/, // DD/MM/YYYY
		/^(\d{2})-(\d{2})-(\d{4})$/, // DD-MM-YYYY
		/^(\d{2})-(\d{2})-(\d{4})$/ // MM-DD-YYYY
	];

	for (let pattern of patterns) {
		const match = dateStr.match(pattern);
		if (match) {
			// Special handling for DD/MM/YYYY format to ensure accurate parsing
			if (pattern === /^(\d{2})\/(\d{2})\/(\d{4})$/) {
				return new Date(match[3], match[2] - 1, match[1]); // year, month (0-indexed), day
			} else if (pattern === /^(\d{2})-(\d{2})-(\d{4})$/) {
				return new Date(match[3], match[2] - 1, match[1]); // year, month (0-indexed), day
			} else {
				const dateObj = new Date(dateStr);
				if (!isNaN(dateObj)) {
					return dateObj;
				}
			}
		}
	}

	// Return null if date couldn't be parsed
	return null;
}

document.addEventListener("DOMContentLoaded", function() {
    // Call the main function once the DOM is fully loaded
    main();

    // Start the interval to update the date and time
    setInterval(updateDateTime, 1000);

    // ... any other code that needs the DOM to be loaded ...
});