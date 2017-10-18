let gamePlayState = function() {

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
    this.bridgeBG = game.add.sprite(0, 0, "background");
    this.bridgeBG.visible = false;
    this.bridge = game.add.sprite(0, 0, "bridge" );
    this.bridge.bringToTop();
    this.bridge.visible = false;
    this.gameWon = false;
    this.gameLost = false;
    this.literallyJustStarted = true;

    this.road = game.add.sprite(0,0, "road");
    game.physics.startSystem(Phaser.Physics.ARCADE);

    let gHeight = game.world.height;
    let buff = 75; // Buffer for "top" of screen (water side of bridge)
    this.wave = 1; // 3 waves total for entire game
    this.lanes[0] = new Phaser.Point(game.world.width - 200, gHeight - ((gHeight-buff)));
    this.lanes[1] = new Phaser.Point(game.world.width - 200, gHeight - ((gHeight-buff)/4*3));
    this.lanes[2] = new Phaser.Point(game.world.width - 200, gHeight - ((gHeight-buff)/4*2));
    this.lanes[3] = new Phaser.Point(game.world.width - 200, gHeight - (gHeight-buff)/4);

    this.attacks = game.add.group();
    this.attacks.enableBody = true;


    // game.add.text(game.world.centerX - 250, 48, "Swipe up or down to change lanes", style);
    // game.add.text(game.world.centerX - 150, 96, "Tap to fire an attack", style);
    this.swipeTut = game.add.sprite(game.world.centerX + 100, 100, "swipeTutorial");
    this.swipeTut.animations.add("a", [0, 1, 2, 3, 4], 10, true);
    this.swipeTut.animations.play("a");
    this.tapTut = game.add.sprite(game.world.centerX - 300, 100, "tapTutorial");
    this.tapTut.animations.add("a", [0, 1], 10, true);
    this.tapTut.animations.play("a");

    // PLAYER
    this.player = game.add.sprite( this.lanes[2].x, this.lanes[2].y, "player");
    this.player.lane = 1;
    this.player.enableBody = true;
    this.player.canAttack = true;
    this.player.animations.add("idle", [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    let attackAnim = this.player.animations.add("attack",[9, 10, 11, 12, 13, 14, 15], 10, false);
    attackAnim.onComplete.add(this.resetAnim, this);
    this.player.animations.add("flinch", [8, 16], 60, true);

    this.player.attackSounds = new Array( 4 );
    this.player.attackSounds[ 0 ] = game.add.audio( "aChord" );
    this.player.attackSounds[ 1 ] = game.add.audio( "cChord" );
    this.player.attackSounds[ 2 ] = game.add.audio( "fChord" );
    this.player.attackSounds[ 3 ] = game.add.audio( "gChord" );

    game.input.onDown.add(this.setDownPos, this);

    game.input.onUp.add(this.inputCheck, this);

    this.player.animations.play("idle");

    this.bgm = game.add.audio( "bgm" );
    this.bgm.loopFull();

    // ENEMIES
    enemySpawn(this, this.wave);
}

// New for ES6: function to "pause" for certain amount of time
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function enemySpawn(gLink, wave) {
    gLink.enemies = game.add.group();
    gLink.enemies.enableBody = true;
    let waveSize = 3+(1*wave);
    let havePaused = false;

    // No gravity because aerial view
    for (let i = 0; i < waveSize; i++) {
        // Random in-lane spawn
        let randPos = Math.floor(Math.random()*4);
        let randEnemy = Math.floor(Math.random()*2);
        if(gLink.gameLost || gLink.gameWon) {
            // Do nothing, we want no enemies in these cases
        }
        else if (wave === 1) {
            randEnemy = 0;
        } else if (wave === 3) {
            randEnemy = 1;
        }
        if (randEnemy === 0) { // Construction worker
            let enemy = gLink.enemies.create(-190, gLink.lanes[randPos].y, "cEnemy");
            if (!gLink.literallyJustStarted && havePaused === false) {
                havePaused = true;
                gLink.player.canAttack = false;
                await sleep(5000);
                gLink.player.canAttack = true;

            }
            else {
                gLink.literallyJustStarted = false;
            }
            enemy.health = 1;
            enemy.animations.add("move", [0,1,2,3,4], 20, true);
            enemy.animations.add("dead", [5, 6], 20, true);
            enemy.body.gravity.y = 0;
            enemy.body.velocity.x = 85;
            enemy.animations.play("move");
        } else if (randEnemy === 1) { // Businessmen
            let enemy = gLink.enemies.create(-190, gLink.lanes[randPos].y, "bEnemy");
            if (!gLink.literallyJustStarted && havePaused === false) {
                havePaused = true;
                gLink.player.canAttack = false;
                await sleep(5000);
                gLink.player.canAttack = true;
            }
            else {
                gLink.literallyJustStarted = false;
            }
            enemy.health = 2;
            enemy.animations.add("move", [0,1], 10, true);
            enemy.animations.add("hurt", [2], 10, true);
            enemy.animations.add("run", [3,4], 10, true);
            enemy.animations.add("dead", [5, 6], 20, true);
            enemy.body.gravity.y = 0;
            enemy.body.velocity.x = 70;
            enemy.animations.play("move");
        }
        await sleep(1200);
    }
    //await sleep(12000);
}

async function enemyDie(enemy) {
    enemy.animations.play("dead");
    enemy.body.enable = false;
    await sleep(enemyDeathTime * 800);
    enemy.destroy();
}

async function enemyHurt(enemy) {
    enemy.animations.play("hurt");
    enemy.body.enable = false;
    --enemy.health;
    await sleep(400);
    enemy.body.enable = true;
    enemy.body.velocity.x = 135;
    enemy.animations.play("run");
}

gamePlayState.prototype.update = function() {
    game.physics.arcade.overlap(this.attacks, this.enemies, this.enemyHealth, null, this);

    // Checks for enemies reaching the end of bridge
    for ( i = 0; i < this.enemies.length; ++i ) {
        if ( this.enemies.children[i].x > game.world.width ) {
            this.bridgeDamage( this.enemies.children[i]);
            break;
        }
    }

    // Check all enemies defeated here!
    console.log("enemies left: " + this.enemies.length);
    if (!this.gameLost && this.enemies.length === 0) {
        console.log("NO MORE ENEMIES LEFT! Wave: " + this.wave);
        if (this.wave < 4) {
            ++this.wave;
            console.log("NEXT WAVE!");
            enemySpawn(this, this.wave);
        } else {
            // Stop all animations: Game is Won!
            if(!this.gameWon) {
                this.gameWon = true;
                this.player.canAttack = false;
                game.add.sprite(0, 0, "winScreen");

                console.log("YOU WON THE GAME!");
            }
        }
    }
    console.log("Bridge is visible: " + this.bridge.visible);
}

gamePlayState.prototype.enemyHealth = function(attack, enemy) {
    // Here is where enemy health will deteriorate from a player attack
    // Total health for an enemy depends on the type of enemy
    if (enemy.health > 1) { // For businessman enemies
        enemyHurt(enemy);
    } else { // Construction enemies and Half-health businessmen
        enemyDie(enemy);
    }
    // Make sure to delete the attack sprite
    attack.kill();
}

gamePlayState.prototype.bridgeDamage = async function( enemy ) {
    // Bridge takes damage when enemies get past the player!
    // Entire game pauses for a second or two to watch the explosion

    --this.wave;
    for ( i = this.enemies.children.length - 1; i >= 0; --i ) {
        this.enemies.children[ i ].destroy();
        console.log( i );
    }

    // console.log( this.enemies.children.length );
    if ( this.bridgeHealth > 1 ) {
        // game.paused = true;
        this.road.visible = false;
        this.player.visible = false;
        this.enemies.visible = false;
        this.bridgeBG.visible = true;
        this.bridge.visible = true;
        game.input.enabled = false;

        if ( this.bridgeHealth === 3 ) {
            this.rightFire = game.add.sprite(0, 0, "rightDmg");
            let anim = this.rightFire.animations.add("start", [0,1,2], 10, false);
            this.rightFire.animations.add("burn", [3,4,5], 10, true);
            anim.onComplete.add(function() {this.rightFire.animations.play("burn");}, this);
            this.rightFire.animations.play("start");
            await sleep( 2000 );
            this.rightFire.visible = false;

        } else { // health is 2
            this.rightFire.visible = true;
            this.midFire = game.add.sprite(0, 0, "middleDmg");
            let anim = this.midFire.animations.add("start", [0,1,2], 10, false);
            this.midFire.animations.add("burn", [3,4,5], 10, true);
            anim.onComplete.add(function() {this.midFire.animations.play("burn");}, this);
            this.midFire.animations.play("start");
            await sleep( 2000 );
            this.midFire.visible = false;
            this.rightFire.visible = false;

        }

        // console.log( this.bridgeHealth );


        this.road.visible = true;
        this.player.visible = true;
        this.enemies.visible = true;
        this.bridge.visible = false;
        this.bridgeBG.visible = false;
        game.input.enabled = true;
        // game.paused = false;
        --this.bridgeHealth;
    } else {
        this.rightFire.visible = true;
        this.midFire.visible = true;

        // Right side explosion
        this.leftFire = game.add.sprite(0, 0, "leftDmg");
        let anim = this.leftFire.animations.add("start", [0,1,2], 10, false);
        this.leftFire.animations.add("burn", [3,4,5], 10, true);
        anim.onComplete.add(function() {this.leftFire.animations.play("burn");}, this);
        this.leftFire.animations.play("start");
        // End game state
        if(!this.gameLost) {
            this.gameLost = true;
            this.player.canAttack = false;
            game.add.sprite(0, 0, "gameOver");
        }
    }
}

gamePlayState.prototype.setDownPos = function() {
    this.downPos = game.input.activePointer.position.y;
}

gamePlayState.prototype.inputCheck = function() {
    if(game.input.activePointer.position.y - this.downPos <= -1 * swipeDistance
        && this.player.lane > 0) {
        --this.player.lane;
        this.player.x = this.lanes[this.player.lane].x;
        this.player.y = this.lanes[this.player.lane].y;
        this.swipeTut.visible = false;
    }
    else if(game.input.activePointer.position.y - this.downPos >= swipeDistance
        && this.player.lane < 3) {
        ++this.player.lane;
        this.player.x = this.lanes[this.player.lane].x;
        this.player.y = this.lanes[this.player.lane].y;
        this.swipeTut.visible = false;
    }
    else if(this.player.canAttack){
        this.musicBlast();
        this.tapTut.visible = false;
    }
}

gamePlayState.prototype.resetAnim = function() {
    this.player.animations.play("idle");
    this.player.canAttack = true;
}

gamePlayState.prototype.musicBlast = function() {
    if (this.player.canAttack === true) {
        this.player.canAttack = false;
        this.player.animations.play("attack");

        let soundIndex = Math.floor( Math.random() * ( this.player.attackSounds.length ));
        this.player.attackSounds[ soundIndex ].play();

        let attack = this.attacks.create(this.player.x, this.player.y, "attack");
        attack.animations.add("move", [0, 1, 2], 15, true);
        attack.animations.play("move");
        attack.body.velocity.x = -200;

        // Kill offscreen objectss
        attack.checkWorldBounds = true;
        attack.outOfBoundsKill = true;
    }

}
