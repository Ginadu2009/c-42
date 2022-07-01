//falta getplayerInfo e mudaca
var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player, allPlayers;
var contagemJogador;
var carro1, carro2, carro1Img, carro2Img;
var pista;
var coin, coinImg;
var combustivel, combustivelImg;
var obstaculos, obstaculo1, obstaculo2;
var carros = []
var estadoJogo;
var lifeImage
var explosaoImg

function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  carro1Img = loadImage("assets/car1.png");
  carro2Img = loadImage("assets/car2.png");
  pistaImg = loadImage("assets/PISTA.png");
  obstaculo1 = loadImage("assets/obstacle1.png")
  obstaculo2 = loadImage("assets/obstacle2.png")
  coinImg = loadImage("assets/goldCoin.png")
  combustivelImg = loadImage("assets/fuel.png");
  lifeImage = loadImage("assets/life.png");
  explosaoImg = loadImage("assets/blast.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();

}

function draw() {
  background(backgroundImage);

  if(contagemJogador === 2){
      game.update(1)
  }

  if(estadoJogo === 1){
    game.play()
  }

  if(estadoJogo === 2){
    game.showLearderbord()
    game.end()
  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/*
-Sketch: preload: nome da moeda e do combustivel errados
- algum erro no banco de dados

*/