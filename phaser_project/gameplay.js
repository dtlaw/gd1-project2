let gamePlayState = function() {

}

gamePlayState.prototype.gameplay = function() {
    // NOTHING GOES HERE
}

gamePlayState.prototype.create = function() {
    let style = {
        font: "32px Arial",
        fill: "#ffffff",
        align: "center"
    }

    this.downPos = 0;


    this.lanes = new Array(4);
    // Bridge Health (aka player health for the game)
    this.bridgeHealth = 3;

    game.add.sprite(0,0, "road");
    game.physics.startSystem(Phaser.Physics.ARCADE);

    let gHeight = game.world.height;
    let buff = 75; // Buffer for "top" of screen (water side of bridge)
    this.lanes[0] = new Phaser.Point(game.world.width - 200, gHeight - ((gHeight-buff)));
    this.lanes[1] = new Phaser.Point(game.world.width - 200, gHeight - ((gHeight-buff)/4*3));
    this.lanes[2] = new Phaser.Point(game.world.width - 200, gHeight - ((gHeight-buff)/4*2));
    this.lanes[3] = new Phaser.Point(game.world.width - 200, gHeight - (gHeight-buff)/4);

    this.attacks = game.add.group();
    this.attacks.enableBody = true;

    game.add.text(game.world.centerX - 250, 48, "Swipe up or down to change lanes", style);
    game.add.text(game.world.centerX - 150, 96, "Tap to fire an attack", style);

    // PLAYER
    this.player = game.add.sprite( this.lanes[2].x, this.lanes[2].y, "player");
    this.player.lane = 1;
    this.player.canAttack = true;
    this.player.animations.add("idle", [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    let attackAnim = this.player.animations.add("attack",[8, 9, 10, 11, 12, 13, 14], 10, false);
    attackAnim.onComplete.add(this.resetAnim, this);

    this.player.attackSounds = new Array( 4 );
    this.player.attackSounds[ 0 ] = game.add.audio( "aChord" );
    this.player.attackSounds[ 1 ] = game.add.audio( "cChord" );
    this.player.attackSounds[ 2 ] = game.add.audio( "fChord" );
    this.player.attackSounds[ 3 ] = game.add.audio( "gChord" );

    // Reevaluate Scale after we get actual assets, this is just for the placeholders
    // this.player.scale.setTo(1, 1);
    game.input.onDown.add(this.setDownPos, this);

    game.input.onUp.add(this.inputCheck, this);

    this.player.animations.play("idle");

    this.bgm = game.add.audio( "bgm" );
    this.bgm.loopFull();

    // ENEMIES
    //this.enemies = game.add.group();
    enemySpawn(this);
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

/*async function enemySpawn() {*/
async function enemySpawn(gLink) {
    gLink.enemies = game.add.group();
    gLink.enemies.enableBody = true;
    // No gravity because arial view
    for (let i = 0; i < 4; i++) {
        if (i < 4) {
            // Random in-lane spawn
            let randPos = Math.floor(Math.random()*4);
            let randEnemy = Math.floor(Math.random()*2);
            if (randEnemy === 0) { // Construction worker
                let enemy = gLink.enemies.create(-100, gLink.lanes[randPos].y, "cEnemy");
                enemy.health = 1;
                enemy.animations.add("move", [0,1,2,3,4], 10, true);
                enemy.body.gravity.y = 0;
                enemy.body.velocity.x = 70;
                enemy.animations.play("move");
            } else { // Businessmen
                let enemy = gLink.enemies.create(-100, gLink.lanes[randPos].y, "bEnemy");
                enemy.health = 2;
                enemy.animations.add("move", [0,1], 10, true);
                enemy.body.gravity.y = 0;
                enemy.body.velocity.x = 85;
                enemy.animations.play("move");
            }

        }
        await sleep(2000);
    }
}
gamePlayState.prototype.update = function() {
    game.physics.arcade.overlap(this.attacks, this.enemies, this.enemyHealth, null, this);
    game.physics.arcade.overlap(this.enemies, this.player, this.bridgeDamage, null, this);

    // Check if any enemies have gotten past the player
    //HERE!!!
}

gamePlayState.prototype.enemyHealth = function(attack, enemy) {
    // Here is where enemy health will deteriorate from a player attack
    // Total health for an enemy depends on the type of enemy
    if (enemy.health > 1) { // For businessman enemies
        enemy.health = enemy.health-1;
    } else { // Construction enemies and Half-health businessmen
        enemy.kill();
    }
    // Make sure to delete the attack sprite
    attack.kill();
}

gamePlayState.prototype.bridgeDamage = function(enemy, player) {
    // Bridge takes damage when enemies get past the player!
    // Entire game pauses for a second or two to watch the explosion
    if (this.bridgeHealth > 1) {
        if (this.bridgeHealth === 3) {
            // Left side explosion

        } else { // health is 2
            // Middle explosion

        }
        // Update health
        bridgeHealth = bridgeHealth-1;
    } else {
        // Right side explosion
        // End game state
        
    }

}

gamePlayState.prototype.setDownPos = function() {
    this.downPos = game.input.activePointer.position.y;

}

gamePlayState.prototype.inputCheck = function() {
    console.log(game.input.activePointer.position.y + " " + this.downPos);
    if(game.input.activePointer.position.y - this.downPos <= -1 * swipeDistance
        && this.player.lane > 0) {
        console.log("Up");
        --this.player.lane;
        this.player.x = this.lanes[this.player.lane].x;
        this.player.y = this.lanes[this.player.lane].y;
    }
    else if(game.input.activePointer.position.y - this.downPos >= swipeDistance
        && this.player.lane < 3) {
        console.log("Down");
        ++this.player.lane;
        this.player.x = this.lanes[this.player.lane].x;
        this.player.y = this.lanes[this.player.lane].y;
    }
    else if(this.player.canAttack){
        console.log("he attac");
        this.musicBlast();
    }
}

gamePlayState.prototype.resetAnim = function() {
    this.player.animations.play("idle");
    this.player.canAttack = true;
}

gamePlayState.prototype.musicBlast = function() {
    this.player.canAttack = false;
    this.player.animations.play("attack");

    let soundIndex = Math.floor( Math.random() * ( this.player.attackSounds.length ));
    this.player.attackSounds[ soundIndex ].play();

    let attack = this.attacks.create(this.player.x, this.player.y, "attack");
    attack.animations.add("move", [0, 1, 2], 15, true);
    attack.animations.play("move");
    // attack.scale.setTo(0.35, 0.35);  // Again, this was for the placeholders
    attack.body.velocity.x = -200;

    // Kill offscreen objectss
    attack.checkWorldBounds = true;
    attack.outOfBoundsKill = true;
}
