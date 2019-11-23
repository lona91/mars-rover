import { Socket } from "socket.io";
import Rover from "../entities/Rover";
import Entity from "../interfaces/Entity";
import ICommand from "../interfaces/Command";

class GridCommand implements ICommand {
  public static commandName: string = "grid";
  public rover: Rover;
  public commandName: string = "grid";

  constructor(rover: Rover) {
    this.rover = rover;
  }

  public exec(value: any, socket?: Socket, callback?: Function) {
    const {rover} = this;
    callback({
      rows: rover.grid.ROWS,
      cols: rover.grid.COLS,
      obstacles: rover.grid.obstacles.map((o: Entity) => [o.position.x, o.position.y])
    });
  }
}

export default GridCommand;
