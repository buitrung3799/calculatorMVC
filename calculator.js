class Model {
    constructor(){
        this.calculator_buttons = [
            {
                name: 'add',
                symbol: '+',
                formula: '+',
                type: 'operator',
                class: 'key-operator',
            },
            {
                name: 'subtract',
                symbol: '-',
                formula: '-',
                type: 'operator',
                class: 'key-operator',
            },
            {
                name: 'multiple',
                symbol: 'x',
                formula: "*",
                type: 'operator',
                class: 'key-operator',
            },
            {
                name: 'divide',
                symbol: '/',
                formula: '/' ,
                type: 'operator' ,
                class: 'key-operator',
            },
            {
                name: '7',
                symbol: 7,
                formula: 7,
                type: 'number',
            },
            {
                name: '8',
                symbol: 8,
                formula: 8,
                type: 'number',
            },
            {
                name: '9',
                symbol: 9,
                formula: 9,
                type: 'number',
            },
            {
                name: '4',
                symbol: 4,
                formula: 4,
                type: 'number',
            },
            {
                name: '5',
                symbol: 5,
                formula: 5,
                type: 'number',
            },
            {
                name: '6',
                symbol: 6,
                formula: 6,
                type: 'number',
            },
            {
                name: '1',
                symbol: 1,
                formula: 1,
                type: 'number',
            },
            {
                name: '2',
                symbol: 2,
                formula: 2,
                type: 'number',
            },
            {
                name: '3',
                symbol: 3,
                formula: 3,
                type: 'number',
            },
            {
                name: '0',
                symbol: 0,
                formula: 0,
                type: 'number',
            },
            {
                name: 'comma',
                symbol: '.',
                formula: '.',
                type: 'number',
            },
            {
                name : 'delete',
                symbol: 'CE',
                formula: false,
                type: 'key'
            },
            {
                name: 'percentage',
                symbol: '%',
                formula: '/100',
                type: 'number',
            },
            {
                name: 'clear',
                symbol: 'AC',
                formula: false,
                type: 'key',
                class: 'clear-button'
            },
            {
                name: 'calculate',
                symbol: '=',
                formula: '=',
                type: 'calculate',
                class: 'key-equal'
            }
        ],
        this.operation = [],
        this.result = []
    }
    
    addKeyEvent = (buttons) => {
        buttons.addEventListener('click' , e => {
            const key = e.target;
            this.calculator_buttons.forEach(button => {
                if(button.name == key.id) {
                return this.keyPress(button);
                }
            })
        })
    }
    updateOutput(operation) {
        const display = document.querySelector('.operator-display');
        display.innerHTML = operation;
    }
    updateResult(finalResult){
        const result = document.querySelector('.result');
        console.log(finalResult);
        result.innerHTML = finalResult;
    }
    formatResult(result) {
        console.log(result);
        const max_output_number_length = 10;
        const output_precision = 5;
        if(result.toString().length > max_output_number_length) {
            if(result % 1 != 0) {
                const result_float = parseFloat(result);
                const result_float_length = result_float.toString().length;
                console.log(result_float_length);

                if(result_float_length > max_output_number_length){
                    return result.toPrecision(output_precision);
                } else {
                    const num_digit_after_point = max_output_number_length - result_float_length;
                    return result.toFixed(num_digit_after_point);
                }
            } else {
                return result.toPrecision(output_precision);
            }
        } else return result;
    }
    keyPress(button) {
        if(button.type == 'operator') {
            this.operation.push(button.symbol);
            console.log(this.operation);
            this.result.push(button.formula);
        } else if (button.type == 'number'){
            this.operation.push(button.symbol);
            console.log(this.operation)
            this.result.push(button.formula);
        } else if (button.type == 'key'){
            if(button.name == 'clear') {
                this.operation = [];
                this.result = [];
                this.updateResult(0);
            }
            else if (button.name == 'delete') {
                this.result.pop();
                this.operation.pop();
            }
        } else if (button.type == 'calculate'){
            let resultString = this.result.join('');
            console.log(resultString);
            this.operation = []; //Clear all arrays;
            this.result = [];

            let result_final;
            try {
                result_final = eval(resultString);
                console.log(result_final);   //Calculate result and handle errors
            } catch (error) {
                if(error instanceof SyntaxError) { 
                    result_final = 'Syntax Error!'
                    controller.handleUpdateResult(result_final);
                    return;
                }
            }
            result_final = this.updateResult(result_final);  //Format result
            console.log(result_final);
            this.operation.push(result_final); //save result for later if user perform consecutively
            console.log(this.operation);
            this.result.push(result_final);
            this.updateResult(result_final); //update output
            return;
        }

        if(this.operation.join('').match(/^0\d+/)){ //Remove leading zeros
         this.operation.splice(-2,1);
        } else if (this.operation.join('').match(/[^0-9\.]0\d+/)) {
            this.operation.splice(-2,1);
        } else if (this.operation.join('').match(/\.0/)){
            this.operation.join('');
        }
        this.updateOutput(this.operation.join(''));
    }
}

class View {
    constructor(){
        this.calculatorContainer = document.createElement('div');
        this.calculatorContainer.className = 'calculator';
        this.calculatorDisplay = document.createElement('div');
        this.calculatorDisplay.className = 'calculator-display';
        this.display = document.createElement('div');
        this.display.className = 'operator-display';
        this.result = document.createElement('div');
        this.result.className = 'result';
        this.result.innerHTML = 0 ;
        this.keys = document.createElement('div');
        this.keys.className = 'calculator-keys';
        this.calculatorDisplay.append(this.display ,this.result);
        this.calculatorContainer.append(this.calculatorDisplay , this.keys);
        document.body.appendChild(this.calculatorContainer);
    }
    render(buttons) {
        let added_btns = 0;
        buttons.forEach(
            (button) => {
                this.keys.innerHTML += `<button id="${button.name}" class="${button.class}">
                ${button.symbol}</button>`;
                added_btns++;
            }
        )
    }
}

class Controller {
    constructor(model , view) {
        this.model = model;
        this.view = view;
        this.view.render(this.model.calculator_buttons);
        this.model.addKeyEvent(this.view.keys);
    }
}
const app = new Controller(new Model(), new View());
const app1 = new Controller(new Model(), new View());
const app2 = new Controller(new Model(), new View());
const app3 = new Controller(new Model(), new View());

