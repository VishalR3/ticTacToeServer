import { Schema, type,MapSchema } from "@colyseus/schema";

export class Player extends Schema {
  @type("number") x:number;

  assignNumber(number:number){
      this.x = number;
  }
}

export class ultimateRoomState extends Schema {

  @type({ map: Player })
    players = new MapSchema<Player>();

  @type('number') currentTurn=1;
  @type('number') winner = -1;
  @type(['number']) ultimateBoard = Array(9).fill(-1);
  @type(['number']) board = Array(81).fill(-1);

  createPlayer(sessionId: string) {
      this.players.set(sessionId, new Player());
      if(this.players.size==1){
        this.players.get(sessionId).assignNumber(1);
      }else{
        for (const value of this.players.values()) {
          if(value.x===1){
            this.players.get(sessionId).assignNumber(2);
            break;
          }
          if(value.x===2){
            this.players.get(sessionId).assignNumber(1);
            break;
          }
        }
      }
  }

  removePlayer(sessionId: string) {
      this.players.delete(sessionId);
  }

  handleClick(index:number,player:string){
    this.board[index] = this.players.get(player).x;
    this.toggleTurn()
  }

  toggleTurn(){
    if(this.currentTurn === 1){
      this.currentTurn  = 2
    }else{
      this.currentTurn =1;
    }
  }

  calculateWinner = () => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (this.ultimateBoard[a] !== -1 && this.ultimateBoard[a] === this.ultimateBoard[b] && this.ultimateBoard[a] === this.ultimateBoard[c]) {
        return this.ultimateBoard[a];
      }
    }
    return false;
  };

  isGameOver = () => {
    let win = this.calculateWinner();
    if (!win) {
      for (let i = 0; i < 9; i++) {
        if (this.ultimateBoard[i] === -1) {
          return false;
        }
      }
    } else {
      this.winner = win;
    }
    return true;
  };


}
