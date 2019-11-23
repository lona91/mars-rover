
import { observe } from "mobx";
import { Socket } from "socket.io";

import ICommand from "../interfaces/Command";
import Rover from "../entities/Rover";
import CommandResponse from "../interfaces/CommandResponse";

class HistoryCommand implements ICommand {
  public static commandName: string = "history";
  public commandName: string = "history";
  private rover: Rover;

  constructor(rover: Rover) {
    this.rover = rover;
    observe(
      rover.history,
      (change) => rover.io.sockets.emit("history_update", change.object.map((h: CommandResponse) => h.name))
    );
  }
  public exec(value: any, socket?: Socket, callback?: Function): CommandResponse | void {
    if (!callback) return;
    const {rover} = this;
    callback(rover.history);
  }
}

export default HistoryCommand;
