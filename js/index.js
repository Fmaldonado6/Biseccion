const equationInput = document.getElementById("equation");
const x1Input = document.getElementById("x1");
const xuInput = document.getElementById("xu");
const errorInput = document.getElementById("error");

const variable = "x";
const symbols = new Set(["+", "-", "*", "/", "(", ")"]);

function solve() {
  let x1 = x1Input.value;
  let xu = xuInput.value;
  let equation = equationInput.value;
  evalEquation(equation, x1);
}

function evalEquation(equation, x) {
  let firstChar = true;

  let formattedEquation = "";

  for (let char of equation) {
    if (!firstChar && char == variable) formattedEquation += "*" + x;
    else if (char == variable) formattedEquation += x;
    else formattedEquation += char;
    firstChar = symbols.has(char);
  }

  console.log(formattedEquation);
  console.log(eval(formattedEquation));
}
