import Command from '../interfaces/Command';
import Rover from '../entities/Rover';
import CommandResponse from '../interfaces/CommandResponse';
import { Socket } from 'socket.io';

class UndoCommand implements Command {
  static command_name="undo";
  command_name="undo";
  rover:Rover;

  constructor(rover:Rover) {
    this.rover = rover;
  }

  exec(msg:any, socket?:Socket, callback?:Function) {
    const {rover} = this;
    const times = parseInt(msg[0] || 1);
    for (let i = 0; i < times; i++) {
      const command:CommandResponse = rover.history.pop();
      command.undo();
    }
  }
}

export default UndoCommand;