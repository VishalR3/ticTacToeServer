import { Room, Client } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {

  onCreate (options: any) {
    this.maxClients =2;
    this.setState(new MyRoomState());

    this.onMessage("mark", (client, message) => {
      //
      // handle "type" message
      //
      console.log(message);
      let response = {
        index:message,
        player:this.state.players.get(client.sessionId).x
      }
      this.state.board[message] = this.state.players.get(client.sessionId).x;
      this.broadcast('update',response);
    });

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
