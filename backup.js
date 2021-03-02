model = {
    calculator_buttons: [
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
    operation: [],
    result: [],

    updateOutput: function(display,operation) {
        display.innerHTML = operation;
    },
    updateResult: function(finalResult){
        const result = document.querySelector('.result');
        console.log(finalResult);
        result.innerHTML = finalResult;
    },
    formatResult: function(result) {
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
}

view = {
    init: function(){
        console.log('render html here');
    }, 
    render: function() {
        const calculatorContainer = document.createElement('div');
        calculatorContainer.className = 'calculator';
        const calculatorDisplay = document.createElement('div');
        calculatorDisplay.className = 'calculator-display';
        const display = document.createElement('div');
        display.className = 'operator-display';
        const result = document.createElement('div');
        result.className = 'result';
        result.innerHTML = 0 ;
        const keys = document.createElement('div');
        keys.className = 'calculator-keys';
        calculatorDisplay.append(display ,result);
        calculatorContainer.append(calculatorDisplay , keys);
        document.body.appendChild(calculatorContainer);
        

        let added_btns = 0;
        model.calculator_buttons.forEach(
            (button) => {
                keys.innerHTML += `<button id="${button.name}" class="${button.class}">
                ${button.symbol}</button>`;
                added_btns++;
            }
        )
        keys.addEventListener('click' , e => {
            const key = e.target;
            model.calculator_buttons.forEach(button => {
                    if(button.name == key.id) {
                        return this.keyPress(button);
                    }
                })
        })
    },
    keyPress : function(button) {
        const calculatorContainer = document.querySelector('.calculator');
        const display = document.querySelector('.operator-display');
        const result = calculatorContainer.querySelector('.result');
        if(button.type == 'operator') {
            model.operation.push(button.symbol);
            model.result.push(button.formula);
        } else if (button.type == 'number'){
            model.operation.push(button.symbol);
            model.result.push(button.formula);
        } else if (button.type == 'key'){
            if(button.name == 'clear') {
                model.operation = [];
                model.result = [];
                controller.handleUpdateResult(0);
            }
            else if (button.name == 'delete') {
                model.result.pop();
                model.operation.pop();
            }
        } else if (button.type == 'calculate'){
            let resultString = model.result.join('');
            console.log(resultString);
            model.operation = []; //Clear all arrays;
            model.result = [];

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
            result_final = controller.handleFormatResult(result_final);  //Format result
            
            model.operation.push(result_final); //save result for later if user perform consecutively
            model.result.push(result_final);
            controller.handleUpdateResult(result_final); //update output
            return;
        }

        if(model.operation.join('').match(/^0\d+/)){ //Remove leading zeros
         model.operation.splice(-2,1);
        } else if (model.operation.join('').match(/[^0-9\.]0\d+/)) {
            model.operation.splice(-2,1);
        } else if (model.operation.join('').match(/\.0/)){
            model.operation.join('');
        }
        controller.handleUpdateOutput(display , model.operation.join(''));
    }
}

controller = {
    init: function() {
        view.render();
    },
    handleUpdateOutput: function(display , operation){
        model.updateOutput(display, operation);
    },
    handleUpdateResult: function(finalResult){
        model.updateResult(finalResult);
    },
    handleFormatResult: function(result){
        console.log(result)
        model.formatResult(result);
    }
}

for(let i = 0; i < 8; i++) {
    controller.init();
}
