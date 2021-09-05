const equationInput = document.getElementById("equation");
const x1Input = document.getElementById("x1");
const xuInput = document.getElementById("xu");
const errorInput = document.getElementById("error");

const variable = "x";
const symbols = new Set(["+", "-", "*", "/", "(", ")"]);

const replace = { "^": "**", e: Math.E };

function solve() {
  let x1 = x1Input.value;
  let xu = xuInput.value;
  let equation = equationInput.value;

  if (!equation) throw Error("Ingresa una ecuacion");
  if (!x1 || !xu) throw Error("Ingresa valores en el rango");
  evalEquation(equation, x1);
}

function evalEquation(equation, x) {
  let firstChar = true;

  let formattedEquation = "";
  let previous;

  for (let char of equation) {
    if (replace[char]) char = replace[char];
    if (!firstChar && char == variable) formattedEquation += "*" + x;
    else if (char == variable) formattedEquation += x;
    else formattedEquation += char;
    firstChar = symbols.has(char);
    previous = char;
  }

  console.log(formattedEquation);
  console.log(eval(formattedEquation));
}
