let preloadState = function() {

}

preloadState.prototype.preload = function() {
    // game.load.image("player", "assets/placeholders/lars.png");
    // game.load.image("attack", "assets/placeholders/cymbal.png");

    game.load.spritesheet("player", "assets/sprites/player.png", 155, 155);
    game.load.spritesheet("attack", "assets/sprites/projectile.png", 100, 100);
}

preloadState.prototype.create = function() {
    game.state.start("Gameplay");

}

preloadState.prototype.update = function() {

}
