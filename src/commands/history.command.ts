
import Command from '../interfaces/Command';
import Rover from '../entities/Rover';
import { Socket } from 'socket.io';
import CommandResponse from '../interfaces/CommandResponse';
import { observe } from 'mobx';

class HistoryCommand implements Command {
  rover: Rover;
  static command_name="history";
  command_name="history";

  constructor(rover:Rover) {
    this.rover = rover;
    observe(rover.history, (change) => rover.io.sockets.emit('history_update', change.object.map((h:CommandResponse) => h.name) ))
  }
  exec(value:any, socket?:Socket, callback?:Function): CommandResponse | void {
    const {rover} = this;
    if (!callback) return;
    callback(rover.history);
  }
}

export default HistoryCommand;