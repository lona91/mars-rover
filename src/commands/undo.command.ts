import { Socket } from "socket.io";

import ICommand from "../interfaces/Command";
import Rover from "../entities/Rover";
import ICommandResponse from "../interfaces/CommandResponse";

/**
 * @description Classe che registra l'evento per la richiesta di annulamento dell'ultima operazione
 */
class UndoCommand implements ICommand {

  /**
   * @description Nome dell'evento da registrare
   */
  public static commandName = "undo";

  /**
   * @description Nome dell'evento da registrare
   */
  public commandName = "undo";

  /**
   * @description L'oggetto Rover su cui eseguire il comando
   */
  private rover: Rover;

  /**
   * @constructor
   * @description Crea un'oggetto di tipo UndoCommand
   * @param rover L'oggetto Rover su cui eseguire il comando
   */
  constructor(rover: Rover) {
    this.rover = rover;
  }

  /**
   * @description Esegui il comando annulland N movimenti precedenti
   * @param value Valore passatto alla richiesta (numero di movimenti da annullare)
   * @param socket Il socket che richiede l'esecuzione del comando
   * @param callback Callback per rispondere alla richiesta
   */
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
