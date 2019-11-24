import Rover from "../entities/Rover";
import CommandResponse from "./CommandResponse";
import { Socket } from "socket.io";

/**
 * @description Interfaccia per la porzione statica della classe comando
 */
export interface ICommandClass {
  /**
   * @description Nome dell'evento da registrare
   */
  commandName: string;
  /**
   * @constructor
   * @description Crea un nuovo comando
   * @param rover Rover su cui viene applicato il comando
   */
  new (rover: Rover): ICommand;
}

/**
 * @description Interfaccia per la porzione dinamica della ckass command
 */
export default interface ICommand {
  /**
   * @description Nome dell'evento da registrare
   */
  commandName: string;
  /**
   * @description Esecuzione del comando
   * @param value Valore passatto alla richiesta
   * @param socket Il socket che richiede l'esecuzione del comando
   * @param callback Callback per rispondere alla richiesta
   * @returns void o CommandResponse
   */
  exec: (value: any, socket?: Socket, callback?: Function) => CommandResponse | void;
}
