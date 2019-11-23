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

class Rover implements IEntity {
  @observable public position: IPosition;
  public solid: boolean;
  public grid: Grid;
  public io: io.Server;
  @observable public history: Array<ICommandResponse>;
  @observable private commands: Array<ICommand>;
  private disconnect$: Observable<unknown>;

  constructor(x: number, y: number, direction: IDirection, grid: Grid) {
    this.position = {x, y, direction};
    this.solid = true;
    this.grid = grid;
    this.commands = [];
    this.history = [];

    this.io = io();

    this.registerCommands();
  }

  @action public addCommand(Command: ICommandClass) {
    if (this.commands.find((item: ICommand) => item.commandName === Command.commandName)) return;
    const c = new Command(this);
    this.commands.push(c);
    this.applyCommand(c);
  }

  @action public removeCommand(command: ICommandClass) {
    this.commands = this.commands.filter((item: ICommand) => item.commandName !== command.commandName);
    for (const id of Object.keys(this.io.sockets.sockets)) {
      this.io.sockets.sockets[id].removeAllListeners(command.commandName);
    }
  }

  public close(callback: () => void = () => {}): void {
    if (this.io) this.io.close(callback);
  }

  public listen(port: number): void {
    this.io.listen(port);
    Logger.info(`Socket.IO server listening on port ${port}`);
  }

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
