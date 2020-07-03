import { carMask } from "./gameTypes";
import Car from "./Car";

const PLAYER_CAR: carMask = [
    [0, 1, 0, 1],
    [1, 1, 1, 0],
    [0, 1, 0, 1]
];

const ENEMY_CAR: carMask = [
    [1, 0, 1, 0],
    [0, 1, 1, 1],
    [1, 0, 1, 0]
];

export default class Fabric {
    player: Car;
    enemies: Array<Car>;
    constructor() {
        this.enemies = []
    }

    spawnEnemyCar(x, y): void {
        const enemy = new Car(ENEMY_CAR, x, y);
        this.enemies.push(enemy);
    }

    removeEnemy(toRemove: Car) {
        this.enemies = this.enemies.filter((enemy) => enemy !== toRemove);
    }

    spawnPlayer(x, y): void {
        const player = new Car(PLAYER_CAR, x, y);
        this.player = player;
    }
}