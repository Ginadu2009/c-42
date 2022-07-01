class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");//argumento vazio para 'caber' a imagem

    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.estouMovimento = false

    this.explodi = false
    this.leftKeyActive = false
  }

  start() {
    form = new Form();
    form.display();
    player = new Player();
    contagemJogador = player.getCount();
    carro1 = createSprite (width/2-50,height-100);
    carro1.addImage("imagem1",carro1Img);
    carro1.addImage("boom",explosaoImg);
    carro1.scale = 0.07
    carro2 = createSprite (width/2+100, height-100);
    carro2.addImage("imagem2",carro2Img);
    carro2.addImage("boom",explosaoImg);
    carro2.scale = 0.07
    carros = [carro1, carro2]
    combustivel = new Group()
    obstaculos =  new Group()
    coin = new Group()
    this.addSprites(coin,10,coinImg,0.09);
    this.addSprites(combustivel,10,combustivelImg,0.02)
    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstaculo2 },
      { x: width / 2 - 150, y: height - 1300, image: obstaculo1 },
      { x: width / 2 + 250, y: height - 1800, image: obstaculo1 },
      { x: width / 2 - 180, y: height - 2300, image: obstaculo2 },
      { x: width / 2, y: height - 2800, image: obstaculo2 },
      { x: width / 2 - 180, y: height - 3300, image: obstaculo1 },
      { x: width / 2 + 180, y: height - 3300, image: obstaculo2 },
      { x: width / 2 + 250, y: height - 3800, image: obstaculo2 },
      { x: width / 2 - 150, y: height - 4300, image: obstaculo1 },
      { x: width / 2 + 250, y: height - 4800, image: obstaculo2 },
      { x: width / 2, y: height - 5300, image: obstaculo1 },
      { x: width / 2 - 180, y: height - 5500, image: obstaculo2 }
    ];
    this.addSprites(obstaculos,obstaclesPositions.length,obstaculo1,0.04,obstaclesPositions)
  }

  handleFuel(index){
    carros[index-1].overlap(combustivel,function(collector,collected){
      player.fuel = 185
      collected.remove()
    })
    if(player.fuel>0 && this.estouMovimento){
        player.fuel-=0.3
    }
    if(player.fuel<=0){
        estadoJogo = 2
        this.gameOver()
    }
  }

  handleCoin(index){
    carros[index-1].overlap(coin,function(collector,collected){
      player.score += 20
      player.update
      collected.remove()
    })
  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;

      //Se a matriz NÃO  estiver vazia
      // adicionar as posições da matriz à x e y
      if (positions.length > 0) {
        x = positions[i].x;
        y = positions[i].y;
        spriteImage = positions[i].image;

      } else {

        //aleatório para as metades da tela em x e y
      x = random(width / 2 + 150, width / 2 - 150);
      y = random(-height * 4.5, height - 400);

      }

      //criar sprite nas posições aleatórias
      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);

    }
  }  

  getState(){
    var gameStateR = database.ref("estadoJogo");
    gameStateR.on("value",function(data){
      estadoJogo = data.val()
    })
  }

  update(state){
    database.ref("/").update({
      estadoJogo:state
    })
  }

  play(){
    //this.mudanca()
    this.handleElements()
    this.resetButtonf()
    Player.getPlayersInf()
    player.getCarros()
    if(allPlayers!== undefined){
      image(pistaImg,0, -height * 5, width, height * 6);
      this.showLeaderboard()
      this.showLife()
      this.showFuelBar()
      var index = 0;
      for(var playerS in allPlayers){
        index +=1
        var x = allPlayers[playerS].positionX
        var y = height- allPlayers[playerS].positionY
        var qtdVida = allPlayers[playerS].life
        if(qtdVida<=0){
          carros[index-1].changeImage("boom")
          carros[index-1].scale=0.3
        }
        carros[index-1].position.x = x
        carros[index-1].position.y = y
        if(index === player.index){
          stroke(10)
          fill("white")
          ellipse(x,y,60,60)
          this.handleFuel(index)
          this.handleCoin(index)
          this.handleObstacleCollision(index)
          this.handleCarroCollision(index)
          if(player.life<=0){
            this.explodi= true
            this.estouMovimento= false
          }
          camera.position.y=carros[index-1].position.y
        }

      }
      if(this.estouMovimento){
        player.positionY+=5
        player.update
      }
      this.playerControls()
      const finishiLine=height*6-100
      if(player.positionY>finishiLine){
        estadoJogo = 2
        player.rank +=1
        Player.updateCarros(player.rank)
        player.update()
        this.showRank()
      }
      drawSprites();
    }
  
  }

  playerControls(){
    if(!this.explodi){ 
    if(keyIsDown(UP_ARROW)){
      this.estouMovimento=true
      player.positionY = player.positionY+10
      player.update()

    }

    if(keyIsDown(LEFT_ARROW) && player.positionX>width/3-50){
      this.leftKeyActive=true
      player.positionX = player.positionX-5
      player.update()
    }

    if(keyIsDown(RIGHT_ARROW) && player.positionX<width/2+300){
      this.rightKeyActive=true 
      player.positionX = player.positionX+5
      player.update()
    }
  }
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    //C39
    this.resetTitle.html("Reinicar Jogo");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leadeboardTitle.html("Placar");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }

  resetButtonf(){
    this.resetButton.mousePressed(()=>{
      database.ref("/").set({
        contagemJogador:0,estadoJogo:0,players:{},getCarros:0

      })
      window.location.reload()
    })
  }

  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  showRank() {
    swal({
      //title: `Incrível!${"\n"}Rank${"\n"}${player.rank}`,
      title: `Incrível!${"\n"}${player.rank}º lugar`,
      text: "Você alcançou a linha de chegada com sucesso!",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

  showLife() {
    push();
    image(lifeImage, width / 2 - 130, height - player.positionY - 300, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 300, 185, 20);
    fill("#C2331D");
    rect(width / 2 - 100, height - player.positionY - 300, player.life, 20);
    noStroke();
    pop();
  }

  //barra combustivel
  showFuelBar() {
    push();
    image(combustivelImg, width / 2 - 130, height - player.positionY - 250, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 250, 185, 20);
    fill("#ffc400");
    rect(width / 2 - 100, height - player.positionY - 250, player.fuel, 20);
    noStroke();
    pop();
  }

  //final de jogo
  gameOver() {
    swal({
      title: `Fim de Jogo`,
      text: "Oops você perdeu a corrida!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Obrigado por jogar"
    });
  }

  handleObstacleCollision(index) {
    if (carros[index - 1].collide(obstaculos)) {
      if (this.leftKeyActive) {
        player.positionX += 100;
      } else {
        player.positionX -= 100;
      }

      //Reduzindo a vida do jogador
      if (player.life > 0) {
        player.life -= 185 / 4;
      }

      player.update();
    }
  }

  handleCarroCollision(index) {
    if(index === 1){
    if (carros[index - 1].collide(carros[1])) {
      if (this.leftKeyActive) {
        player.positionX += 100;
      } else {
        player.positionX -= 100;
      }

      //Reduzindo a vida do jogador
      if (player.life > 0) {
        player.life -= 185 / 4;
      }

      player.update();
    }
    }
    if(index === 2){
      if (carros[index - 1].collide(carros[0])) {
        if (this.leftKeyActive) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }
  
        //Reduzindo a vida do jogador
        if (player.life > 0) {
          player.life -= 185 / 4;
        }
  
        player.update();
      }
      }
  }

  end(){
    console.log("fimDeJogo")
  }


  
}
