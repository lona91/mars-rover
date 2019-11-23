import Rover from "../entities/Rover";
import CommandResponse from "./CommandResponse";
import { Socket } from "socket.io";

export interface CommandClass {
  new (rover:Rover):Command;
  command_name: string;
}

export default interface Command {
  command_name:string;
  rover:Rover;
  exec: (value:any, socket?:Socket, callback?:Function) => CommandResponse | void;
}
