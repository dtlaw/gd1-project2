let preloadState = function() {

}

preloadState.prototype.preload = function() {
    game.load.image("player", "assets/placeholders/lars.png");
}

preloadState.prototype.create = function() {
    game.state.start("Gameplay");

}

preloadState.prototype.update = function() {

}
