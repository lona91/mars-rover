const Grid = require('../src/Grid').default;
const Obstacle = require('../src/entities/Obstacle').default;


const DEFAULT_ROWS = 20;
const DEFAULT_COLS = 10;
const DEFAULT_OBST = 14

describe('Grid testing', () => {
  
  let g 
  
  beforeEach(() => {
    g = new Grid(DEFAULT_ROWS, DEFAULT_COLS, DEFAULT_OBST);
  });

  it("get size() should return the total size of the matrix", () => {
    expect(g.size).toBe(DEFAULT_ROWS * DEFAULT_COLS);
  });

  it("should generate DEFAULT_OBST obstacles", () => {
    let count = 0;
    for (let i=0 ; i < g.ROWS; i++) {
      for (let j=0; j < g.COLS; j++) {
        if (g.grid[i][j] instanceof Obstacle) {
          count++
        }
      }
    }

    expect(count).toBe(DEFAULT_OBST);
  });

  it("get(x,y) should retrun the content of the x and y cell", () => {
    expect(g.get(10, 9)).toBe(g.grid[10][9]);
  })

  it("set(x,y,entity) should set the content of the x and y cell", () => {
    const obs = new Obstacle();
    g.set(2,2, obs);
    expect(g.get(2,2)).toBe(obs);
  })

  it("clear(x,y) should remove the content of the x and y cell", () => {
    const obs = new Obstacle();
    g.set(2,2,obs);
    g.clear(2,2);
    expect(g.get(2,2)).toBeUndefined();
  })

  it("isOccupied(x,y) should return the cell contains a solid object", () => {
    g.clear(2,2);
    expect(g.isOccupied(2,2)).toBeFalsy();
    g.set(2,2,new Obstacle());
    expect(g.isOccupied(2,2)).toBeTruthy();
  });

  it("normalize(position) should return a position allowed inside the grid", () => {
    const pos = g.normalize({x: DEFAULT_ROWS*100+39, y:DEFAULT_COLS+49});
    expect(pos.x).toBeLessThan(DEFAULT_ROWS);
    expect(pos.y).toBeLessThan(DEFAULT_COLS);
  });

  it("getRandomEmpty() should return a random cell which is empty", () => {
    const {x,y} = g.getRandomEmpty();
    expect(g.get(x,y)).toBeUndefined();
  });

  it("to String should return string", () => {
    expect(typeof g.toString()).toBe("string");
  });

  it("seed should the randomization should be predictable", () => {
    const g1 = new Grid(DEFAULT_ROWS, DEFAULT_COLS, DEFAULT_OBST, 'test');
    const g2 = new Grid(DEFAULT_ROWS, DEFAULT_COLS, DEFAULT_OBST, 'test');
  
    for (let x = 0; x < g.ROWS; x++) {
      for (let y = 0; y < g.COLS; y++) {
        if (!g1.get(x,y)) {
          expect(g2.get(x,y)).toBeUndefined();
        } else {
          expect(g1.get(x,y)).toMatchObject(g2.get(x,y));
        }
      }
    }
  })

})