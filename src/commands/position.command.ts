
import Command from "../interfaces/Command";
import Rover from "../entities/Rover";
import { Socket } from 'socket.io';
import { observe } from "mobx";
import Logger from "../Logger";

class PositionCommand implements Command {
  static command_name="position";
  command_name="position";
  rover: Rover;

  constructor(rover:Rover) {
    this.rover = rover;
    observe(rover.position, (change) => {
      Logger.debug('updated position', {change})
      rover.io.sockets.emit('position_update', change.object);
    });
  }
  exec(msg:any, socket?:Socket, callback?: Function ) {
    const {rover} = this;
    if (!callback) return;
    callback(rover.position);
  }
}

export default PositionCommand;