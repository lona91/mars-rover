import { Socket } from "socket.io";
import { observe } from "mobx";

import ICommand from "../interfaces/Command";
import Rover from "../entities/Rover";
import Logger from "../Logger";

/**
 * @description Classe che registra l'evento per la richiesta dei dati riguardanti la posizione del rover
 * e emette un evento socket quando la posizione viene aggiornata
 */
class PositionCommand implements ICommand {
  /**
   * @description Nome dell'evento da registrare
   */
  public static commandName: string = "position";

  /**
   * @description Nome dell'evento da registrare
   */
  public commandName: string = "position";

  /**
   * @description L'oggetto Rover su cui eseguire il comando
   */
  private rover: Rover;

  /**
   * @constructor
   * @description Crea un'oggetto di tipo PositionCommand e registra l'observer sulla posizione del rover
   * @param rover L'oggetto Rover su cui eseguire il comando
   */
  constructor(rover: Rover) {
    this.rover = rover;
    observe(rover.position, (change) => {
      Logger.debug("updated position", {change});
      rover.io.sockets.emit("position_update", change.object);
    });
  }

  /**
   * @description Esegui il comando restituendo al socket la posizione del rover sulla griglia
   * @param value Valore passatto alla richiesta
   * @param socket Il socket che richiede l'esecuzione del comando
   * @param callback Callback per rispondere alla richiesta
   */
  public exec(msg: any, socket?: Socket, callback?: Function ) {
    if (!callback) return;
    const {rover} = this;
    callback(rover.position);
  }
}

export default PositionCommand;
