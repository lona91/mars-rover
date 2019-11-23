import Command from "../interfaces/Command";
import Rover from '../entities/Rover';
import { Socket } from 'socket.io';

class GridCommand implements Command {
  rover:Rover;
  static command_name ="grid";
  command_name ="grid";

  constructor(rover:Rover) {
    this.rover = rover;
  }

  exec(value:any, socket?:Socket, callback?:Function) {
    const {rover} = this;
    callback({
      rows: rover.grid.ROWS,
      cols: rover.grid.COLS,
      obstacles: rover.grid.obstacles.map(o => [o.position.x, o.position.y])
    });
  }

}

export default GridCommand;