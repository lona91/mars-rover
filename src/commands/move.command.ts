import {from} from "rxjs";
import {filter} from "rxjs/operators";

import Rover from "../entities/Rover";
import CommandResponse from "../interfaces/CommandResponse";
import Position from "../interfaces/Position";
import { Socket } from "socket.io";
import ICommand from "../interfaces/Command";

/**
 * @description Classe che registra l'evento per la richiesta dei dati riguardanti la griglia e gli ostacoli
 * presenti sulla griglia
 */
class MoveCommand implements ICommand {

  /**
   * @description Nome dell'evento da registrare
   */
  public static commandName: string = "move";

  /**
   * @description Nome dell'evento da registrare
   */
  public commandName: string = "move";

  /**
   * @description L'oggetto Rover su cui eseguire il comando
   */
  private rover: Rover;

  /**
   * @description I parametri accettati dal comando
   */
  private allowedCommands = ["l", "r", "b", "f"];

  /**
   * @description Spostamento nei due assi relativamente alla direzione
   */
  private directionMovements = [[0, -1], [1, 0], [0, 1], [-1, 0]];

  /**
   * @constructor
   * @description Crea un'oggetto di tipo MoveCommand
   * @param rover L'oggetto Rover su cui eseguire il comando
   */
  constructor(rover: Rover) {
    this.rover = rover;
  }
  public exec(value: any, socket?: Socket, callback?: Function): CommandResponse | void {
    const {rover} = this;
    const [c, noHistory] = value;
    from(c.split(""))
      .pipe(
        filter((command: string) => this.allowedCommands.indexOf(command) !== -1)
      )
      .subscribe({
        next: (x) => {
          switch (x) {
            case "l":
              rover.position.direction = rover.position.direction === 0 ? 3 : rover.position.direction - 1;
              if (!noHistory) {
                rover.history.push({
                  name: "Rotated left",
                  undo: () => this.exec(["r", true])
                });
              }
              break;
            case "r":
              rover.position.direction = (rover.position.direction + 1) % 4;
              if (!noHistory) {
                rover.history.push({
                  name: "Rotated right",
                  undo: () => this.exec(["l", true])
                });
              }
              break;
            case "f":
              const deltaF = this.directionMovements[rover.position.direction];
              const newPositionF: Position = rover.grid.normalize({
                x: rover.position.x + deltaF[0],
                y: rover.position.y + deltaF[1]
              });
              if (rover.grid.isOccupied(newPositionF.x, newPositionF.y)) {
                socket.emit("notify", "Collision detected");
                return;
              }
              rover.position.x = newPositionF.x;
              rover.position.y = newPositionF.y;
              if (!noHistory) {
                rover.history.push({
                  name: "Moved forward",
                  undo: () => this.exec(["b", true])
                });
              }
              break;
            case "b":
              const deltaB = this.directionMovements[rover.position.direction].map((i: number) => -i);
              const newPositionB: Position = rover.grid.normalize({
                x: rover.position.x + deltaB[0],
                y: rover.position.y + deltaB[1]
              });
              if (rover.grid.isOccupied(newPositionB.x, newPositionB.y)) {
                socket.emit("notify", "Collision detected");
                return;
              }
              rover.position.x = newPositionB.x;
              rover.position.y = newPositionB.y;
              if (!noHistory) {
                rover.history.push({
                  name: "Moved backward",
                  undo: () => this.exec(["f", true])
                });
              }
              break;
          }
        }
      });
  }
}

export default MoveCommand;
