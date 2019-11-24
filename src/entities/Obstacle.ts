import IEntity from "../interfaces/Entity";
import IPosition from "../interfaces/Position";

/**
 * @description Ostacolo base
 */
class Obstacle implements IEntity {

  /**
   * @description Posizione dell'ostacolo
   */
  public position: IPosition;

  /**
   * @description L'ostacolo è solido di default
   */
  public solid: boolean = true;

  /**
   * Crea un'oggetto di tipo ostacolo
   * @param x Coordinata x dell'ostacolo
   * @param y Coordinata y dell'ostacolo
   */
  constructor(x: number, y: number) {
    this.position = {x, y};
  }
}

export default Obstacle;
