import { Schema, type,MapSchema } from "@colyseus/schema";

export class Player extends Schema {
  @type("number") x:number;

  assignNumber(number:number){
      this.x = number;
  }
}

export class MyRoomState extends Schema {

  @type({ map: Player })
    players = new MapSchema<Player>();

  @type('number') currentTurn=1;
  @type(['number']) board = Array(9).fill(-1);

  createPlayer(sessionId: string) {
      this.players.set(sessionId, new Player());
      if(this.players.size > 1){
        this.players.get(sessionId).assignNumber(2);
      }else{
        this.players.get(sessionId).assignNumber(1);
      }
  }

  removePlayer(sessionId: string) {
      this.players.delete(sessionId);
  }

  toggleTurn(){

  }


}
