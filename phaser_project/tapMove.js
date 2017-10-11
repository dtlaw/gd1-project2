let tapMoveState = function() {

}

// const swipeDistance = 200;

tapMoveState.prototype.gameplay = function() {
    // NOTHING GOES HERE
}

tapMoveState.prototype.create = function() {
    let style = {
        font: "32px Arial",
        fill: "#ffffff",
        align: "center"
    }

    game.add.text(game.world.centerX - 200, 48, "Tap a lane to move there", style);
    game.add.text(game.world.centerX - 200, 96, "Swipe left to fire an attack", style);

    this.player = game.add.sprite( game.world.width - 200, game.world.height / 2, "player");

    // Reevaluate Scale after we get actual assets
    this.player.scale.setTo(0.35, 0.35);
}

tapMoveState.prototype.update = function() {

}
