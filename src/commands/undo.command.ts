import { Socket } from "socket.io";

import ICommand from "../interfaces/Command";
import Rover from "../entities/Rover";
import ICommandResponse from "../interfaces/CommandResponse";

class UndoCommand implements ICommand {
  public static commandName = "undo";
  public commandName = "undo";
  private rover: Rover;

  constructor(rover: Rover) {
    this.rover = rover;
  }

  public exec(msg: any, socket?: Socket, callback?: Function) {
    const {rover} = this;
    const times = parseInt(msg[0] || 1, 10);
    for (let i = 0; i < times; i++) {
      const command: ICommandResponse = rover.history.pop();
      command.undo();
    }
  }
}

export default UndoCommand;
