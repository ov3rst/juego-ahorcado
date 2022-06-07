import { diccionario, palabraElegida } from "./ahorcado.js";

const pantalla = document.querySelector("canvas"),
  pincel = pantalla.getContext("2d"),
  d = document,
  $homeScreen = d.querySelector(".home-screen"),
  $btnPlay = d.getElementById("play-game"),
  $btnAddWord = d.getElementById("add-word"),
  posicionLetra = [],
  letraCorrecta = [],
  palabra = palabraElegida();

let posicionLetraErradaX = 750,
  sigtePosicion = 40,
  intentos = 0;

const dibujarLinea = (x, y, linex, liney) => {
  pincel.beginPath();
  pincel.lineWidth = 12;
  pincel.lineCap = "round";
  pincel.strokeStyle = "black";
  pincel.moveTo(x, y);
  pincel.lineTo(linex, liney);
  pincel.stroke();
  pincel.closePath();
};

const dibujarLetra = (letra, x, y) => {
  pincel.beginPath();
  pincel.font = "bold 48px serif";
  pincel.fillStyle = "black";
  pincel.fillText(letra.toUpperCase(), x, y);
  pincel.closePath();
};

const dibujarRayaLetras = () => {
  let x = 0,
    sumaAncho = 0,
    nuevaPosicion = 0;

  switch (true) {
    case palabra.length > 0 && palabra.length <= 8:
      x = 400;
      sumaAncho = 40;
      nuevaPosicion = 80;
      break;
    case palabra.length > 8 && palabra.length <= 13:
      x = 350;
      sumaAncho = 40;
      nuevaPosicion = 60;
      break;
    case palabra.length > 13 && palabra.length <= 17:
      x = 305;
      sumaAncho = 35;
      nuevaPosicion = 52;
      break;
    case palabra.length > 17 && palabra.length <= 23:
      x = 285;
      sumaAncho = 20;
      nuevaPosicion = 40;
      break;
  }

  for (let i = 0; i < palabra.length; i++) {
    dibujarLinea(x, 750, x + sumaAncho, 750);
    posicionLetra.push(x);
    x += nuevaPosicion;
  }
};

const letraPulsada = (keyPress) => {
  let letras = palabra.split("");

  if (letraCorrecta.includes(keyPress)) return;

  for (let i = 0; i < letras.length; i++) {
    if (keyPress === letras[i]) {
      dibujarLetra(letras[i], posicionLetra[i], 730);
      if (!letraCorrecta.includes(letras[i])) letraCorrecta.push(keyPress);
    }
  }
};

const letraIncorrecta = (letra) => {
  if (!letraCorrecta.includes(letra)) {
    if (intentos < 8) {
      dibujarLetra(letra, posicionLetraErradaX, 450);
      posicionLetraErradaX += sigtePosicion;
      intentos++;
    }
  }
};

const munieco = () => {
  switch (intentos) {
    case 1:
      //Soporte vertical
      dibujarLinea(145, 715, 145, 85);
      break;

    case 2:
      //Soporte horizontal
      dibujarLinea(145, 85, 584, 85);
      break;

    case 3:
      //Soporte cabeza
      dibujarLinea(585, 85, 585, 165);
      break;

    case 4:
      //cabeza
      pincel.lineWidth = 12;
      pincel.strokeStyle = "black";
      pincel.arc(585, 240, 70, 0, 2 * Math.PI);
      pincel.stroke();
      break;

    case 5:
      //cuerpo
      dibujarLinea(585, 310, 585, 545);
      break;

    case 6:
      //piernas
      dibujarLinea(585, 545, 490, 645);
      dibujarLinea(585, 545, 690, 645);
      break;

    case 7:
      //brazos
      dibujarLinea(585, 400, 490, 320);

      break;

    case 8:
      dibujarLinea(585, 400, 690, 320);

      //Fin del Juego
      dibujarLetra("¡Fin del Juego!!", 750, 350);
      d.removeEventListener("keyup", eventosKeyup);
      setTimeout(() => {
        location.reload();
      }, 3000);
      break;
  }
};

const winner = () => {
  let count = 0;
  for (let letra of palabra) {
    if (letraCorrecta.includes(letra)) count++;
  }

  return count === palabra.length ? true : false;
};

const eventosKeyup = (e) => {
  const key = /[a-zA-ZñÑ]/gi;

  if (e.key.length === 1 && key.test(e.key)) {
    letraPulsada(e.key);
    letraIncorrecta(e.key);
    munieco();
    if (winner()) {
      dibujarLetra("has ganado!!!", 750, 350);
      d.removeEventListener("keyup", eventosKeyup);
      setTimeout(() => {
        location.reload();
      }, 3000);
    }
  }
};

d.addEventListener("DOMContentLoaded", (e) => {
  // console.log(palabra);

  //base
  dibujarLinea(30, 750, 260, 750);
  dibujarLinea(145, 715, 30, 750);
  dibujarLinea(260, 750, 145, 715);
  dibujarRayaLetras();
});

d.addEventListener("click", (e) => {
  if (e.target === $btnPlay) {
    console.log(e.target);
    $homeScreen.classList.add("none");
    pantalla.classList.add("play");
  }

  if (pantalla.classList.contains("play")) {
    d.addEventListener("keyup", eventosKeyup);
  }

  if (e.target === $btnAddWord) {
    diccionario.push(e.target.previousElementSibling.value);
    e.target.previousElementSibling.value = "";
  }
});
