import Directions from "./Direction";

/**
 * @description Interfaccia rappresentante la posizione di un'unità
 */
export default interface IPosition {
  /**
   * @description coordinata x
   */
  x: number;
  /**
   * @description coordinata y
   */
  y: number;
  /**
   * @description direzione
   */
  direction?: Directions;
}
