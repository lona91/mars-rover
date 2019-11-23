import {from} from 'rxjs';
import {filter} from 'rxjs/operators';

import Command from '../interfaces/Command';
import Rover from '../entities/Rover';
import CommandResponse from '../interfaces/CommandResponse';
import Position from '../interfaces/Position';
import { Socket } from 'socket.io';

const allowed_commands = ["l","r","b","f"]
const direction_movements = [[0, -1], [1, 0], [0, 1], [-1, 0]];

class MoveCommand implements Command{
  rover:Rover;
  static command_name='move';
  command_name='move';
  
  constructor(rover:Rover) {
    this.rover = rover;
  }
  exec(value:any, socket?:Socket, callback?:Function): CommandResponse | void {
    const {rover} = this;
    const [c, noHistory] = value;
    from(c.split(''))
      .pipe(
        filter((command:string) => allowed_commands.indexOf(command) !== -1)
      )
      .subscribe({
        next: (x) => {
          switch (x) {
            case 'l':
              rover.position.direction = rover.position.direction === 0 ? 3 : rover.position.direction - 1;
              if(!noHistory) {
                rover.history.push({
                  name: "Rotated left",
                  undo: () => this.exec(['r', true])
                });
              }
              break;
            case 'r':
              rover.position.direction = (rover.position.direction + 1) % 4;
              if(!noHistory) {
                rover.history.push({
                  name: "Rotated right",
                  undo: () => this.exec(['l', true])
                });
              }
              break;
            case 'f':
              const deltaF = direction_movements[rover.position.direction];
              const newPositionF:Position = rover.grid.normalize({
                x: rover.position.x + deltaF[0],
                y: rover.position.y + deltaF[1]
              });
              if (rover.grid.isOccupied(newPositionF.x, newPositionF.y)) {
                
                socket.emit('notify', 'Collision detected');
                return
              }
              rover.position.x = newPositionF.x;
              rover.position.y = newPositionF.y;
              if(!noHistory) {

                rover.history.push({
                  name: "Moved forward",
                  undo: () => this.exec(['b', true])
                });
              }
              break;
            case 'b':
              const deltaB = direction_movements[rover.position.direction].map(i => -i);
              const newPositionB:Position = rover.grid.normalize({
                x: rover.position.x + deltaB[0],
                y: rover.position.y + deltaB[1]
              });
              if (rover.grid.isOccupied(newPositionB.x, newPositionB.y)) {
                socket.emit('notify', 'Collision detected');
                return
              }
              rover.position.x = newPositionB.x;
              rover.position.y = newPositionB.y;
              if(!noHistory) {

                rover.history.push({
                  name: "Moved backward",
                  undo: () => this.exec(['f', true])
                });
              }
              break;
          }
        }
      })
  }
}

export default MoveCommand;