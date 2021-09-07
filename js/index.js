const equationInput = document.getElementById("equation");
const x1Input = document.getElementById("x1");
const xuInput = document.getElementById("xu");
const resultCard = document.getElementById("result-card");
const results = document.getElementById("results");
const errorInput = document.getElementById("error");

const variable = "x";
const symbols = new Set(["+", "-", "*", "/","^"]);
const adjacentSymbols = new Set([")"]);
const replace = { "^": "**", e: Math.E };

function solve() {
  let x1 = Number.parseFloat(x1Input.value);
  let xu = Number.parseFloat(xuInput.value);
  let error = Number.parseFloat(errorInput.value);
  let equation = equationInput.value;

  try {
    if (!equation) throw Error("Ingresa una ecuacion");
    if (x1 === null || xu === null) throw Error("Ingresa valores en el rango");
    //añadi validar que la sol esté dentro del intervalo dado, cuando uno es positivo y uno negativo, hay solucion dentro
    //por eso valida que no sea cero ni positivo el resultado de multiplicar
    if ((evalEquation(equation, x1))*(evalEquation(equation, xu))>=0) throw Error("El intervalo no contiene a la solucion, intenta otro")
    if (error === null) throw Error("Ingresa el error");

    // const element = document.createElement("p");
    // element.innerHTML = `x<sub>1</sub> = ${x1}, x<sub>u</sub> = ${
    //   xu }`;

    results.appendChild(element);
    let absError = error + 1;
    let xr;
    while (absError > error) {
      xr = (x1 + xu) / 2;
      const f1 = evalEquation(equation, x1);
      const fr = evalEquation(equation, xr);

      absError = absoluteError(xr, x1);

      const f1fr = f1 * fr;
      if (f1fr == 0) break;
      else if (f1fr > 0) x1 = xr;
      else xu = xr;

      console.log(absError, error);
    }

    console.log("Valor aproximado: " + xr, "Error: ", absError);
  } catch (e) {
    showSnackbar(e);
  }
}

function absoluteError(x1, x2) {
  return Math.abs((x2 - x1) / x2) * 100;
}

function evalEquation(equation, x) {
  try {
    let firstChar = true;

    let formattedEquation = "";
    let previous;

    for (let char of equation) {
      let addChar = char
      if (replace[char]) addChar = replace[char];
      if ((!firstChar || adjacentSymbols.has(previous)) && addChar == variable)
        formattedEquation += "*" + x;
      else if (addChar == variable) formattedEquation += x;
      else formattedEquation += addChar;
      firstChar = symbols.has(char);
      previous = addChar;
    }

    console.log(formattedEquation);
    console.log(eval(formattedEquation));
    return eval(formattedEquation);
  } catch (error) {
    throw new Error("Ecuacion mal formateada");
  }
}

function showSnackbar(message) {
  snackbar.classList.add("show");
  snackbar.innerHTML = message;
  setTimeout(function () {
    snackbar.classList.remove("show");
  }, 2750);
}
