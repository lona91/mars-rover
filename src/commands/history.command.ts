
import { observe } from "mobx";
import { Socket } from "socket.io";

import ICommand from "../interfaces/Command";
import Rover from "../entities/Rover";
import CommandResponse from "../interfaces/CommandResponse";

/**
 * @description Classe che registra l'evento per la richiesta della storia dei movimenti
 * e emette un evento socket quando la storia viene aggiornata
 */
class HistoryCommand implements ICommand {
  /**
   * @description Nome dell'evento da registrare
   */
  public static commandName: string = "history";
  /**
   * @description Nome dell'evento da registrare
   */
  public commandName: string = "history";
  /**
   * @description L'oggetto Rover su cui eseguire il comando
   */
  private rover: Rover;

  /**
   * @constructor
   * @description Crea un'oggetto di tipo HistoryCommand e registra l'observer sulla storia del rover
   * @param rover L'oggetto Rover su cui eseguire il comando
   */
  constructor(rover: Rover) {
    this.rover = rover;
    observe(
      rover.history,
      (change) => rover.io.sockets.emit("history_update", change.object.map((h: CommandResponse) => h.name))
    );
  }

  /**
   * @description Esegui il comando restituendo al socket la storia dei movimenti del rover
   * @param value Valore passatto alla richiesta
   * @param socket Il socket che richiede l'esecuzione del comando
   * @param callback Callback per rispondere alla richiesta
   */
  public exec(value: any, socket?: Socket, callback?: Function): CommandResponse | void {
    if (!callback) return;
    const {rover} = this;
    callback(rover.history);
  }
}

export default HistoryCommand;
