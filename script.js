// Calculator Logic
class Calculator {
  constructor(previousOperandElement, currentOperandElement) {
    this.previousOperandElement = previousOperandElement;
    this.currentOperandElement = currentOperandElement;
    this.clear();
  }
  
  // Clear everything
  clear() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.shouldResetScreen = false;
    this.updateDisplay();
  }
  
  // Delete last character
  delete() {
    if (this.shouldResetScreen) {
      this.clear();
      return;
    }
    
    if (this.currentOperand.length === 1 || 
        (this.currentOperand.length === 2 && this.currentOperand.startsWith('-'))) {
      this.currentOperand = '0';
    } else {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }
    this.updateDisplay();
  }
  
  // Append number or decimal
  appendNumber(number) {
    if (this.shouldResetScreen) {
      this.currentOperand = '';
      this.shouldResetScreen = false;
    }
    
    // Prevent multiple decimals
    if (number === '.' && this.currentOperand.includes('.')) return;
    
    // Prevent leading zeros (except for decimal)
    if (this.currentOperand === '0' && number !== '.') {
      this.currentOperand = number.toString();
    } else {
      this.currentOperand += number.toString();
    }
    
    this.updateDisplay();
  }
  
  // Choose operation
  chooseOperation(operation) {
    if (this.currentOperand === '' && this.previousOperand === '') return;
    
    if (this.currentOperand === '' && this.previousOperand !== '') {
      this.operation = operation;
      this.updateDisplay();
      return;
    }
    
    if (this.previousOperand !== '') {
      this.compute();
    }
    
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
    this.shouldResetScreen = false;
    this.updateDisplay();
  }
  
  // Perform computation
  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '*':
        computation = prev * current;
        break;
      case '/':
        if (current === 0) {
          this.handleError("Can't divide by zero!");
          return;
        }
        computation = prev / current;
        break;
      case '%':
        computation = prev % current;
        break;
      default:
        return;
    }
    
    // Handle floating point precision
    computation = parseFloat(computation.toFixed(8));
    
    this.currentOperand = computation.toString();
    this.operation = undefined;
    this.previousOperand = '';
    this.shouldResetScreen = true;
    this.updateDisplay();
  }
  
  // Handle percentage calculation
  percentage() {
    if (this.currentOperand === '' || this.currentOperand === '0') return;
    
    let value = parseFloat(this.currentOperand);
    value = value / 100;
    this.currentOperand = value.toString();
    this.updateDisplay();
    this.shouldResetScreen = true;
  }
  
  // Handle error messages
  handleError(message) {
    this.currentOperand = 'Error';
    this.previousOperand = '';
    this.operation = undefined;
    this.updateDisplay();
    setTimeout(() => {
      this.clear();
    }, 1500);
  }
  
  // Update display
  updateDisplay() {
    // Format current operand
    let displayCurrent = this.currentOperand;
    if (displayCurrent !== 'Error' && !isNaN(displayCurrent) && displayCurrent.includes('.')) {
      // Limit decimal places for display only
      const parts = displayCurrent.split('.');
      if (parts[1] && parts[1].length > 8) {
        displayCurrent = parseFloat(displayCurrent).toFixed(8);
      }
    }
    
    this.currentOperandElement.textContent = displayCurrent;
    
    // Format previous operand with operation symbol
    if (this.operation != null) {
      let operationSymbol = this.operation;
      switch (this.operation) {
        case '*': operationSymbol = '×'; break;
        case '/': operationSymbol = '÷'; break;
        case '-': operationSymbol = '−'; break;
        default: break;
      }
      this.previousOperandElement.textContent = `${this.previousOperand} ${operationSymbol}`;
    } else {
      this.previousOperandElement.textContent = '';
    }
  }
}

// DOM Elements
const previousOperandElement = document.getElementById('previousOperand');
const currentOperandElement = document.getElementById('currentOperand');
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const clearButton = document.querySelector('[data-action="clear"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const equalsButton = document.querySelector('[data-action="equals"]');

// Initialize calculator
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Event Listeners for Numbers
numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    const number = button.getAttribute('data-number');
    calculator.appendNumber(number);
    addRippleEffect(button);
  });
});

// Event Listeners for Operators
operatorButtons.forEach(button => {
  button.addEventListener('click', () => {
    const operator = button.getAttribute('data-operator');
    if (operator === '%') {
      calculator.percentage();
    } else {
      calculator.chooseOperation(operator);
    }
    addRippleEffect(button);
  });
});

// Clear Button
clearButton.addEventListener('click', () => {
  calculator.clear();
  addRippleEffect(clearButton);
});

// Delete Button
deleteButton.addEventListener('click', () => {
  calculator.delete();
  addRippleEffect(deleteButton);
});

// Equals Button
equalsButton.addEventListener('click', () => {
  calculator.compute();
  addRippleEffect(equalsButton);
});

