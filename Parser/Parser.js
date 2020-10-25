const fs = require('fs');
const file = process.argv[2];

const parseData = (err, data) => {
	if(err) {
		console.error(err);
		return;
	}
	//I'm assuming that the customer number is always 7 digits and the account number is always 8
	const accountNumberRegex = /[0-9]{7} - [0-9]{8}/;

	//the bill doesn't have every case of what month names will look like so I'm assuming 3-4 characters
	//even though all of the months on the current bill have 3 letters
	//I'm also assuming that the year will always be 4 digits
	const billPeriodRegex = /[A-Z][a-z]{2,3} [0-9]{2}, [0-9]{4} to [A-Z][a-z]{2,3} [0-9]{2}, [0-9]{4}/;

	//assuming bill number is always 8 digits
	const billNumberRegex = /Bill number: [0-9]{8}/;

	const billDateRegex = /Bill date: [A-Z][a-z]{2,3} [0-9]{2}, [0-9]{4}/;

	const totalNewChargesRegex = /Total new charges \s+\$([0-9]{1,3})+(,[0-9]{3})*.[0-9]{2}/;

	const customerAccountNumber = data.match(accountNumberRegex)[0];
	console.log(customerAccountNumber);

	const billPeriod = data.match(billPeriodRegex)[0];
	console.log(billPeriod);

	const billNumber = data.match(billNumberRegex)[0]
		.match(/[0-9]{8}/)[0];
	console.log(billNumber);

	const billDate = data.match(billDateRegex)[0]
		.match(/[A-Z][a-z]{2,3} [0-9]{2}, [0-9]{4}/)[0];
	console.log(billDate);

	const totalNewCharges = data.match(totalNewChargesRegex)[0]
		.match(/\$([0-9]{1,3})+(,[0-9]{3})*.[0-9]{2}/)[0];

	console.log(totalNewCharges);
}

fs.readFile(file, 'utf8', parseData);

