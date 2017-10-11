let swipeMoveState = function() {

}

// const swipeDistance = 200;

swipeMoveState.prototype.gameplay = function() {
    // NOTHING GOES HERE
}

swipeMoveState.prototype.create = function() {
    let style = {
        font: "32px Arial",
        fill: "#ffffff",
        align: "center"
    }

    game.add.text(game.world.centerX - 250, 48, "Swipe up or down to change lanes", style);
    game.add.text(game.world.centerX - 150, 96, "Tap to fire an attack", style);

    this.player = game.add.sprite( game.world.width - 200, game.world.height / 2, "player");

    // Reevaluate Scale after we get actual assets
    this.player.scale.setTo(0.35, 0.35);


}

swipeMoveState.prototype.update = function() {

}

swipeMoveState.prototype.musicBlast = function() {
    console.log("he attac");
}
