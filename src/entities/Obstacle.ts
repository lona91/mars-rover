import IEntity from "../interfaces/Entity";
import IPosition from "../interfaces/Position";

class Obstacle implements IEntity {
  public position: IPosition;
  public solid: boolean;

  constructor(x: number, y: number) {
    this.solid = true;
    this.position = {x, y};
  }
}

export default Obstacle;
