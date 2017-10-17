let gamePlayState = function() {

}

let lanes = new Array(4);

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
    this.player = game.add.sprite( lanes[2].x, lanes[2].y, "player");
    this.player.lane = 1;
    this.player.animations.add("idle", [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    let attackAnim = this.player.animations.add("attack",[8, 9, 10, 11, 12, 13, 14], 10, false);
    attackAnim.onComplete.add(this.resetAnim, this);

    // Reevaluate Scale after we get actual assets, this is just for the placeholders
    // this.player.scale.setTo(1, 1);
    game.input.onUp.add(this.inputCheck, this);

    this.player.animations.play("idle");

    // ENEMIES
    this.enemies = game.add.group();
    this.enemies.enableBody = true;
    // No gravity because arial view
    for (let i = 0; i < 4; i++) {
        // Eventually will be random in-lane spawn
        let enemy = this.enemies.create(0, lanes[i].y, "bEnemy");
        enemy.body.gravity.y = 0;
        enemy.body.velocity.x = 80;
    }
    //this.enemies.animations.add("move", [0], 10, true);

}

gamePlayState.prototype.update = function() {
    game.physics.arcade.collide(this.enemies, this.player, this.playerHealth, null, this);
    //game.physics.arcade.collide(this.pAttack, this.enemies, this.enemyHealth, null, this);

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
