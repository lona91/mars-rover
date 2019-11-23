import Entity from '../interfaces/Entity';
import Position from '../interfaces/Position';

class Obstacle implements Entity {
  position: Position;
  solid: boolean;

  constructor(x:number, y:number) {
    this.solid = true;
    this.position = {x, y};
  }
}

export default Obstacle;