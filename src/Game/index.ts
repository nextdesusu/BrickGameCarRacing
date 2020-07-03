import { GAME_TABLE, BG_COLOR, M_COLOR, SM_COLOR, SECOND } from "./consts";
import { carMask } from "./gameTypes";
import Fabric from "./Fabric";

export const startGame = (ctx: null | any, width: number, height: number): void => {
    //w = 10
    //h = 20
    //ctx.fillRect(0, 0, width, height);
    let timerId;
    let speed: number = 8;
    const mapY: number = GAME_TABLE[0].length;
    const cellSizeW: number = Math.floor(width / 20);
    const cellSizeH: number = Math.floor(height / 20);
    const fabric: Fabric = new Fabric();
    fabric.spawnPlayer(3, 15);
    fabric.spawnEnemyCar(1, 1);
    fabric.spawnEnemyCar(1, 10);
    const gameLoop = () => {
        ctx.fillStyle = BG_COLOR;
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = SM_COLOR;
        ctx.fillStyle = SM_COLOR;
        for (let x = 0; x < GAME_TABLE.length; x++) {
            for (let y = 0; y < GAME_TABLE[x].length; y++) {
                ctx.strokeRect(x * cellSizeW, y * cellSizeH, cellSizeW, cellSizeH);
                ctx.fillRect(x * cellSizeW + 5, y * cellSizeH + 5, cellSizeW - 10, cellSizeH - 10)
            }
        }
        ctx.strokeStyle = M_COLOR;
        ctx.fillStyle = M_COLOR;
        /*
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
        */
        for (const enemy of fabric.enemies) {
            const { mask, x, y } = enemy;
            enemy.move(x, y + 1);
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
            if (enemy.y > mapY) {
                fabric.removeEnemy(enemy);
            }
        }
        console.log(fabric.enemies);
        //player.move(player.x, player.y - 1);
        //speed += 1;
        timerId = setTimeout(gameLoop, SECOND / speed);
    }
    timerId = setTimeout(gameLoop, SECOND / speed);
}