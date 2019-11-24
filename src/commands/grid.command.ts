import { Socket } from "socket.io";
import Rover from "../entities/Rover";
import Entity from "../interfaces/Entity";
import ICommand from "../interfaces/Command";

/**
 * @description Classe che registra l'evento per la richiesta dei dati riguardanti la griglia e gli ostacoli
 * presenti sulla griglia
 */
class GridCommand implements ICommand {
  /**
   * @description Nome dell'evento da registrare
   */
  public static commandName: string = "grid";

  /**
   * @description Nome dell'evento da registrare
   */
  public commandName: string = "grid";

  /**
   * @description L'oggetto Rover su cui eseguire il comando
   */
  public rover: Rover;

  /**
   * @constructor
   * @description Crea un'oggetto di tipo GridCommand
   * @param rover L'oggetto Rover su cui eseguire il comando
   */
  constructor(rover: Rover) {
    this.rover = rover;
  }

  /**
   * @description Esegui il comando restituendo al socket la dimensione della griglia e la posizione degli ostacoli
   * @param value Valore passatto alla richiesta
   * @param socket Il socket che richiede l'esecuzione del comando
   * @param callback Callback per rispondere alla richiesta
   */
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
