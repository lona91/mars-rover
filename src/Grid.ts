import { observable } from "mobx";
import * as seedrandom from "seedrandom";

import IEntity from "./interfaces/Entity";
import IPosition from "./interfaces/Position";
import Obstacle from "./entities/Obstacle";

class Grid {
  public ROWS: number;
  public COLS: number;
  @observable public grid: Array<Array<IEntity>>;
  public obstacles: Array<IEntity>;

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

  get size(): number {
    return this.COLS * this.ROWS;
  }

  public get(x: number, y: number): IEntity | undefined {
    return this.grid[x][y];
  }

  public set(x: number, y: number, entity: IEntity): void {
    this.grid[x][y] = entity;
  }

  public clear(x: number, y: number): void {
    this.grid[x][y] = undefined;
  }

  public isOccupied(x: number, y: number): boolean {
    const e = this.get(x, y);
    if (!e || !e.solid) return false;

    return true;
  }

  public normalize(position: IPosition): IPosition {
    position.x = position.x < 0 ? this.ROWS + position.x : position.x % this.ROWS;
    position.y = position.y < 0 ? this.COLS + position.y : position.y % this.COLS;
    position.direction = position.direction;
    return position;
  }

  public getRandomEmpty(): IPosition {
    let x = Math.floor(Math.random() * this.ROWS);
    let y = Math.floor(Math.random() * this.COLS);
    while (this.isOccupied(x, y)) {
      x = Math.floor(Math.random() * this.ROWS);
      y = Math.floor(Math.random() * this.COLS);
    }
    return {x, y};
  }

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
