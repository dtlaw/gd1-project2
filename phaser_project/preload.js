let preloadState = function() {

}

preloadState.prototype.preload = function() {
    // game.load.image("player", "assets/placeholders/lars.png");
    // game.load.image("attack", "assets/placeholders/cymbal.png");

    game.load.spritesheet("player", "assets/sprites/player_combined.png", 155, 155);
    game.load.spritesheet("attack", "assets/sprites/projectile.png", 100, 100);
    game.load.image("road", "assets/sprites/RoadSprite.png");
    // Will be replaced with businessman spritesheet
    game.load.spritesheet("bEnemy", "assets/sprites/bm_full.png", 155, 155);
    game.load.spritesheet("cEnemy", "assets/sprites/cw_full.png", 155, 155);

    // FIXME: Make work, then change into a spritesheet
    game.load.image( "bridge", "assets/sprites/BridgeOnly.png" );
    game.load.image( "winScreen", "assets/sprites/WinBridge.png");
    game.load.image( "gameOver", "assets/sprites/lose_screen.png");

    game.load.audio( "bgm", "assets/audio/background_loop.wav" );
    game.load.audio( "aChord", "assets/audio/a_chord.wav" );
    game.load.audio( "cChord", "assets/audio/c_chord.wav" );
    game.load.audio( "fChord", "assets/audio/f_chord.wav" );
    game.load.audio( "gChord", "assets/audio/g_chord.wav" );
}

preloadState.prototype.create = function() {
    game.state.start("Gameplay");

}

preloadState.prototype.update = function() {

}
