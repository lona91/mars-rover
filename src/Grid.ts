import { observable } from "mobx";
import * as seedrandom from "seedrandom";

import IEntity from "./interfaces/Entity";
import IPosition from "./interfaces/Position";
import Obstacle from "./entities/Obstacle";

/**
 * @class Grid
 * @classdesc Griglia 2d rappresentante lo spazio in cui i rover si muovono ed eventuali ostacoli
 */
class Grid {
  /** @description Numero di righe */
  public ROWS: number;
  /** @description Numero di colonne */
  public COLS: number;
  /** @description matrice dello spazio 2d */
  @observable public grid: Array<Array<IEntity>>;
  /** @description array degli elementi in griglia */
  public obstacles: Array<IEntity>;

  /**
   *
   * @constructor
   * @param rows Quantità righe della griglia
   * @param cols Quantità colonne della griglia
   * @param numberOfObstacles Numero di ostacoli
   * @param seed Seed per la randomizzazione
   */
  constructor(rows: number, cols: number, numberOfObstacles: number = 10, seed?: string) {
    this.ROWS = rows;
    this.COLS = cols;
    this.grid = [];
    this.obstacles = [];

    for (let r = 0; r < rows; r++) {
      this.grid[r] = new Array(cols);
    }

    if (seed) {
      seedrandom(seed, {global: true});
    }

    this.generateRandomObstacles(numberOfObstacles);
  }

  /**
   * @description Ritorna la dimensione totale della griglia
   * @returns numero di celle
   */
  get size(): number {
    return this.COLS * this.ROWS;
  }

  /**
   * @description Ritorna il contenuto della cella
   * @param x Riga
   * @param y Colonna
   * @returns Il contenuto della cella
   */
  public get(x: number, y: number): IEntity | undefined {
    return this.grid[x][y];
  }

  /**
   * @description Imposta il contenuto della cella
   * @param x Riga
   * @param y Colonna
   * @param entity Entità da inserire nella cella
   */
  public set(x: number, y: number, entity: IEntity): void {
    this.grid[x][y] = entity;
  }

  /**
   * @description Elimina il contenuto della cella
   * @param x Riga
   * @param y Colonna
   */
  public clear(x: number, y: number): void {
    this.grid[x][y] = undefined;
  }

  /**
   * @description Controlla se la casella è occupata
   * @param x Riga
   * @param y Colonna
   * @returns true se la colonna è occupata, false altrimenti
   */
  public isOccupied(x: number, y: number): boolean {
    const e = this.get(x, y);
    if (!e || !e.solid) return false;

    return true;
  }

  /**
   * @description Trasforma una posizione che può essere out of bound in una posizione valida
   * @param position Posizione iniziale
   * @returns Posizione finale in bound
   */
  public normalize(position: IPosition): IPosition {
    position.x = position.x < 0 ? this.ROWS + position.x : position.x % this.ROWS;
    position.y = position.y < 0 ? this.COLS + position.y : position.y % this.COLS;
    position.direction = position.direction;
    return position;
  }

  /**
   * @description Ritorna una cella vuota a caso
   * @returns Posizione casuale vuota
   */
  public getRandomEmpty(): IPosition {
    let x = Math.floor(Math.random() * this.ROWS);
    let y = Math.floor(Math.random() * this.COLS);
    while (this.isOccupied(x, y)) {
      x = Math.floor(Math.random() * this.ROWS);
      y = Math.floor(Math.random() * this.COLS);
    }
    return {x, y};
  }

  /**
   * @description Ritorna una versione grafica della griglia
   * @returns La griglia in formato stringa
   */
  public toString(): string {
    let out = "";
    for (let c = 0; c < this.COLS; c++) {
      for (let r = 0; r < this.ROWS; r++) {
        const entity = this.get(r, c);
        if (!entity) {
          out += `[${r},${c}]`;
        } else {
          out += entity.toString();
        }
      }
      out += "\n";
    }
    return out;
  }

  /**
   * Genera degli ostacoli casualmente
   * @param numberOfObstacles Numero di ostacoli da generare
   */
  private generateRandomObstacles(numberOfObstacles: number = 10): void {
    for (let i = 0; i < numberOfObstacles; i++) {
      let x = Math.floor(Math.random() * this.ROWS);
      let y = Math.floor(Math.random() * this.COLS);
      while (this.grid[x][y]) {
        x = Math.floor(Math.random() * this.ROWS);
        y = Math.floor(Math.random() * this.COLS);
      }
      const obstacle = new Obstacle(x, y);
      this.obstacles.push(obstacle);
      this.grid[x][y] = obstacle;
    }
  }
}

export default Grid;
