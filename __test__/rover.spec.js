const Rover = require('../src/entities/Rover').default;
const Grid = require('../src/Grid').default;
const PositionCommand = require('../src/commands/position.command').default;
const HistoryCommand = require('../src/commands/history.command').default;
const io = require('socket.io-client');

const DEFAULT_COLS = 20;
const DEFAULT_ROWS = 20;
const DEFAULT_OBS = 0;
const DEFAULT_PORT = 3333;
const INITIAL_POSITION = {
  x: 5,
  y: 4,
  direction:2
}


let c,g,r;
beforeAll(() => {
  c = io(`http://localhost:${DEFAULT_PORT}`, {
    autoConnect:false
  });
  g = new Grid(DEFAULT_ROWS, DEFAULT_COLS, DEFAULT_OBS);
  r = new Rover(INITIAL_POSITION.x, INITIAL_POSITION.y, INITIAL_POSITION.direction, g);  
  r.addCommand(PositionCommand);
  r.listen(DEFAULT_PORT);
  c.connect();

})
afterAll(() => {
  c.disconnect();
  r.close();
  g = null;
})

  

describe('Rover', () => {
  it ("Should be solid", () => {
    expect(r.solid).toBeTruthy();
  });

  it('should start at the described position', () => {
    expect(r.position.x).toBe(INITIAL_POSITION.x);
    expect(r.position.y).toBe(INITIAL_POSITION.y);
    expect(r.position.direction).toBe(INITIAL_POSITION.direction);
  });

  it("addCommand() should add a new io listener", (done) => {
    c.emit('position', (data) => {
      expect(data).toBeDefined();
      done();
    });
  });

  it("addCommand() should add listener dynamically", (done) => {
    r.addCommand(HistoryCommand);
    c.emit('history', (data) => {
      expect(data).toBeDefined();
      done();
    });
  })

  it("removeCommand() should remove a listener ", (done) => {
    const mock = jest.fn();
    r.removeCommand(HistoryCommand);
    c.emit('history', mock);
    setTimeout(() => {
      expect(mock).not.toBeCalled();
      done();
    },500)
  })

  it("should execute command with any parameter", (done) => {
    const p = [];
    const mock = jest.fn();
    p.push(new Promise((resolve, reject) => {
      c.emit('position', ['a', 'b'], () => {
        mock();
        resolve();
      })
    }));

    p.push(new Promise((resolve, reject) => {
      c.emit('position', 'a', 'b', () => {
        mock();
        resolve();
      });
    }));

    c.emit('position');

    p.push(new Promise((resolve, reject) => {
      c.emit('position', () => {
        mock();
        resolve();
      });
    }));

    Promise.all(p).then(() => {
      expect(mock).toBeCalledTimes(3);
      done();
    });

  });

  it('close() should close the socket', (done) => {
    const mock = jest.fn();
    c.on('disconnect', mock)
    r.close();

    setTimeout(() => {
      expect(mock).toBeCalled();
      done();
    },1000)
  })

})