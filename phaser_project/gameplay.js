let gamePlayState = function() {

}

// const swipeDistance = 200;

gamePlayState.prototype.gameplay = function() {
    // NOTHING GOES HERE
}

gamePlayState.prototype.create = function() {
    let style = {
        font: "32px Arial",
        fill: "#ffffff",
        align: "center"
    }

    this.attacks = game.add.group();
    this.attacks.enableBody = true;

    game.add.text(game.world.centerX - 250, 48, "Swipe up or down to change lanes", style);
    game.add.text(game.world.centerX - 150, 96, "Tap to fire an attack", style);

    this.player = game.add.sprite( game.world.width - 200, game.world.height / 2, "player");

    // Reevaluate Scale after we get actual assets, this is just for the placeholders
    this.player.scale.setTo(0.35, 0.35);

    game.input.onDown.add(this.musicBlast, this);
}

gamePlayState.prototype.update = function() {

}

gamePlayState.prototype.musicBlast = function() {
    console.log("he attac");
    let attack = this.attacks.create(this.player.x, this.player.y, "attack");
    attack.scale.setTo(0.35, 0.35);
    attack.body.velocity.x = -200;

    // Kill offscreen objectss
    attack.checkWorldBounds = true;
    attack.outOfBoundsKill = true;
}
