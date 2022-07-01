class Player {
  constructor() {
    this.name = null
    this.index = null
    this.positionX = 0
    this.positionY = 0 
    this.rank=0
    this.score=0
    this.fuel=185
    this.life=185
  }
 
getCarros(){
  database.ref("carroFim").on("value",data=>{
    this.rank = data.val()
  })
} 

static updateCarros(rankDb){
  database.ref("/").update({
    carroFim:rankDb
  })
}

getCount(){
  var playesCountR = database.ref("contagemJogador");
  playesCountR.on("value",data=>{
    contagemJogador = data.val()
  })
}

updateCount(c){
  database.ref("/").update({
    contagemJogador:c
  })

}

static getPlayersInf(){
  var playerInfR=database.ref("players")
  playerInfR.on("value",data=>{allPlayers=data.val()})
}

addPlayer(){
  var playerIndex = "players/player"+this.index
  if (this.index === 1) {
    this.positionX = width/2-100
  } else {
    this.positionX = width/2+100
    
  }

  database.ref(playerIndex).set({
    name:this.name,
    positionX:this.positionX,
    positionY:this.positionY,
    rank:this.rank,
    score:this.score
  })

}

update(){
  var playerIndex = "players/player"+this.index
  database.ref(playerIndex).update({
    positionX:this.positionX,
    positionY:this.positionY,
    rank:this.rank,
    score:this.score,
    life:this.life
  })
}

getDistance(){
  var playerDisitR = database.ref("players/player"+this.index)
  playerDisitR.on("value",data=>{
    var data = data.val()
    this.positionX=data.positionX
    this.positionY=data.positionY
  })
}

}
