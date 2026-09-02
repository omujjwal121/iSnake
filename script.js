const gameSurface = document.getElementById("game-screen")
gameSurface.width = gameSurface.height = 500
const ctx = gameSurface.getContext("2d")

let best_score_yet = localStorage.getItem("best_score");
if(best_score_yet == null) best_score_yet = 0;
document.getElementById("snake-length").textContent = 1;
document.getElementById("snake-speed").textContent = 1;
document.getElementById("best-score").textContent = best_score_yet;

function round_random()
{
    let val = Math.random()*gameSurface.width;
    val = Math.floor(val);
    let rem = val % 20;
    if(rem == 10) return val;
    else if(rem < 10) return val+10-rem;
    return val-rem+10;
}

let snake = [{x:250, y:250}];
let foodx = round_random();
let foody = round_random();
console.log(foodx);
let score = 0;
let speed = 20;
let cell_size = 10;

let lastmove = 0;
let play = true
let collison = false
let direcion = "up"

function handlekeypress(event)
{
    if(event.code == "Space") play = !play;
    if(event.code == "ArrowUp" && direcion != "down") direcion = "up";
    if(event.code == "ArrowDown" && direcion != "up") direcion = "down";
    if(event.code == "ArrowRight" && direcion != "left") direcion = "right";
    if(event.code == "ArrowLeft" && direcion != "right") direcion = "left";
}

document.addEventListener("keydown", handlekeypress);

function gameloop()
{
    ctx.clearRect(0,0, gameSurface.width, gameSurface.height);
    ctx.fillStyle = "green"
    ctx.fillRect(0,0, gameSurface.height, gameSurface.width)

    ctx.beginPath()
    ctx.strokeStyle = "black";
    ctx.lineWidth = 0.2;
    for(let i=20;i<=490;i+=20)
    {
        ctx.moveTo(0,i);
        ctx.lineTo(500,i);
        ctx.moveTo(i,0);
        ctx.lineTo(i,500);
    }
    ctx.stroke();

    ctx.beginPath()
    ctx.arc(foodx, foody, cell_size, 0, Math.PI * 2)
    ctx.fillStyle = "red";
    ctx.fill()
    for (let i=0;i<snake.length;i++)
    {
        ctx.beginPath()
        ctx.arc(snake[i].x, snake[i].y, cell_size, 0, Math.PI * 2);
        ctx.fillStyle = "#660000";
        ctx.fill()
    }
    currentmove = performance.now();
    
    if (play && currentmove-lastmove >= 200)
    {   
        let lastx = snake[0].x;
        let lasty = snake[0].y;
        if(direcion =="up" )
        {
            snake[0].y-=speed;
            if(snake[0].y<=5) snake[0].y = gameSurface.height-10
        }
        else if(direcion == "down")
        {
            snake[0].y+=speed;
            if(snake[0].y>=gameSurface.height-5) snake[0].y = 10
        }
        else if(direcion == "right")
        {
            snake[0].x+=speed
            if(snake[0].x>=gameSurface.width-5) snake[0].x = 10
        }
        else
        {
            snake[0].x-=speed
            if(snake[0].x<=5) snake[0].x = gameSurface.width - 10
        }
        for(let i=1;i<snake.length;i++) if(snake[i].x == snake[0].x && snake[i].y == snake[0].y) collison = true;
        if(collison) play = false
        for(let i=1;i<snake.length;i++)
        {
            let llastx = snake[i].x
            let llasty = snake[i].y
            snake[i].x = lastx;
            snake[i].y = lasty;
            lastx = llastx;
            lasty = llasty;
        }
        lastmove = currentmove;
        // console.log(currentmove)
    }
    let xdis = Math.abs(foodx - snake[0].x);
    let ydis = Math.abs(foody - snake[0].y);
    if((xdis*xdis) + (ydis*ydis) < 400)
    {
        score++;
        let stored_val = localStorage.getItem("best_score");
        if(stored_val == null) stored_val = 0;
        let best_score = Math.max(score*5, stored_val);
        localStorage.setItem("best_score", best_score);
        document.getElementById("score-value").textContent = score*5;
        document.getElementById("best-score").textContent = localStorage.getItem("best_score");
        console.log(localStorage.getItem("best_score"));
        document.getElementById("snake-length").textContent = snake.length+1;
        document.getElementById("snake-speed").textContent = 1;
        if(direcion == 'down')snake.push({x:snake.at(-1).x, y:snake.at(-1).y-20});
        else snake.push({x:snake.at(-1).x, y:snake.at(-1).y+20});
        foodx = round_random();
        foody = round_random();
        while(snake.includes({x:foodx, y:foody}) == true)          //will it work or not?
        {
            foodx = round_random();
            foody = round_random();
        }
        console.log(snake[0]);
        console.log(foodx);
        console.log(foody);
    }
    requestAnimationFrame(gameloop)
}

gameloop()