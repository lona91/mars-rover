import { Socket } from "socket.io";
import { observe } from "mobx";

import ICommand from "../interfaces/Command";
import Rover from "../entities/Rover";
import Logger from "../Logger";

class PositionCommand implements ICommand {
  public static commandName: string = "position";
  public commandName: string = "position";
  private rover: Rover;

  constructor(rover: Rover) {
    this.rover = rover;
    observe(rover.position, (change) => {
      Logger.debug("updated position", {change});
      rover.io.sockets.emit("position_update", change.object);
    });
  }
  public exec(msg: any, socket?: Socket, callback?: Function ) {
    if (!callback) return;
    const {rover} = this;
    callback(rover.position);
  }
}

export default PositionCommand;
