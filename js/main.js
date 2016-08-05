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
            radius: r,
            speed: s,
            visualize: function () {
                drawCircle(this.x, this.y, this.radius);
            }
        };
    }
// Function to draw circles
    function drawCircle(x, y, radius) {
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'yellow';
        ctx.fill();

    }
//Create the two players
    var playerOne = createPlayer(((canvasPlayer.width / 3) * 1), (canvasPlayer.height / 2), 50, 5);
    var playerTwo = createPlayer(((canvasPlayer.width / 3) * 2), (canvasPlayer.height / 2), 50, 5);

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

//GameLoops
    function gameLoop() {

        ctx.clearRect(0, 0, canvasPlayer.width, canvasPlayer.height);
        ctx.beginPath();

       
        updateCoordinates(1); //this might need a chnage

        playerOne.visualize();
        playerTwo.visualize();
        ctx.closePath();

        window.requestAnimationFrame(gameLoop);
    }
    gameLoop();

});