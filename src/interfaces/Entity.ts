import Position from "./Position";

/**
 * @description Entità presente sulla griglia
 */
export default interface IEntity {
  /**
   * @description Posizione dell'entità
   */
  position: Position;
  /**
   * @description Specifica se l'entità è solida o no (se può collidere con altre entità)
   */
  solid: boolean;
}
