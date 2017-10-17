let preloadState = function() {

}

preloadState.prototype.preload = function() {
    // game.load.image("player", "assets/placeholders/lars.png");
    // game.load.image("attack", "assets/placeholders/cymbal.png");

    game.load.spritesheet("player", "assets/sprites/player_combined.png", 155, 155);
    game.load.spritesheet("attack", "assets/sprites/projectile.png", 100, 100);
    // Will be replaced with businessman spritesheet
    game.load.image("bEnemy", "assets/placeholders/tinybusinessman.png", 125, 125);
}

preloadState.prototype.create = function() {
    game.state.start("Gameplay");

}

preloadState.prototype.update = function() {

}
