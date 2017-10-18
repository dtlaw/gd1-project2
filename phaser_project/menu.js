let menuState = function() {

}

menuState.prototype.create = function() {
    let playButton = game.add.button(game.world.centerX, game.world.centerY + 100, "button", clickPlay, this);
    playButton.scale.setTo(10, 10);
    playButton.anchor.setTo(0.5, 0.5);
    let playText = game.add.text(playButton.position.x, playButton.position.y, "Play", style);
    playText.anchor.setTo(0.5, 0.5);

    let storyButton = game.add.button(game.world.centerX - 200, game.world.centerY + 200, "button", clickStory, this);
    storybutton.scale.setTo(10, 10);
    storybutton.anchor.setTo(0.5, 0.5);
    let storyText = game.add.text(storyButton.position.x, storyButton.position.y, "Story", style);
    storyText.anchor.setTo(0.5, 0.5);
}

menuState.prototype.clickPlay = function() {
    game.state.start("Gameplay");
}

menuState.prototype.clickStory = function() {
    game.state.start("Story");
}
