import www from './frontend/www';
import Grid from './Grid';
import Rover from './entities/Rover';


import MoveCommand from './commands/move.command';
import UndoCommand from './commands/undo.command';
import GridCommand from './commands/grid.command';
import PositionCommand from './commands/position.command';
import HistoryCommand from './commands/history.command';

const grid = new Grid(10,10);
const randomPosition = grid.getRandomEmpty();
const rover = new Rover(randomPosition.x,randomPosition.y, Math.floor(Math.random() * 3), grid);

rover.addCommand(PositionCommand);
rover.addCommand(HistoryCommand);
rover.addCommand(GridCommand)
rover.addCommand(MoveCommand);
rover.addCommand(UndoCommand);

rover.listen(3000)
www();