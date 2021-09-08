const equationInput = document.getElementById("equation");
const x1Input = document.getElementById("x1");
const xuInput = document.getElementById("xu");
const stepsCard = document.getElementById("steps-card");
const steps = document.getElementById("steps");
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
    hideResultCard();
    steps.innerHTML = "";
    results.innerHTML = "";
    if (!equation) throw Error("Ingresa una ecuacion");
    if (x1 === null || xu === null) throw Error("Ingresa valores en el rango");
    //añadi validar que la sol esté dentro del intervalo dado, cuando uno es positivo y uno negativo, hay solucion dentro
    //por eso valida que no sea cero ni positivo el resultado de multiplicar
    if ((evalEquation(equation, x1))*(evalEquation(equation, xu))>=0) throw Error("El intervalo no contiene a la solucion, intenta otro")
    if (error === null) throw Error("Ingresa el error");
    

    let absError = error + 1;
    let xr;
    let lastAprox = null;
    while (absError > error) {
      
      xr = (x1 + xu) / 2;
      
      if(lastAprox)
      absError = absoluteError(lastAprox, xr);
      
      const f1 = evalEquation(equation, x1);
      const fr = evalEquation(equation, xr);

      const f1fr = f1 * fr;
      const element = document.createElement("p");
      element.innerHTML = `X<sub>1</sub> = ${x1.toFixed(4)}, X<sub>u</sub> = ${
       xu.toFixed(4) }<br> X<sub>r</sub> = (${x1.toFixed(4)} + ${xu.toFixed(4)}) / 2 = ${xr.toFixed(4)}<br>
       F( ${x1.toFixed(4)} ) * F( ${xr.toFixed(4)} )= ${f1.toFixed(4)} * ${fr.toFixed(4)} 
       = ${f1fr.toFixed(4)} ${f1fr > 0 ? " > 0<br> X<sub>1</sub> = X<sub>r</sub><br>" : " < 0<br>X<sub>u</sub> = X<sub>r</sub><br>"}<br>
       ${lastAprox ? `E<sub>a</sub> = | ${xr.toFixed(4)} - ${lastAprox.toFixed(4)} / ${xr.toFixed(4)} | (100%) = ${absError % 1 == 0 ? absError : absError.toFixed(4)}% <br>` : "<br>"}`;
  
      steps.appendChild(element);
      if (f1fr == 0) break;
      else if (f1fr > 0) x1 = xr;
      else xu = xr;
      
      
      lastAprox = xr;
      console.log(absError, error);
    }

    console.log("Valor aproximado: " + xr, "Error: ", absError);
    const element = document.createElement("p");
    element.innerHTML = `Valor aproximado: ${xr}, Error aproximado: ${absError.toFixed(4)}%`;
    results.appendChild(element);
    
    showResultCard();

  } catch (e) {
    showSnackbar(e);
  }
}

function absoluteError(x1, x2) {
  return Math.abs((x2 - x1) / x2) * 100;
}

function showResultCard() {
  if (resultCard.classList.contains("hidden"))
    resultCard.classList.remove("hidden");
  resultCard.classList.add("show");
  if (stepsCard.classList.contains("hidden"))
    stepsCard.classList.remove("hidden");
  stepsCard.classList.add("show");
}

function hideResultCard() {
  if (resultCard.classList.contains("show"))
    resultCard.classList.remove("show");
  resultCard.classList.add("hidden");
  if (stepsCard.classList.contains("show"))
    stepsCard.classList.remove("show");
  stepsCard.classList.add("hidden");
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
