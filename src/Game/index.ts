import { GAME_TABLE_X, GAME_TABLE_Y, BG_COLOR, M_COLOR, SM_COLOR, SECOND } from "./consts";
import { carMask } from "./gameTypes";
import Fabric from "./Fabric";

const randomInteger = (min: number, max: number): number => {
    const rand: number = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

export const startGame = (ctx: any, width: number, height: number, controls: any): void => {
    let timerId;
    let paused: boolean = false;
    let distanceFromPreciousEnemy = 0;
    let speed: number = 8;
    const cellSizeW: number = Math.floor(width / 20);
    const cellSizeH: number = Math.floor(height / 20);
    const fabric: Fabric = new Fabric();
    fabric.spawnPlayer(3, 15);
    fabric.spawnEnemyCar(5, 3);
    const gameLoop = () => {
        distanceFromPreciousEnemy += 1;
        ctx.fillStyle = BG_COLOR;
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = SM_COLOR;
        ctx.fillStyle = SM_COLOR;
        for (let x = 0; x < GAME_TABLE_X; x++) {
            for (let y = 0; y < GAME_TABLE_Y; y++) {
                ctx.strokeRect(x * cellSizeW, y * cellSizeH, cellSizeW, cellSizeH);
                ctx.fillRect(x * cellSizeW + 5, y * cellSizeH + 5, cellSizeW - 10, cellSizeH - 10)
            }
        }
        ctx.strokeStyle = M_COLOR;
        ctx.fillStyle = M_COLOR;
        const player = fabric.player;
        const pMask = player.mask;
        for (let x = 0; x < pMask.length; x++) {
            for (let y = 0; y < pMask[x].length; y++) {
                if (pMask[x][y] === 1) {
                    const nx = x + player.x;
                    const ny = y + player.y;
                    ctx.strokeRect(nx * cellSizeW, ny * cellSizeH, cellSizeW, cellSizeH);
                    ctx.fillRect(nx * cellSizeW + 5, ny * cellSizeH + 5, cellSizeW - 10, cellSizeH - 10)
                }
            }
        }
        for (const enemy of fabric.enemies) {
            const { mask, x, y } = enemy;
            for (let sx = 0; sx < mask.length; sx++) {
                for (let sy = 0; sy < mask[sx].length; sy++) {
                    if (mask[sx][sy] === 1) {
                        const nx = sx + x;
                        const ny = sy + y;
                        ctx.strokeRect(nx * cellSizeW, ny * cellSizeH, cellSizeW, cellSizeH);
                        ctx.fillRect(nx * cellSizeW + 5, ny * cellSizeH + 5, cellSizeW - 10, cellSizeH - 10)
                    }
                }
            }
            if (player.isBeenHit(enemy)) {
                paused = true;
                console.log("hit!")
            }
            if (enemy.y > GAME_TABLE_Y) {
                fabric.removeEnemy(enemy);
            }
            enemy.move(x, y + 1);
        }
        if (distanceFromPreciousEnemy > 11) {
            const x = randomInteger(1, 10 - 4);
            const y = 0;
            fabric.spawnEnemyCar(x, y);
            distanceFromPreciousEnemy = 0;
        }
        player.move(controls.positionX, player.y);
        if (controls.space) {
            paused = !paused;
        }
        if (!paused) {
            timerId = setTimeout(gameLoop, SECOND / (speed * 2));
        }
    }
    timerId = setTimeout(gameLoop, SECOND / speed);
}