import { Room, Client } from "colyseus";
import { ultimateRoomState } from "./schema/ultimateRoomState";

export class ultimateRoom extends Room<ultimateRoomState> {

  
  onCreate (options: any) {
    this.maxClients =2;
    this.setState(new ultimateRoomState());

    this.onMessage("mark", (client, message) => {
      //
      // handle "type" message
      //
      console.log(message);
      
      let response = {
        index:message,
        player:this.state.players.get(client.sessionId).x
      }
      this.state.handleClick(message,client.sessionId);
      this.broadcast('update',response);
    });

    this.onMessage('declareWinner',(client,data)=>{
      console.log('Winner is ',data.boardNo);
      
      this.state.ultimateBoard[data.boardNo] = data.player;
    })

  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    this.state.createPlayer(client.sessionId);
    this.clock.setTimeout(()=>{
      client.send('classify',this.state.players.get(client.sessionId).x);
    },200)
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.removePlayer(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
