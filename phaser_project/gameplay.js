let gamePlayState = function() {

}

let lanes = new Array(4);
//let enemies;

gamePlayState.prototype.gameplay = function() {
    // NOTHING GOES HERE
}

gamePlayState.prototype.create = function() {
    let style = {
        font: "32px Arial",
        fill: "#ffffff",
        align: "center"
    }

    game.add.sprite(0,0, "road");
    game.physics.startSystem(Phaser.Physics.ARCADE);

    let gHeight = game.world.height;
    let buff = 75; // Buffer for "top" of screen (water side of bridge)
    lanes[0] = new Phaser.Point(game.world.width - 200, gHeight - ((gHeight-buff)));
    lanes[1] = new Phaser.Point(game.world.width - 200, gHeight - ((gHeight-buff)/4*3));
    lanes[2] = new Phaser.Point(game.world.width - 200, gHeight - ((gHeight-buff)/4*2));
    lanes[3] = new Phaser.Point(game.world.width - 200, gHeight - (gHeight-buff)/4);

    this.attacks = game.add.group();
    this.attacks.enableBody = true;

    game.add.text(game.world.centerX - 250, 48, "Swipe up or down to change lanes", style);
    game.add.text(game.world.centerX - 150, 96, "Tap to fire an attack", style);

    // PLAYER
    this.player = game.add.sprite( lanes[1].x, lanes[1].y, "player");
    this.player.lane = 1;
    this.player.animations.add("idle", [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    let attackAnim = this.player.animations.add("attack",[8, 9, 10, 11, 12, 13, 14], 10, false);
    attackAnim.onComplete.add(this.resetAnim, this);

    // Reevaluate Scale after we get actual assets, this is just for the placeholders
    // this.player.scale.setTo(1, 1);
    game.input.onUp.add(this.inputCheck, this);

    this.player.animations.play("idle");

    // ENEMIES
    enemySpawn();
    // ORIGINAL FOR LOOP SPAWNING
    /*this.enemies = game.add.group();
    this.enemies.enableBody = true;
    // No gravity because arial view
    for (let i = 0; i < 4; i++) {
        if (i < 4) {
            // Eventually will be random in-lane spawn
            let randPos = Math.floor(Math.random()*4);
            let enemy = this.enemies.create(0, lanes[randPos].y, "bEnemy");
            enemy.body.gravity.y = 0;
            enemy.body.velocity.x = 80;
            enemy.animations.add("move", [0,1], 10, true);
            enemy.animations.play("move");
        }
    }*/
}
// New for ES6: function to "pause" for certain amount of time
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function enemySpawn() {
    this.enemies = game.add.group();
    this.enemies.enableBody = true;
    // No gravity because arial view
    for (let i = 0; i < 4; i++) {
        if (i < 4) {
            // Eventually will be random in-lane spawn
            let randPos = Math.floor(Math.random()*4);
            let enemy = this.enemies.create(-100, lanes[randPos].y, "bEnemy");
            enemy.body.gravity.y = 0;
            enemy.body.velocity.x = 80;
            enemy.health = 2;
            enemy.animations.add("move", [0,1], 10, true);
            enemy.animations.play("move");
        }
        await sleep(2000);
    }
}
gamePlayState.prototype.update = function() {
    //game.physics.arcade.overlap(this.enemies, this.player, this.playerHealth, null, this);
    game.physics.arcade.overlap(this.attacks, this.enemies, this.enemyHealth, null, this);
}

gamePlayState.prototype.enemyHealth = function(attack, enemy) {
    // Here is where enemy health will deteriorate from a player attack
    // Total health for an enemy depends on the type of enemy
    /*if (enemy.health > 1) { // For businessman enemies
        enemy.health = enemy.health-1;
    } else {
        enemy.kill();
    }*/
    console.log("Blah blah ");
    enemy.destroy();
    //this.score +=5;
    //this.scoreText.text = "Score: " + this.score;
}

gamePlayState.prototype.inputCheck = function() {
    // Swipe upward
    if(game.input.activePointer.positionUp.y - game.input.activePointer.positionDown.y <= -1 * swipeDistance
        && this.player.lane > 0) {
        --this.player.lane
        this.player.x = lanes[this.player.lane].x;
        this.player.y = lanes[this.player.lane].y;
    }
    // Swipe downward
    else if(game.input.activePointer.positionUp.y - game.input.activePointer.positionDown.y >= swipeDistance
        && this.player.lane < 3) {
        ++this.player.lane
        this.player.x = lanes[this.player.lane].x;
        this.player.y = lanes[this.player.lane].y;
    }
    // Fire
    else {
        this.musicBlast();
    }
}

gamePlayState.prototype.resetAnim = function() {
    this.player.animations.play("idle");
}

gamePlayState.prototype.musicBlast = function() {
    this.player.animations.play("attack");
    let attack = this.attacks.create(this.player.x, this.player.y, "attack");
    // attack.scale.setTo(0.35, 0.35);  // Again, this was for the placeholders
    attack.body.velocity.x = -200;

    // Kill offscreen objectss
    attack.checkWorldBounds = true;
    attack.outOfBoundsKill = true;
}
