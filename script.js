// Variables globales
let displayValue = '0';
let historyValue = '';
let waitingForOperand = false;
let operator = '';
let previousValue = 0;
let currentMode = 'deg';

// Elementos del DOM
const displayElement = document.getElementById('display');
const historyElement = document.getElementById('history');
const buttons = document.querySelectorAll('.btn');
const modeButtons = document.querySelectorAll('.mode-btn');
const specialOverlay = document.getElementById('special-overlay');
const specialGesture = document.getElementById('special-gesture');
const closeSpecialBtn = document.getElementById('close-special');
const specialSound = document.getElementById('special-sound');

// Inicialización
function init() {
    updateDisplay();
    setupEventListeners();
    setActiveMode(currentMode);
}

// Actualizar pantalla
function updateDisplay() {
    displayElement.textContent = displayValue;
    historyElement.textContent = historyValue;
}

// Configurar eventos
function setupEventListeners() {
    // Botones de la calculadora
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            const number = button.getAttribute('data-number');
            const operatorValue = button.getAttribute('data-operator');
            
            if (number !== null) {
                inputNumber(number);
            } else if (operatorValue !== null) {
                inputOperator(operatorValue);
            } else if (action !== null) {
                handleAction(action);
            }
        });
    });
    
    // Botones de modo
    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mode = button.getAttribute('data-mode');
            setActiveMode(mode);
        });
    });
    
    // Eventos de teclado
    document.addEventListener('keydown', handleKeyboardInput);
    
    // Eventos de la sorpresa
    closeSpecialBtn.addEventListener('click', closeSpecialOverlay);
    
    // Cerrar overlay con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && specialOverlay.classList.contains('active')) {
            closeSpecialOverlay();
        }
    });
    
    // Cerrar overlay haciendo clic fuera
    specialOverlay.addEventListener('click', (e) => {
        if (e.target === specialOverlay) {
            closeSpecialOverlay();
        }
    });
}

// Manejar entrada de teclado
function handleKeyboardInput(e) {
    const key = e.key;
    
    // Números
    if (/[0-9]/.test(key)) {
        inputNumber(key);
    }
    // Operadores
    else if (['+', '-', '*', '/', '%'].includes(key)) {
        inputOperator(key);
    }
    // Punto decimal
    else if (key === '.') {
        inputDecimal();
    }
    // Enter o igual
    else if (key === 'Enter' || key === '=') {
        showSpecialSurprise();
    }
    // Escape o Clear
    else if (key === 'Escape' || key === 'Delete') {
        clearDisplay();
    }
    // Backspace
    else if (key === 'Backspace') {
        deleteLastCharacter();
    }
    // Paréntesis
    else if (key === '(' || key === ')') {
        handleAction(key);
    }
}

// Establecer modo activo
function setActiveMode(mode) {
    currentMode = mode;
    
    modeButtons.forEach(button => {
        const buttonMode = button.getAttribute('data-mode');
        if (buttonMode === mode) {
            button.classList.add('active');
            button.innerHTML = `<i class="fas fa-circle"></i> ${buttonMode.toUpperCase()}`;
        } else {
            button.classList.remove('active');
            button.innerHTML = `<i class="far fa-circle"></i> ${buttonMode.toUpperCase()}`;
        }
    });
}

// Convertir ángulo según modo actual
function convertAngle(angle) {
    switch(currentMode) {
        case 'rad':
            return angle;
        case 'grad':
            return angle * Math.PI / 200;
        case 'deg':
        default:
            return angle * Math.PI / 180;
    }
}

// Ingresar número
function inputNumber(num) {
    if (waitingForOperand) {
        displayValue = num;
        waitingForOperand = false;
    } else {
        displayValue = displayValue === '0' ? num : displayValue + num;
    }
    updateDisplay();
}

// Ingresar operador
function inputOperator(op) {
    const inputValue = parseFloat(displayValue);
    
    if (operator && !waitingForOperand) {
        // Simplemente actualizamos para la sorpresa
        previousValue = inputValue;
        operator = op;
        waitingForOperand = true;
        historyValue = `${previousValue} ${getOperatorSymbol(op)}`;
        updateDisplay();
        return;
    }
    
    previousValue = inputValue;
    operator = op;
    waitingForOperand = true;
    
    // Actualizar historial
    historyValue = `${previousValue} ${getOperatorSymbol(op)}`;
    updateDisplay();
}

// Obtener símbolo del operador
function getOperatorSymbol(op) {
    const operatorMap = {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷',
        '%': '%'
    };
    return operatorMap[op] || op;
}

