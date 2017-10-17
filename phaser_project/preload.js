let preloadState = function() {

}

preloadState.prototype.preload = function() {
	// Will be replaced with player spritesheet
    game.load.image("player", "assets/placeholders/lars.png");
    game.load.image("attack", "assets/placeholders/cymbal.png");
    // Will be replaced with businessman spritesheet
    game.load.image("bEnemy", "assets/placeholders/tinybusinessman.png");
}

preloadState.prototype.create = function() {
    game.state.start("Gameplay");

}

preloadState.prototype.update = function() {

}
