const options = [1, 3, 5, 11, 23, 'Super Spin', 'Diamond'];
const superSpinOptions = [20, 50, 100];
const colors = ['#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c', '#e67e22']; // Colors for each slice
let isSuperSpin = false;
let currentRotation = 0;
let selectedBet = 0;
let selectedNumber = null;

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const resultDisplay = document.getElementById('result');
const spinButton = document.getElementById('spinButton');
const selectedBetDisplay = document.getElementById('selectedBet');
const selectedNumberDisplay = document.getElementById('selectedNumber');
const betButtons = document.querySelectorAll('.betButton');
const numberButtonsContainer = document.getElementById('numberButtons');
const radius = canvas.width / 2;
const sliceAngle = (2 * Math.PI) / options.length;

// Draw the wheel and number buttons
function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.translate(radius, radius); // Move origin to center of canvas
    
    for (let i = 0; i < options.length; i++) {
        const angle = i * sliceAngle;

        // Draw the slice
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, angle, angle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length]; // Alternate colors
        ctx.fill();
        ctx.stroke();

        // Draw the text
        ctx.save();
        ctx.rotate(angle + sliceAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = "16px Arial";
        ctx.fillText(options[i], radius - 10, 10);
        ctx.restore();
    }

    ctx.translate(-radius, -radius); // Restore the original canvas coordinate system
}

function createNumberButtons() {
    numberButtonsContainer.innerHTML = ''; // Clear existing buttons
    options.forEach(option => {
        if (typeof option === 'number') {
            const button = document.createElement('button');
            button.className = 'numberButton';
            button.textContent = option;
            button.setAttribute('data-number', option);
            button.addEventListener('click', () => {
                selectedNumber = option;
                selectedNumberDisplay.innerText = `Selected Number: ${selectedNumber}`;
            });
            numberButtonsContainer.appendChild(button);
        }
    });
}

function spinWheel() {
    if (selectedBet === 0) {
        resultDisplay.innerText = 'Please select a bet before spinning.';
        return;
    }
    if (selectedNumber === null) {
        resultDisplay.innerText = 'Please select a number to bet on.';
        return;
    }
    
    const spinAmount = Math.random() * 360 + 3600; // Random spin amount between 3600 and 7200 degrees
    const spinDuration = 3000; // Duration of the spin animation in milliseconds

    canvas.style.transition = `transform ${spinDuration}ms ease-out`;
    canvas.style.transform = `rotate(${spinAmount + currentRotation}deg)`;

    setTimeout(() => {
        currentRotation = (currentRotation + spinAmount) % 360;
        const selectedOption = Math.floor(((currentRotation % 360) / 360) * options.length);
        displayResult(selectedOption);
    }, spinDuration); // Wait for the duration of the spin to show the result
}

function displayResult(selectedOption) {
    const selectedValue = options[selectedOption];
    if (selectedValue === 'Super Spin') {
        isSuperSpin = true;
        resultDisplay.innerText = 'Super Spin! Spinning again...';
        setTimeout(superSpin, 2000);
    } else if (selectedValue === 'Diamond') {
        resultDisplay.innerText = `Diamond! You win ${45 * selectedBet}x your bet!`;
    } else {
        const winAmount = selectedNumber === selectedValue ? selectedBet * selectedValue : 0;
        resultDisplay.innerText = `You landed on ${selectedValue}! ${winAmount > 0 ? `You win $${winAmount}!` : 'No win.'}`;
    }
}

function superSpin() {
    const superSpinResult = superSpinOptions[Math.floor(Math.random() * superSpinOptions.length)];
    resultDisplay.innerText = `Super Spin result: You win ${superSpinResult * selectedBet}x your bet!`;
}

// Event listeners
spinButton.addEventListener('click', spinWheel);
betButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        selectedBet = parseInt(e.target.getAttribute('data-bet'));
        selectedBetDisplay.innerText = `Selected Bet: $${selectedBet}`;
    });
});

createNumberButtons(); // Create number buttons
drawWheel(); // Initial draw
