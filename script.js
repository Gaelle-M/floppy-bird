const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = "./media/flappy-bird-set.png";

//general settings
let gamePlaying = false; //toggle pour savoir si on joue ou pas
const gravity = 0.5; //paramètre de la gravité
const speed = 6.2; //vitesse des poteaux qui se séplacent
const size = [51, 36]; //taille de l'oiseau (largeur, hauteur)
const jump = -9.5; //paramètre gérant la difficulté du jeu
const cTenth = canvas.width / 10; //1 dixième du canvas

//pipe settings
const pipeWidth = 78; //largeur des poteaux
const pipeGap = 270; //écart entre les poteaux
const pipeLoc = () =>
  Math.random() * (canvas.height - (pipeGap + pipeWidth) - pipeWidth) +
  pipeWidth; //fonction pour générer un emplacement de poteau

let index = 0, //permet de créer un effet d'optique
  bestScrore = 0,
  currentScore = 0,
  pipes = [],
  flight,
  flyHeight;

const setup = () => {
  currentScore = 0;
  flight = jump;
  flyHeight = canvas.height / 2 - size[1] / 2;

  pipes = Array(3)
    .fill()
    .map((a, i) => [canvas.width + i * (pipeGap + pipeWidth), pipeLoc()]);
};

const render = () => {
  index++;

  //background
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -((index * (speed / 2)) % canvas.width) + canvas.width,
    0,
    canvas.width,
    canvas.height
  );
  //deuxième background pour donner l'effet d'animation
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -((index * (speed / 2)) % canvas.width),
    0,
    canvas.width,
    canvas.height
  );

  //image oiseau
  if (gamePlaying) {
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) * size[1],
      ...size,
      cTenth,
      flyHeight,
      ...size
    );
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  } else {
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) * size[1],
      ...size,
      canvas.width / 2 - size[0] / 2,
      flyHeight,
      ...size
    );
    flyHeight = canvas.height / 2 - size[1] / 2;

    //paramètre pour écrire sur le canvas
    ctx.fillText(`Meilleur score : ${bestScrore}`, 55, 245);
    ctx.fillText("Cliquez pour jouer", 48, 535);
    ctx.font = "bold 30px courier";
  }

  //pipe display
  if (gamePlaying) {
    pipes.map((pipe) => {
      pipe[0] -= speed;

      //top pipe
      ctx.drawImage(
        img,
        432,
        588 - pipe[1],
        pipeWidth,
        pipe[1],
        pipe[0],
        0,
        pipeWidth,
        pipe[1]
      );
      //bottom pipe
      ctx.drawImage(
        img,
        432 + pipeWidth,
        108,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap,
        pipe[0],
        pipe[1] + pipeGap,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap
      );

      if (pipe[0] <= -pipeWidth) {
        currentScore++;
        bestScrore = Math.max(bestScrore, currentScore);

        //remove pipe + create new one
        pipes = [
          ...pipes.slice(1),
          [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()],
        ];
      }
      //if hit the pipe, end
      if (
        [
          pipe[0] <= cTenth + size[0],
          pipe[0] + pipeWidth >= cTenth,
          pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1],
        ].every((elem) => elem)
      ) {
        alert("GAME OVER");
        gamePlaying = false;
        setup();
      }
    });
  }

  //display scores
  document.getElementById("bestScore").innerHTML = `Meilleur : ${bestScrore}`;
  document.getElementById(
    "currentScore"
  ).innerHTML = `Actuel : ${currentScore}`;

  window.requestAnimationFrame(render);
};

setup();
img.onload = render;
document.addEventListener("click", () => (gamePlaying = true));
window.onclick = () => (flight = jump);
