const gameSurface = document.getElementById("game-screen")
gameSurface.width = gameSurface.height = 500
const ctx = gameSurface.getContext("2d")

let snake = [{x:gameSurface.width/2, y:gameSurface.height/2}]
let foodx = Math.random()*gameSurface.width
let foody = Math.random()*gameSurface.height
let score = 0
let speed = 20

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
    ctx.arc(foodx, foody, 10, 0, Math.PI * 2)
    ctx.fillStyle = "red";
    ctx.fill()
    for (let i=0;i<snake.length;i++)
    {
        ctx.beginPath()
        ctx.arc(snake[i].x, snake[i].y, 10, 0, Math.PI * 2);
        ctx.fillStyle = "blue";
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
            if(snake[0].y<=5) snake[0].y = gameSurface.height-5
        }
        else if(direcion == "down")
        {
            snake[0].y+=speed;
            if(snake[0].y>=gameSurface.height-5) snake[0].y = 5
        }
        else if(direcion == "right")
        {
            snake[0].x+=speed
            if(snake[0].x>=gameSurface.width-5) snake[0].x = 5
        }
        else
        {
            snake[0].x-=speed
            if(snake[0].x<=5) snake[0].x = gameSurface.width - 5
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
        console.log(currentmove)
    }
    let xdis = Math.abs(foodx - snake[0].x);
    let ydis = Math.abs(foody - snake[0].y);
    if((xdis*xdis) + (ydis*ydis) <= 400)
    {
        score++;
        document.getElementById("score-value").textContent = score;
        document.getElementById("best-score").textContent = Math.max(score, document.getElementById("best-score").textContent);
        document.getElementById("snake-length").textContent = snake.length;
        foodx = Math.random()*500;
        foody = Math.random()*500;
        snake.push({x:snake.at(-1).x, y:snake.at(-1).y+20});
        console.log(snake);
    }
    requestAnimationFrame(gameloop)
}

gameloop()