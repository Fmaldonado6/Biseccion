const equationInput = document.getElementById("equation");
const x1Input = document.getElementById("x1");
const xuInput = document.getElementById("xu");

const stepsCard = document.getElementById("steps-card");
const stepsContainer = document.getElementById("steps");

const steps = document.getElementById("steps");
const resultCard = document.getElementById("result-card");
const results = document.getElementById("results");
const errorInput = document.getElementById("error");

const variable = "x";
const symbols = new Set(["+", "-", "*", "/", "^", "("]);
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
    if (evalEquation(equation, x1) * evalEquation(equation, xu) >= 0)
      throw Error("El intervalo no contiene a la solucion, intenta otro");
    if (error === null) throw Error("Ingresa el error");
    

    let absError = error + 1;
    let xr;
    let lastAprox = 0;
    let i = 0;
    while (absError > error) {
      xr = (x1 + xu) / 2;

      absError = absoluteError(lastAprox, xr);

      const f1 = evalEquation(equation, x1);
      const fr = evalEquation(equation, xr);
      const f1fr = f1 * fr;

      if (Number.isNaN(f1fr) || !Number.isFinite(f1fr))
        throw new Error("La ecuación no tiene solución");

      addStep(x1, xu, xr, f1fr, lastAprox, absError, ++i);

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

function addStep(x1, xu, xr, f1fr, lastAprox, absError, i) {
  x1 = x1 % 1 == 0 ? x1 : x1.toFixed(4);
  xu = xu % 1 == 0 ? xu : xu.toFixed(4);
  xr = xr % 1 == 0 ? xr : xr.toFixed(4);
  lastAprox = lastAprox % 1 == 0 ? lastAprox : lastAprox?.toFixed(4);
  absError = absError % 1 == 0 ? absError : absError.toFixed(4);
  f1fr = f1fr % 1 == 0 ? f1fr : f1fr.toFixed(4);

  const duplicateNode = stepsCard.cloneNode(true);
  duplicateNode.querySelector("#iteration-num").innerHTML = "Iteración " + i;
  duplicateNode.querySelectorAll(".x1").forEach((e) => (e.innerHTML = x1));
  duplicateNode.querySelectorAll(".xu").forEach((e) => (e.innerHTML = xu));
  duplicateNode.querySelectorAll(".xr").forEach((e) => (e.innerHTML = xr));
  duplicateNode
    .querySelectorAll(".xr-prev")
    .forEach((e) => (e.innerHTML = lastAprox));
  duplicateNode.querySelector("#fx1fxr-result").innerHTML =
    f1fr > 0 ? "> 0" : "< 0";
  duplicateNode.querySelector("#abs-error").innerHTML = absError;
  duplicateNode.querySelector("#x1-next").innerHTML = f1fr > 0 ? xr : x1;
  duplicateNode.querySelector("#xu-next").innerHTML = f1fr > 0 ? xu : xr;

  duplicateNode.style.display = "block";
  stepsContainer.appendChild(duplicateNode);
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
  if (stepsCard.classList.contains("show")) stepsCard.classList.remove("show");
  stepsCard.classList.add("hidden");
}

function evalEquation(equation, x) {
  try {
    let firstChar = true;
    let isNegative;
    let formattedEquation = "(";

    for (let char of equation) {
      let addChar = char;

      const xValue = isNegative ? "(" + x * -1 + ")" : "(" + x + ")";

      if (replace[char]) addChar = replace[char];

      if (!firstChar && addChar == variable) {
        isNegative = false;
        formattedEquation += "*" + xValue;
      } else if (addChar == variable) {
        isNegative = false;
        formattedEquation += xValue;
      } else if (firstChar && addChar == "-") isNegative = true;
      else if (!firstChar && symbols.has(char))
        formattedEquation += ")" + addChar + "(";
      else formattedEquation += addChar;

      firstChar = symbols.has(char);
    }

    formattedEquation += ")";
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
