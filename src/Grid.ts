import { observable } from 'mobx';
import * as seedrandom from 'seedrandom';

import Entity from './interfaces/Entity';
import Obstacle from './entities/Obstacle';
import Position from './interfaces/Position';

class Grid {
  ROWS:number;
  COLS:number;
  @observable grid:Array<Array<Entity>>;
  obstacles: Array<Entity>;


  constructor(rows:number, cols:number, numberOfObstacles:number = 10, seed?:string) {
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

  get size():number {
    return this.COLS * this.ROWS;
  }

  get(x:number, y:number):Entity|undefined {
    return this.grid[x][y];
  }
  set(x:number, y:number, entity:Entity):void {
    this.grid[x][y] = entity;
  }
  clear(x:number, y:number):void {
    this.grid[x][y] = undefined;
  }

  isOccupied(x:number, y:number):boolean {
    const e = this.get(x,y);
    if(!e || !e.solid) return false;

    return true;
  }

  generateRandomObstacles(numberOfObstacles:number = 10):void {
    for (let i = 0; i < numberOfObstacles; i++) {
      let x = Math.floor(Math.random() * this.ROWS);
      let y = Math.floor(Math.random() * this.COLS);
      while (this.grid[x][y]) {
        x = Math.floor(Math.random() * this.ROWS);
        y = Math.floor(Math.random() * this.COLS);
      }
      const obstacle = new Obstacle(x, y);
      this.obstacles.push(obstacle)
      this.grid[x][y] = obstacle;
    }
  }

  normalize(position:Position) {
    position.x = position.x < 0 ? this.ROWS + position.x : position.x % this.ROWS;
    position.y = position.y < 0 ? this.COLS + position.y : position.y % this.COLS;
    position.direction = position.direction;
    return position;
  }

  getRandomEmpty():Position {
    let x = Math.floor(Math.random() * this.ROWS);
    let y = Math.floor(Math.random() * this.COLS);
    while (this.isOccupied(x, y)) {
      x = Math.floor(Math.random() * this.ROWS);
      y = Math.floor(Math.random() * this.COLS);
    }
    return {x,y};
  }

  toString():string {
    let out = '';
    for (let c = 0; c < this.COLS; c++) {
      for (let r = 0; r < this.ROWS; r++) {
        const entity = this.get(r,c);
        if (!entity) {
          out += `[${r},${c}]`;
        } else {
          out += entity.toString();
        }
      }
      out += '\n';
    }
    return out;
  }
}

export default Grid;