let tapMoveState = function() {

}

tapMoveState.prototype.gameplay = function() {
    // NOTHING GOES HERE
}

tapMoveState.prototype.create = function() {
    this.player = game.add.sprite( game.world.width - 200, game.world.height / 2, "player");

    // Reevaluate Scale after we get actual assets
    this.player.scale.setTo(0.35, 0.35);

}

tapMoveState.prototype.update = function() {

}
