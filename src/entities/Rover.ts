import * as io from "socket.io";
import {fromEvent, Observable} from "rxjs";
import {first, takeUntil} from "rxjs/operators";
import {observable, action} from "mobx";

import IEntity from "../interfaces/Entity";
import IPosition from "../interfaces/Position";
import IDirection from "../interfaces/Direction";
import ICommand, { ICommandClass } from "../interfaces/Command";
import ICommandResponse from "../interfaces/CommandResponse";
import Logger from "../Logger";
import Grid from "../Grid";

/**
 * @description L'entita Rover
 */
class Rover implements IEntity {
  /**
   * @description La posizione del rover
   */
  @observable public position: IPosition;

  /**
   * @description Un rover è di default solido
   */
  public solid: boolean = true;

  /**
   * @description La griglia sulla quale il rover si muove
   */
  public grid: Grid;

  /**
   * @description Il server Socket.io
   */
  public io: io.Server;

  /**
   * @description La storia dei movimenti effettuati dal rover
   */
  @observable public history: Array<ICommandResponse>;

  /**
   * @description La lista dei comandi attiviti sul rover
   */
  @observable private commands: Array<ICommand>;

  /**
   * @description Lo stream che rappresenta la disconnessione del client
   */
  private disconnect$: Observable<unknown>;

  /**
   * @description Crea un nuovo oggetto Rover imposta la posizione, registra i comandi, inizializza la la storia
   * e inizializza il server Socket.io
   * @constructor
   * @param x Coordinata x di partenza del rover
   * @param y Coordinata y di partenza del rover
   * @param direction Direzione iniziale del rover
   * @param grid Griglia su cui il rover si muove
   */
  constructor(x: number, y: number, direction: IDirection, grid: Grid) {
    this.position = {x, y, direction};
    this.grid = grid;
    this.commands = [];
    this.history = [];

    this.io = io();

    this.registerCommands();
  }

  /**
   * @description Aggiunge un comando al rover
   * @param Command Comando da aggiungere
   */
  @action public addCommand(Command: ICommandClass) {
    if (this.commands.find((item: ICommand) => item.commandName === Command.commandName)) return;
    const c = new Command(this);
    this.commands.push(c);
    this.applyCommand(c);
  }

  /**
   * @description Rimuove un comando dal rover
   * @param Command Comando da rimuovere
   */
  @action public removeCommand(command: ICommandClass) {
    this.commands = this.commands.filter((item: ICommand) => item.commandName !== command.commandName);
    for (const id of Object.keys(this.io.sockets.sockets)) {
      this.io.sockets.sockets[id].removeAllListeners(command.commandName);
    }
  }

  /**
   * @description Chiude il server Socket.io
   * @param callback Funzione da richiamare quando il server viene chiuso
   */
  public close(callback: () => void = () => {}): void {
    if (this.io) this.io.close(callback);
  }

  /**
   * @description Attiva il server Socket.io in ascolto
   * @param port Porta su cui lasciare in ascolto il server Socket.io
   */
  public listen(port: number): void {
    this.io.listen(port);
    Logger.info(`Socket.IO server listening on port ${port}`);
  }

  /**
   * @description Inizializza i comandi alle nuove connessioni
   */
  private registerCommands() {
    this.io.on("connection", (socket: io.Socket) => {
      Logger.info("Client connected", {
        id: socket.id,
        address: socket.handshake.address
      });

      this.disconnect$ = fromEvent(socket, "disconnect")
        .pipe(first());

      this.disconnect$.subscribe({
        next: (x) => {
          Logger.info("Client disconnected", {client: socket.handshake.address});
        }
      });

      this.commands.forEach((command: ICommand) => {
        fromEvent(socket, command.commandName)
          .pipe(takeUntil(this.disconnect$))
          .subscribe({
            next: (x: any) => {
              let fn: Function = null;
              let values: Array<any> = null;
              if (Array.isArray(x)) {
                if (typeof x[x.length - 1] === "function") {
                  fn = x.pop();
                }
                values = x;
              } else {
                if (typeof x === "function") {
                  fn = x;
                } else {
                  values = [x];
                }
              }
              command.exec(values, socket, fn);
            }
          });
      });
    });
  }

  /**
   * @description Inizializza un comando sui socket già aperti
   * @param command Comando da aggiungere
   */
  private applyCommand(command: ICommand) {
    const sockets = this.io.sockets.sockets;
    for (const id of Object.keys(sockets)) {
      fromEvent(sockets[id], command.commandName)
        .pipe(
          takeUntil(this.disconnect$)
        )
        .subscribe({
          next: (x: any) => {
            let fn: Function = null;
            let values: Array<any> = null;
            if (Array.isArray(x)) {
              if (typeof x[x.length - 1] === "function") {
                fn = x.pop();
              } else {
                values = x;
              }
            } else {
              if (typeof x === "function") {
                fn = x;
              } else {
                values = [x];
              }
            }
            command.exec(values, sockets[id], fn);
          }
        });
    }
  }
}

export default Rover;
