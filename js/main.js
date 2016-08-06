window.addEventListener('load', function() {
    'use strict';

// Create the canvas
    var canvasPlayer = document.getElementById('player-canvas');
    var ctx = canvasPlayer.getContext('2d');

// ID for the player, might not be necessary
    var globalID = 0;

// Class to create instance of players
    function createPlayer(x, y, r, s) {
        ++globalID;

        return {
            name: "player" + globalID,
            x: x,
            y: y,
            r: r,
            speed: s,
            cookiesEaten: 0,
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
    var playerOne = createPlayer(((canvasPlayer.width / 3) * 1), (canvasPlayer.height / 2), 50, 5);
    var playerTwo = createPlayer(((canvasPlayer.width / 3) * 2), (canvasPlayer.height / 2), 50, 5);

    var playerOneImg = document.getElementById("player-one"),
        playerTwoImg = document.getElementById("player-two");

//Players initial score
    var initialScore = 0;

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
    function updateCoordinates(modifier) {

        if (keys[37]) { // Player holding left
            playerOne.x -= playerOne.speed * modifier;
        }
        if (keys[38]) { // Player holding up
            playerOne.y -= playerOne.speed * modifier;
        }
        if (keys[39]) { // Player holding right
            playerOne.x += playerOne.speed * modifier;
        }
        if (keys[40]) { // Player holding down
            playerOne.y += playerOne.speed * modifier;
        }



        if (keys[65]) { // Player holding left
            playerTwo.x -= playerTwo.speed * modifier;
        }
        if (keys[87]) { // Player holding up
            playerTwo.y -= playerTwo.speed * modifier;
        }
        if (keys[68]) { // Player holding right
            playerTwo.x += playerTwo.speed * modifier;
        }
        if (keys[83]) { // Player holding down
            playerTwo.y += playerTwo.speed * modifier;
        }


    }

//Colliding with other objects
function isPlayerCollidingWithOtherObject(player, otherObject){
          var user = {
            x: player.x,
            y: player.y,
            r: player.r
          },
            other = {
              x: otherObject.x,
              y: otherObject.y,
              r: otherObject.r
            };
          var d = Math.sqrt((user.x - other.x) * (user.x - other.x) + 
                            (user.y - other.y) * (user.y - other.y));
          return d <= (user.r + other.r);
}

function CollidingWithCookies(player, cookies) {
    cookies.forEach(function (cookie, index) {
            if(isPlayerCollidingWithOtherObject(player, cookie)){
                cookieContext.clearRect(cookie.x, cookie.y, cookie.r, cookie.r);
                cookies.splice(index, 1);
                player.r += 1;
                player.cookiesEaten += 1;
            }
        });
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

        updateCoordinates(1); //this might need a chnage

        playerOne.visualize("orange");
        playerTwo.visualize("green");

        ctx.drawImage(playerOneImg, playerOne.x - playerOne.r, playerOne.y - playerOne.r,
                        playerOne.r * 2, playerOne.r * 2);
        
        ctx.drawImage(playerTwoImg, playerTwo.x - playerTwo.r, playerTwo.y - playerTwo.r,
                        playerTwo.r * 2, playerTwo.r * 2);
        
        //Spawning cookies after 120 frames
        //No sure if all the cookies will spawn valid
        spawnCookieCountFrames += 1;
        if(spawnCookieCountFrames > 120){
            var cookie = createCookie({
                context: cookieContext,
                x: Math.random() * cookieCanvas.width,
                y: Math.random() * cookieCanvas.height,
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
        firstPlayerScore.innerHTML = "Player 1: " + playerOne.cookiesEaten;
        CollidingWithCookies(playerTwo, cookies);
        secondPlayerScore.innerHTML = "Player 2: " + playerTwo.cookiesEaten;

        //Are player colliding with other player
        if(isPlayerCollidingWithOtherObject(playerOne, playerTwo)){
            var elementToShowWinner = document.getElementById("show-winner");
            if(playerOne.r > playerTwo.r){
                //player one winner
                ctx.clearRect(0, 0, canvasPlayer.width, canvasPlayer.height);
                cookieContext.clearRect(0, 0, cookieCanvas.width, cookieCanvas.height);
                elementToShowWinner.firstElementChild.innerHTML += "Player 1";
                elementToShowWinner.lastElementChild.innerHTML += playerOne.cookiesEaten;
                elementToShowWinner.style.display = "block";
                elementToShowWinner.appendChild(playerOneImg);
                playerOneImg.style.display = "block";
                return;
            } else if(playerOne.r < playerTwo.r){
                //player two winner
                ctx.clearRect(0, 0, canvasPlayer.width, canvasPlayer.height);
                cookieContext.clearRect(0, 0, cookieCanvas.width, cookieCanvas.height);
                elementToShowWinner.firstElementChild.innerHTML += "Player 2";
                elementToShowWinner.lastElementChild.innerHTML += playerTwo.cookiesEaten;
                elementToShowWinner.style.display = "block";
                elementToShowWinner.appendChild(playerTwoImg);
                playerTwoImg.style.display = "inline";
                return;
            } else {
                // if radiuses equal playerOne should cannot go over playerTwo
            }
        }

        ctx.closePath();

        window.requestAnimationFrame(gameLoop);
    }
    gameLoop();

});