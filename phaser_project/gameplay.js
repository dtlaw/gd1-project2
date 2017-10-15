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

    lanes[0] = new Phaser.Point(game.world.width - 200, game.world.height - 550);
    lanes[1] = new Phaser.Point(game.world.width - 200, game.world.height - 400);
    lanes[2] = new Phaser.Point(game.world.width - 200, game.world.height - 250);
    lanes[3] = new Phaser.Point(game.world.width - 200, game.world.height - 100);

    this.attacks = game.add.group();
    this.attacks.enableBody = true;

    game.add.text(game.world.centerX - 250, 48, "Swipe up or down to change lanes", style);
    game.add.text(game.world.centerX - 150, 96, "Tap to fire an attack", style);

    this.player = game.add.sprite( lanes[2].x, lanes[2].y, "player");
    this.player.lane = 2;

    // Reevaluate Scale after we get actual assets, this is just for the placeholders
    this.player.scale.setTo(0.35, 0.35);

    game.input.onUp.add(this.inputCheck, this);
}

gamePlayState.prototype.update = function() {

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

gamePlayState.prototype.musicBlast = function() {
    let attack = this.attacks.create(this.player.x, this.player.y, "attack");
    attack.scale.setTo(0.35, 0.35);
    attack.body.velocity.x = -200;

    // Kill offscreen objectss
    attack.checkWorldBounds = true;
    attack.outOfBoundsKill = true;
}
