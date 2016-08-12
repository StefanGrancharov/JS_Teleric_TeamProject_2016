
function preStart(){

    //clearing start window
    var startWindow = document.getElementById('start-window');
    startWindow.className = "hide";

    'use strict';

    // Create the canvas
    var canvasPlayer = document.getElementById('player-canvas');
    var ctx = canvasPlayer.getContext('2d');

    // ID for the player, might not be necessary
    var globalID = 0;

    //Load sound effects
    var beepOnEatenCookie = new Audio(),
        onEndOfTheGame = new Audio();
    beepOnEatenCookie.src = "sound/beep.mp3";
    onEndOfTheGame.src = "sound/nom.mp3";


    //Using input names 
    var player1Name = document.getElementById('Player1').value,
        player2Name = document.getElementById('Player2').value;

    
    // Class to create instance of players
    function createPlayer(x, y, r, s, keys) {
        ++globalID;

        return {
            name: "player" + globalID,
            x: x,
            y: y,
            r: r,
            speed: s,
            cookiesEaten: 0,
            keyDirections: keys,
            visualize: function (color) {
                drawCircle(this.x, this.y, this.r, color);
            }
        };
    }
    // Function to draw circles
    function drawCircle(x, y, r, color) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    }

    //Create the two players
    var playerOne = createPlayer(((canvasPlayer.width / 3) * 1), (canvasPlayer.height / 2), 50, 10, [37, 38, 39, 40]);
    var playerTwo = createPlayer(((canvasPlayer.width / 3) * 2), (canvasPlayer.height / 2), 50, 10, [65, 87, 68, 83]);

    var playerOneImg = document.getElementById("player-one"),
        playerTwoImg = document.getElementById("player-two");

    //Event Listeners
    window.addEventListener("keydown", keysPressed, false);
    window.addEventListener("keyup", keysReleased, false);

    var keys = [];

    function keysPressed(e) {
        // store an entry for every key pressed
        keys[e.keyCode] = true;

        // prevent default browser behavior
        e.preventDefault();
    }

    function keysReleased(e) {
        // mark keys that were released
        keys[e.keyCode] = false;
    }

    //Function to update the coordinates
    function updateCoordinates(player) {


        //37 l, 38 u, 39 r, 40 d;  65 l, 87 u, 68 r, 83 d
        if (keys[player.keyDirections[0]]) { // Player holding left
            player.x -= player.speed;
        }
        if (keys[player.keyDirections[1]]) { // Player holding up
            player.y -= player.speed;
        }
        if (keys[player.keyDirections[2]]) { // Player holding right
            player.x += player.speed;
        }
        if (keys[player.keyDirections[3]]) { // Player holding down
            player.y += player.speed;
        }
        CollidingWithWalls(player);
    }

    //*****************************************************************

    //Function that calculates distance between two objects on the playground
    function calculateDistances(player, otherObject) {
    

        var distance = Math.sqrt((player.x - otherObject.x) * (player.x - otherObject.x) +
            (player.y - otherObject.y) * (player.y - otherObject.y));

        return distance;
    }

    //Colliding with other Player (eating the player)
    function isPlayerCollidingWithOtherPlayer(player1, player2) {
        var distance = calculateDistances(player1, player2);
        return distance <= Math.abs(player1.r - player2.r + 14);
    }

    //Colliding with other consumeables ( Cookies )
    function isPlayerCollidingWithOtherObject(player, otherObject) {       
        var distance = calculateDistances(player, otherObject);
        return distance <= Math.abs(player.r + otherObject.r - 10);
    }



    function CollidingWithCookies(player, cookies) {
        cookies.forEach(function (cookie, index) {
            if (isPlayerCollidingWithOtherObject(player, cookie)) {
                cookieContext.clearRect(cookie.x, cookie.y, cookie.r, cookie.r);
                cookies.splice(index, 1);
                player.r += 1;
                player.cookiesEaten += 1;
                if (player.speed > 2) {
                    player.speed > 7 ? (player.speed -= 0.3) : (player.speed -= 0.1);
                }
                beepOnEatenCookie.play();
            }
        });
    }
    function CollidingWithWalls(player) {

        //checking future coordinates
        if (player.x - player.r < 0 || player.x + player.r > canvasPlayer.width ||
            player.y - player.r < 0 || player.y + player.r > canvasPlayer.height) {

            if (0 + player.r >= player.x) {
                player.x += player.speed;
            }
            if (0 + player.r >= player.y) {
                player.y += player.speed;
            }
            if (canvasPlayer.width - player.r <= player.x) {
                player.x -= player.speed;
            }
            if (canvasPlayer.height - player.r <= player.y) {
                player.y -= player.speed;
            }
        }
        else {
            return;
        }
    }


    //creating cookies
    function createCookie(options) {
        var cookie = {
            context: options.context,
            x: options.x,
            y: options.y,
            r: options.r
        };

        return cookie;
    }

    //new canvas layer for the cookies
    var cookieCanvas = document.getElementById("balls-canvas"),
        cookieContext = cookieCanvas.getContext("2d");

    var cookies = [];

    var cookieImg = document.getElementById("cookie-food");

    //counting frames to spawn new cookie
    var spawnCookieCountFrames = 0;


    var firstPlayerScore = document.getElementById("score-table").firstElementChild.nextElementSibling,
        secondPlayerScore = document.getElementById("score-table").lastElementChild;

    //side timer for game
    var seconds = +0;
    window.setInterval(function timer() {
        seconds += 1;
    }, 1000);
    var gameTimer = document.getElementById("timer").firstElementChild;



    //GameLoops
    function gameLoop() {

        ctx.clearRect(0, 0, canvasPlayer.width, canvasPlayer.height);
        ctx.beginPath();

        //In this function is updating the coordinates of the players

        updateCoordinates(playerOne);
        updateCoordinates(playerTwo);


        playerOne.visualize("orange");
        playerTwo.visualize("green");

        ctx.drawImage(playerOneImg, playerOne.x - playerOne.r, playerOne.y - playerOne.r,
            playerOne.r *2, playerOne.r * 2);

        ctx.drawImage(playerTwoImg, playerTwo.x - playerTwo.r, playerTwo.y - playerTwo.r,
            playerTwo.r * 2, playerTwo.r * 2);

        //Spawning cookies after 30 frames
        spawnCookieCountFrames += 1;
        if (spawnCookieCountFrames > 30) {
            var cookie = createCookie({
                context: cookieContext,
                x: Math.random() * (cookieCanvas.width - 40),
                y: Math.random() * (cookieCanvas.height - 40),
                r: 40
            });
            cookieContext.beginPath();

            cookieContext.drawImage(cookieImg, cookie.x, cookie.y,
                cookie.r, cookie.r);

            //Adding every spawn cookie to an array
            cookies.push(cookie);

            spawnCookieCountFrames = 0;
        }
        //Refreshing Timer
        gameTimer.innerHTML = "Timer: " + seconds + " seconds";

        //Are player colliding with cookies
        CollidingWithCookies(playerOne, cookies);
        firstPlayerScore.innerHTML = player1Name + ": " + playerOne.cookiesEaten;
        CollidingWithCookies(playerTwo, cookies);
        secondPlayerScore.innerHTML = player2Name + ": " + playerTwo.cookiesEaten;


        var elementToShowWinner = document.getElementById("show-winner");
        var restartButton = document.getElementById("restart-game");

        restartButton.addEventListener("click", function () {
            window.location.href = "index.html";
            
        }, false);

        //Are player colliding with other player
        if (isPlayerCollidingWithOtherPlayer(playerOne, playerTwo)) {
            onEndOfTheGame.play();
            if (playerOne.r > playerTwo.r) {
                //player one winner
                ctx.clearRect(0, 0, canvasPlayer.width, canvasPlayer.height);
                cookieContext.clearRect(0, 0, cookieCanvas.width, cookieCanvas.height);
                elementToShowWinner.firstElementChild.innerHTML += player1Name;
                elementToShowWinner.lastElementChild.innerHTML += playerOne.cookiesEaten;
                elementToShowWinner.style.display = "block";
                elementToShowWinner.appendChild(playerOneImg);
                elementToShowWinner.appendChild(restartButton);
                playerOneImg.style.display = "inline-block";
                restartButton.style.display = "inline-block";
                
                return;
            } else if (playerOne.r < playerTwo.r) {
                //player two winner
                ctx.clearRect(0, 0, canvasPlayer.width, canvasPlayer.height);
                cookieContext.clearRect(0, 0, cookieCanvas.width, cookieCanvas.height);
                elementToShowWinner.firstElementChild.innerHTML += player2Name;
                elementToShowWinner.lastElementChild.innerHTML += playerTwo.cookiesEaten;
                elementToShowWinner.style.display = "block";
                elementToShowWinner.appendChild(playerTwoImg);
                elementToShowWinner.appendChild(restartButton);
                playerTwoImg.style.display = "inline-block";
                restartButton.style.display = "inline-block";
                
                
                return;
            } else {
                // Verify that two players not going over each other
            }
        }

        //Deciding winner depending on timer
        if (seconds >= 120) {
            ctx.clearRect(0, 0, canvasPlayer.width, canvasPlayer.height);
            cookieContext.clearRect(0, 0, cookieCanvas.width, cookieCanvas.height);

            if (playerOne.cookiesEaten > playerTwo.cookiesEaten) {
                elementToShowWinner.firstElementChild.innerHTML += player1Name;
                elementToShowWinner.lastElementChild.innerHTML += playerOne.cookiesEaten;
                elementToShowWinner.style.display = "block";
                elementToShowWinner.appendChild(playerOneImg);
                elementToShowWinner.appendChild(restartButton);
                playerOneImg.style.display = "inline-block";
                restartButton.style.display = "inline-block";
            } else if (playerOne.cookiesEaten < playerTwo.cookiesEaten) {
                elementToShowWinner.firstElementChild.innerHTML += player2Name;
                elementToShowWinner.lastElementChild.innerHTML += playerTwo.cookiesEaten;
                elementToShowWinner.style.display = "block";
                elementToShowWinner.appendChild(playerTwoImg);
                elementToShowWinner.appendChild(restartButton);
                playerTwoImg.style.display = "inline-block";
                restartButton.style.display = "inline-block";
            } else {
                elementToShowWinner.firstElementChild.innerHTML = "It's a draw";
                elementToShowWinner.lastElementChild.innerHTML += playerTwo.cookiesEaten;
                elementToShowWinner.appendChild(restartButton);
                elementToShowWinner.style.display = "block";
                restartButton.style.display = "inline-block";
            }
            return;
        }

        ctx.closePath();

        window.requestAnimationFrame(gameLoop);
    }

    gameLoop();

}