// Ripple effect function
function addRippleEffect(button) {
  button.style.transform = 'scale(0.95)';
  setTimeout(() => {
    button.style.transform = '';
  }, 100);
}

// 🎹 KEYBOARD SUPPORT (Bonus)
document.addEventListener('keydown', (event) => {
  const key = event.key;
  
  // Prevent default behavior for calculator keys
  const calculatorKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/', '%', 'Enter', '=', 'Backspace', 'Escape', 'Delete'];
  if (calculatorKeys.includes(key)) {
    event.preventDefault();
  }
  
  // Numbers 0-9
  if (/[0-9]/.test(key)) {
    calculator.appendNumber(key);
    highlightKey(key);
  }
  
  // Decimal point
  if (key === '.') {
    calculator.appendNumber('.');
    highlightKey('.');
  }
  
  // Operators
  if (key === '+') {
    calculator.chooseOperation('+');
    highlightKey('+');
  }
  if (key === '-') {
    calculator.chooseOperation('-');
    highlightKey('-');
  }
  if (key === '*') {
    calculator.chooseOperation('*');
    highlightKey('*');
  }
  if (key === '/') {
    calculator.chooseOperation('/');
    highlightKey('/');
  }
  if (key === '%') {
    calculator.percentage();
    highlightKey('%');
  }
  
  // Equals (Enter key or =)
  if (key === 'Enter' || key === '=') {
    calculator.compute();
    highlightKey('equals');
  }
  
  // Clear (Escape key)
  if (key === 'Escape') {
    calculator.clear();
    highlightKey('clear');
  }
  
  // Delete (Backspace)
  if (key === 'Backspace' || key === 'Delete') {
    calculator.delete();
    highlightKey('delete');
  }
});

// Visual feedback for keyboard presses
function highlightKey(keyValue) {
  let button;
  
  // Find the button that corresponds to the key press
  if (keyValue === 'equals' || keyValue === 'Enter') {
    button = document.querySelector('[data-action="equals"]');
  } else if (keyValue === 'clear' || keyValue === 'Escape') {
    button = document.querySelector('[data-action="clear"]');
  } else if (keyValue === 'delete' || keyValue === 'Backspace') {
    button = document.querySelector('[data-action="delete"]');
  } else if (keyValue === '.') {
    button = document.querySelector('[data-number="."]');
  } else if (/[0-9]/.test(keyValue)) {
    button = document.querySelector(`[data-number="${keyValue}"]`);
  } else if (keyValue === '+') {
    button = document.querySelector('[data-operator="+"]');
  } else if (keyValue === '-') {
    button = document.querySelector('[data-operator="-"]');
  } else if (keyValue === '*') {
    button = document.querySelector('[data-operator="*"]');
  } else if (keyValue === '/') {
    button = document.querySelector('[data-operator="/"]');
  } else if (keyValue === '%') {
    button = document.querySelector('[data-operator="%"]');
  }
  
  if (button) {
    button.style.transform = 'scale(0.95)';
    button.style.transition = 'transform 0.05s';
    setTimeout(() => {
      button.style.transform = '';
    }, 100);
  }
}

// Touch support for mobile devices
numberButtons.forEach(btn => {
  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    btn.click();
  });
});

operatorButtons.forEach(btn => {
  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    btn.click();
  });
});

// Prevent double-tap zoom on buttons
const allButtons = document.querySelectorAll('.btn');
allButtons.forEach(btn => {
  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    btn.click();
  });
});

// Handle edge cases and initial setup
window.addEventListener('load', () => {
  calculator.clear();
  console.log('Calculator ready! ⌨️ Keyboard support enabled');
  
  // Add dynamic floating icons
  createAdditionalIcons();
});

// Function to create even more dynamic icons
function createAdditionalIcons() {
  const iconsContainer = document.querySelector('.floating-icons');
  const mathSymbols = ['∑', 'π', '√', '∞', '∫', '∂', 'Δ', 'θ', 'λ', '≈', '≠', '≤', '≥', '⊕', '⊗', '⊖', '⊘', '⚡', '🔢', '📐', '📊'];
  
  for (let i = 0; i < 15; i++) {
    const icon = document.createElement('div');
    icon.className = 'icon';
    const randomSymbol = mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
    icon.textContent = randomSymbol;
    icon.style.top = Math.random() * 100 + '%';
    icon.style.left = Math.random() * 100 + '%';
    icon.style.animationDuration = 15 + Math.random() * 15 + 's';
    icon.style.animationDelay = Math.random() * 10 + 's';
    icon.style.fontSize = 1.5 + Math.random() * 2.5 + 'rem';
    icon.style.opacity = 0.05 + Math.random() * 0.15;
    iconsContainer.appendChild(icon);
  }
}