import * as io from 'socket.io';
import {fromEvent, Observable} from 'rxjs';
import {first, takeUntil, map, take} from 'rxjs/operators';
import {observable, observe, action} from 'mobx';

import Entity from '../interfaces/Entity';
import Position from '../interfaces/Position';
import Direction from '../interfaces/Direction';
import Command, { CommandClass } from '../interfaces/Command';
import Logger from '../Logger';
import Grid from '../Grid';
import CommandResponse from '../interfaces/CommandResponse';


class Rover implements Entity {
  @observable position:Position;
  solid:boolean;
  io:io.Server;
  grid: Grid;
  @observable commands:Array<Command>
  @observable history: Array<CommandResponse>;
  disconnect$:Observable<unknown>;

  constructor(x:number, y:number, direction:Direction, grid:Grid) {
    this.position = {x,y,direction};
    this.solid = true;
    this.grid = grid;
    this.commands = [];
    this.history = [];

    this.io = io();

    this.registerCommands();
    
  }

  private registerCommands() {
    this.io.on('connection', (socket:io.Socket) => {
      Logger.info('Client connected', {
        id: socket.id,
        address: socket.handshake.address
      });

      this.disconnect$ = fromEvent(socket, 'disconnect')
        .pipe(first());
        
      this.disconnect$.subscribe({
        next: (x) => {
          Logger.info('Client disconnected', {client: socket.handshake.address});
        }
      }); 
            
      this.commands.forEach(command => {
        fromEvent(socket, command.command_name)
          .pipe(takeUntil(this.disconnect$))
          .subscribe({
            next: (x:any) => {
              let fn:Function = null;
              let values:Array<any> = null;
              if (Array.isArray(x)) {
                if (typeof x[x.length-1] === "function") {
                  fn = x.pop();
                }
                values = x
              } else {
                if (typeof x === "function") {
                  fn = x;
                } else {
                  values = [x]
                }
              }
              command.exec(values, socket, fn);
           
            }
          })
      })
    });
  }

  private applyCommand(command:Command) {
    const sockets = this.io.sockets.sockets;
    for (var id in sockets) {
      fromEvent(sockets[id], command.command_name)
        .pipe(
          takeUntil(this.disconnect$)
        )
        .subscribe({
          next: (x: any) => {
            let fn:Function = null;
            let values:Array<any> = null;
            if (Array.isArray(x)) {
              if (typeof x[x.length-1] === "function") {
                fn = x.pop();
              } else {
                values = x
              }
            } else {
              if (typeof x === "function") {
                fn = x;
              } else {
                values = [x]
              }
            }
            command.exec(values, sockets[id], fn);
          }
        });
    }
  } 

  @action addCommand(Command:CommandClass) {
    if (this.commands.find(item => item.command_name === Command.command_name)) return;
    const c = new Command(this)
    this.commands.push(c);
    this.applyCommand(c);
  }

  @action removeCommand(command:CommandClass) {
    this.commands = this.commands.filter(item => item.command_name !== command.command_name);
    for (let id in this.io.sockets.sockets) {
      this.io.sockets.sockets[id].removeAllListeners(command.command_name)
    }
  }
  
  close(callback: () => void = () => {}) {
    if (this.io) this.io.close(callback);
  }
  
  listen(port:number) {
    this.io.listen(port);
    Logger.info(`Socket.IO server listening on port ${port}`)
  }
}

export default Rover;