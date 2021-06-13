var time = {}; // format: HHMM, type: Integer, Eg 10 am -> 1000, 1:45 pm -> 0145

time.validate = function(value) {
	return (
		parseInt(value) == value)
		&& value >= 0
		&& value <= 2400
		&& (value % 100) < 60;
};

time.get = function(date) {
	date = new Date(date)
	return (date.getHours() * 100 + date.getMinutes());
}

let days = [
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday',
	'sunday'];

time.getDay = function(date) {
	x = new Date(date)
	return (days[x.getDay()]);
}

/*
var generatePassword = function(len) {
	len = (typeof(len) == 'number' && len > 4) ? len : 8;

	// Define all possible characters that could go into a string
	var possibleCharacters = 'qwertyuiopasdfghjklzxcvbnm1234567890!@#$%^&*';

	// start the final string
	var str = '';
	for (i = 1; i <= len; i++) {
			var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
			str += randomCharacter;
	}
	// return the final string
	return str;
}
*/
//module.exports = {time, generatePassword};

module.exports = time;

