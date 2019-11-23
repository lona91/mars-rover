import Rover from "../entities/Rover";
import CommandResponse from "./CommandResponse";
import { Socket } from "socket.io";

export interface ICommandClass {
  commandName: string;
  new (rover: Rover): ICommand;
}

export default interface ICommand {
  commandName: string;
  exec: (value: any, socket?: Socket, callback?: Function) => CommandResponse | void;
}