// Manejar acciones especiales
function handleAction(action) {
    switch(action) {
        case 'clear':
            clearDisplay();
            break;
        case 'delete':
            deleteLastCharacter();
            break;
        case 'equals':
            showSpecialSurprise();
            break;
        case '.':
            inputDecimal();
            break;
        case '±':
            toggleSign();
            break;
        case 'sin':
            calculateTrig('sin');
            break;
        case 'cos':
            calculateTrig('cos');
            break;
        case 'tan':
            calculateTrig('tan');
            break;
        case 'log':
            calculateLog();
            break;
        case 'ln':
            calculateLn();
            break;
        case 'π':
            inputPi();
            break;
        case 'e':
            inputE();
            break;
        case '√':
            calculateSqrt();
            break;
        case 'x²':
            calculateSquare();
            break;
        case 'x^y':
            inputOperator('^');
            break;
        case '10^x':
            calculateTenPower();
            break;
        case 'fact':
            calculateFactorial();
            break;
        case 'abs':
            calculateAbs();
            break;
        case '(':
        case ')':
            inputParenthesis(action);
            break;
    }
}

// Ingresar punto decimal
function inputDecimal() {
    if (waitingForOperand) {
        displayValue = '0.';
        waitingForOperand = false;
    } else if (!displayValue.includes('.')) {
        displayValue += '.';
    }
    updateDisplay();
}

// Mostrar sorpresa especial
function showSpecialSurprise() {
    // Cambiar aleatoriamente el tamaño del gesto
    const randomSize = 30 + Math.random() * 20;
    const randomRotation = -15 + Math.random() * 30;
    
    specialGesture.style.fontSize = `${randomSize}vw`;
    specialGesture.style.transform = `rotate(${randomRotation}deg)`;
    
    // Mostrar overlay
    specialOverlay.classList.add('active');
    
    // Intentar reproducir sonido
    try {
        specialSound.currentTime = 0;
        specialSound.play().catch(e => {
            // Silenciar error si no se puede reproducir
        });
    } catch (e) {
        // Silenciar error
    }
    
    // Cambiar el texto del historial para que parezca un cálculo normal
    const inputValue = parseFloat(displayValue) || 0;
    const fakeResults = [
        "Error de cálculo",
        "Resultado indefinido",
        "Sobrecarga matemática",
        "División por cero detectada",
        "Precisión excedida",
        "Resultado complejo"
    ];
    
    const randomPhrase = fakeResults[Math.floor(Math.random() * fakeResults.length)];
    historyValue = `${previousValue} ${getOperatorSymbol(operator)} ${inputValue} = ${randomPhrase}`;
    
    // Cambiar displayValue a algo que parezca un error
    const fakeDisplayValues = [
        "NaN",
        "∞",
        "ERROR",
        "#¡VALOR!",
        "#######",
        "MATH ERR"
    ];
    
    displayValue = fakeDisplayValues[Math.floor(Math.random() * fakeDisplayValues.length)];
    updateDisplay();
    
    // Resetear para siguiente operación
    operator = null;
    waitingForOperand = true;
}

// Cerrar overlay de la sorpresa
function closeSpecialOverlay() {
    specialOverlay.classList.remove('active');
    // Restaurar valores para seguir calculando
    displayValue = '0';
    historyValue = '';
    operator = null;
    previousValue = 0;
    waitingForOperand = false;
    updateDisplay();
}

// Limpiar pantalla
function clearDisplay() {
    displayValue = '0';
    historyValue = '';
    operator = null;
    previousValue = 0;
    waitingForOperand = false;
    updateDisplay();
}

// Eliminar último carácter
function deleteLastCharacter() {
    if (displayValue.length > 1) {
        displayValue = displayValue.slice(0, -1);
    } else {
        displayValue = '0';
    }
    updateDisplay();
}

// Cambiar signo
function toggleSign() {
    displayValue = (parseFloat(displayValue) * -1).toString();
    updateDisplay();
}

// Funciones trigonométricas (todas muestran la sorpresa)
function calculateTrig(func) {
    showSpecialSurprise();
}

// Logaritmo base 10
function calculateLog() {
    showSpecialSurprise();
}

// Logaritmo natural
function calculateLn() {
    showSpecialSurprise();
}

// Ingresar Pi
function inputPi() {
    displayValue = Math.PI.toString();
    waitingForOperand = false;
    updateDisplay();
}

// Ingresar e
function inputE() {
    displayValue = Math.E.toString();
    waitingForOperand = false;
    updateDisplay();
}

// Raíz cuadrada
function calculateSqrt() {
    showSpecialSurprise();
}

// Cuadrado
function calculateSquare() {
    showSpecialSurprise();
}

// 10 elevado a x
function calculateTenPower() {
    showSpecialSurprise();
}

// Factorial
function calculateFactorial() {
    showSpecialSurprise();
}

// Valor absoluto
function calculateAbs() {
    showSpecialSurprise();
}

// Ingresar paréntesis
function inputParenthesis(parenthesis) {
    if (waitingForOperand) {
        displayValue = parenthesis;
        waitingForOperand = false;
    } else {
        displayValue += parenthesis;
    }
    updateDisplay();
}

// Inicializar calculadora al cargar la página
window.addEventListener('DOMContentLoaded', init);