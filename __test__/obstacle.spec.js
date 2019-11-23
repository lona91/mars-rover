const Obstacle = require('../src/entities/Obstacle').default;

describe("Obstacle", () => {
  it('Should be solid', () => {
    const obs = new Obstacle(23,30)
    expect(obs.solid).toBeTruthy();
  })
})