// File for Enemy AI
// Contains: enemy creation/spawning, movement, animations, deletion upon death
// 			or "off-screen" (aka player did not destroy)

// NEEDS:
	// Death animation & sound
	// Walking animation
	// Random spawning
	// Waves
	// Speed(s)
	// Total deletion after death/off-screen
	// Types of enemies
		// 1-Hit: Construction Worker
		// 2-Hit: Corporate/Business Person
	// Worry about Boss AI later on...
// NOTE:
	// python -m SimpleHTTPServer while within directory to start up
	// preload file should contain: game.load.script('simpleAI.js', )

gameplayState.prototype.preload = function() {
	// Load spritesheets for each enemy type here?
}

gameplayState.prototype.create = function() {
	this.enemies = game.add.group();
	this.enemies.enableBody = true;
	// No gravity because arial view
	for (let i = 0; i < 5; i++) {
		// Eventually the i*30 y-pos will be replaced by a
		// random spawn b/n the 4 lanes of the game
			// curently not random**
		let enemy = this.enemies.create(0, i*30, "enemy");
		enemy.body.gravity.y = 0;
		enemy.body.velocity.x = 80;
	}
	this.enemies.animations.add("move", [0], 10, true);
}

gameplayState.prototype.update = function() {
	game.physics.arcade.collide(this.enemies, this.player, this.playerHealth, null, this);
	game.physics.arcade.collide(this.pAttack, this.enemies, this.enemyHealth, null, this);

}

gameplayState.prototype.playerHealth = function(enemy, player) {
	// Here is where player health will deteriorate from an enemy
	// Total health for player depends on bridge health (3 hits?)
	// if (playerHealth <= 1) {
	// 	player dies/bridge falls
	//} else { playerHealth = playerHealth-1; }
	// Enemy disappears after causing damage
	enemy.kill();
}

gameplayState.prototype.enemyHealth = function(pAttack, enemy) {
	// Here is where enemy health will deteriorate from a player attack
	// Total health for an enemy depends on the type of enemy
	enemy.kill();
	/*this.score +=5;
	this.scoreText.text = "Score: " + this.score;*/
}