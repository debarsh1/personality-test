const form = document.getElementById('personality-test');
const resultDiv = document.getElementById('result');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const resetBtn = document.getElementById('reset-btn');
const themeToggleBtn = document.getElementById('theme-toggle');

const QUESTION_NAMES = ['q1', 'q2', 'q3'];

function getAnsweredCount() {
	let answered = 0;
	for (const name of QUESTION_NAMES) {
		const checked = document.querySelector(`input[name="${name}"]:checked`);
		if (checked) answered += 1;
	}
	return answered;
}

function updateProgress() {
	const answered = getAnsweredCount();
	const total = QUESTION_NAMES.length;
	const pct = Math.round((answered / total) * 100);
	if (progressBar) progressBar.style.width = `${pct}%`;
	if (progressText) progressText.textContent = `Progress: ${answered}/${total} answered`;
}

function clearErrors() {
	document.querySelectorAll('fieldset.error').forEach(fs => fs.classList.remove('error'));
}

function validateAndFocusFirstUnanswered() {
	clearErrors();
	for (const name of QUESTION_NAMES) {
		const fieldset = document.querySelector(`input[name="${name}"]`)?.closest('fieldset');
		const checked = document.querySelector(`input[name="${name}"]:checked`);
		if (!checked && fieldset) {
			fieldset.classList.add('error');
			fieldset.scrollIntoView({ behavior: 'smooth', block: 'center' });
			return false;
		}
	}
	return true;
}

document.addEventListener('change', (e) => {
	if (e.target && e.target.matches('input[type="radio"]')) {
		updateProgress();
		const fieldset = e.target.closest('fieldset');
		if (fieldset) fieldset.classList.remove('error');
	}
});

form.addEventListener('submit', function (event) {
	event.preventDefault();
	if (!validateAndFocusFirstUnanswered()) return;
	const q1 = document.querySelector('input[name="q1"]:checked').value;
	const q2 = document.querySelector('input[name="q2"]:checked').value;
	const q3 = document.querySelector('input[name="q3"]:checked').value;

	// Calculate the personality type based on the user's answers
	let result;
	if (q1 === 'yes' && q2 === 'yes' && q3 === 'yes') {
		result = 'Introvert 😶 ';
	} else if (q1 === 'no' && q2 === 'no' && q3 === 'no') {
		result = 'Extrovert 🫠 ';
	} else {
		result = 'Ambivert ✨ ';
	}

	// Display the resulting personality type in the page with a simple animation
	resultDiv.style.opacity = '0';
	resultDiv.textContent = `Your personality type is ${result}.`;
	requestAnimationFrame(() => {
		resultDiv.style.transition = 'opacity 300ms ease';
		resultDiv.style.opacity = '1';
	});

	saveAnswers();
});

// Reset handler
if (resetBtn) {
	resetBtn.addEventListener('click', () => {
		form.reset();
		clearErrors();
		resultDiv.textContent = '';
		localStorage.removeItem(ANSWERS_STORAGE_KEY);
		updateProgress();
	});
}

// Theme toggle with persistence
const THEME_STORAGE_KEY = 'site-theme';
function applyTheme(theme) {
	if (theme === 'dark') {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
	updateThemeToggleA11y();
}

function loadTheme() {
	const saved = localStorage.getItem(THEME_STORAGE_KEY);
	if (saved) applyTheme(saved);
}

if (themeToggleBtn) {
	themeToggleBtn.addEventListener('click', () => {
		const isDark = document.body.classList.toggle('dark');
		localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
		updateThemeToggleA11y();
	});
}

// Persist answers and restore on load
const ANSWERS_STORAGE_KEY = 'personality-answers';
function saveAnswers() {
	const answers = {};
	for (const name of QUESTION_NAMES) {
		const checked = document.querySelector(`input[name="${name}"]:checked`);
		answers[name] = checked ? checked.value : null;
	}
	localStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(answers));
}

function restoreAnswers() {
	try {
		const raw = localStorage.getItem(ANSWERS_STORAGE_KEY);
		if (!raw) return;
		const answers = JSON.parse(raw);
		for (const name of QUESTION_NAMES) {
			const value = answers?.[name];
			if (value) {
				const input = document.querySelector(`input[name="${name}"][value="${value}"]`);
				if (input) input.checked = true;
			}
		}
	} finally {
		updateProgress();
	}
}

document.addEventListener('change', (e) => {
	if (e.target && e.target.matches('input[type="radio"]')) {
		saveAnswers();
	}
});

// Init
loadTheme();
restoreAnswers();
updateProgress();

function updateThemeToggleA11y() {
	if (!themeToggleBtn) return;
	const isDark = document.body.classList.contains('dark');
	const label = isDark ? 'Switch to day mode' : 'Switch to night mode';
	themeToggleBtn.setAttribute('aria-label', label);
	themeToggleBtn.setAttribute('title', label);
}

// Ensure initial a11y label matches theme on first paint
updateThemeToggleA11y();
