const form = document.getElementById('personality-test');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', function (event) {
	event.preventDefault();
	const q1 = document.querySelector('input[name="q1"]:checked').value;
	const q2 = document.querySelector('input[name="q2"]:checked').value;
    const q3 = document.querySelector('input[name="q3"]:checked').value;
	// Add more variables to capture additional questions as needed

	// Calculate the personality type based on the user's answers
	// Replace this code with your own logic to calculate the personality type
	let result;
	if (q1 === 'yes' && q2 === 'yes' && q3 === 'yes') {
		result = 'Introvert 😶 ';
	} else if (q1 === 'no' && q2 === 'no' && q3 === 'no') {
		result = 'Extrovert 🫠 ';
	} else {
		result = 'Ambivert ✨ ';
	}

	// Display the resulting personality type in the page
	resultDiv.textContent = `Your personality type is ${result}.`;
});
