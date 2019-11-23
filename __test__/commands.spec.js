const GridCommand = require('../src/commands/grid.command').default;
const HistoryCommand = require('../src/commands/history.command').default;
const PositionCommand = require('../src/commands/position.command').default;
const MoveCommand = require('../src/commands/move.command').default;
const UnodCommand = require('../src/commands/undo.command').default;
const Grid = require('../src/Grid').default;
const Rover = require('../src/entities/Rover').default;
const Directions = require('../src/interfaces/Direction').default;
const Obstacle = require('../src/entities/Obstacle').default;
const io = require('socket.io-client');

const GRID_COLS = 10;
const GRID_ROWS = 10;
const OBSTACLES =  0;
const INITIAL_X =  4;
const INITIAL_Y =  4;
const DIRECTION =  Directions.South;
const INITIAL_PORT = 3334;

let g,r,c;

beforeEach(() => {
  g = new Grid(GRID_COLS, GRID_ROWS, OBSTACLES);
  r = new Rover(INITIAL_X, INITIAL_Y, DIRECTION, g);
  r.listen(INITIAL_PORT);
  c = io(`http://localhost:${INITIAL_PORT}`, {
    autoConnect: false
  });
  c.connect();
});

afterEach(() => {
  r.close();
  c.disconnect();
  g = null;
})

describe("Grid command", () => {
  it('grid exec should return the grid infos', (done) => {
    const command = new GridCommand(r);

    command.exec(null,null, (grid) => {
      expect(grid).toMatchObject({
        rows: GRID_ROWS,
        cols: GRID_COLS,
        obstacles: []
      });
      done();
    })
  })
});

describe("Move command", () => {
  it("move lf should rotate left and move forward", (done) => { 
    r.addCommand(MoveCommand);
    
    c.emit("move", "lf")
    setTimeout(() => {
      expect(r.position.direction).toBe(1);
      expect(r.position.x).toBe(INITIAL_X + 1);
      done();
    }, 250)
  });
  it("move rf should rotate right and move forward", (done) => {
    r.addCommand(MoveCommand);
    c.emit("move", "rf");
    setTimeout(() => {
      expect(r.position.direction).toBe(3);
      expect(r.position.x).toBe(INITIAL_X - 1);
      done();
    }, 250)
  })
  it("move b should move backward", (done) => {
    r.addCommand(MoveCommand);
    c.emit("move", "b");
    setTimeout(() => {
      expect(r.position.y).toBe(INITIAL_Y -1);
      done();
    }, 250)
  })

  it('shouldn\'t move if there is an obstacle', (done) => {
    r.addCommand(MoveCommand);
    g.set(INITIAL_X, INITIAL_Y+1, new Obstacle(INITIAL_X, INITIAL_Y+1));
    c.emit("move","f")
    c.on('notify', (msg) => {
      expect(msg).toBe('Collision detected')
    })
    setTimeout(() => {
      expect(r.position.y).toBe(INITIAL_Y);
      done();
    }, 250)
  })

})

describe("Position command", () => {
  it('should return rover position', (done) => {
    const command = new PositionCommand(r);
    command.exec(null, null, (position) => {
      expect(position).toMatchObject({
        x:INITIAL_X,
        y:INITIAL_Y,
        direction: Directions.South
      });
      done()
    })
  })

  it("should notofiy the change of position", (done) => {
    r.addCommand(MoveCommand);
    r.addCommand(PositionCommand);
    c.emit("move", "l");
    c.on("position_update", position => {
      expect(position).toMatchObject({
        x: INITIAL_X,
        y: INITIAL_Y,
        direction: Directions.East
      })
      done();
    }) 
    
  })
});

describe("History command", () => {
  it('should return the history', (done) => {
    r.addCommand(MoveCommand);
    r.addCommand(HistoryCommand);
    c.emit('move', 'lf');
    setTimeout(() => {
      c.emit('history', history => {
        expect(history[0].name).toBe("Rotated left");
        expect(history[1].name).toBe("Moved forward");
        done();
      })
    }, 250)
  });

  it("should notify history changes", (done) => {
    r.addCommand(MoveCommand);
    r.addCommand(HistoryCommand);
    c.on('history_update', history => {
      expect(history[0]).toBe('Moved forward');
      done();
    })
    c.emit('move', 'f');
  })
})

describe("Undo command", () => {
  it("should reverse the last n moves", (done) => {
    r.addCommand(MoveCommand);
    r.addCommand(UnodCommand);
    c.emit('move', 'lf');
    setTimeout(() => c.emit('undo', 2), 150);
    setTimeout(() => {
      expect(r.position).toMatchObject({
        x: INITIAL_X,
        y: INITIAL_Y,
        direction: Directions.South
      })
      done()
    }, 250)
  })
})