function getEnergyBall(uid, grid, x=0, y=0, config={}){

	let {
		spriteSheet= 'img/anim/projectiles/Energy ball/EnergyBall.png'
		, ticks=5
		, sheet=true
		, composite= "hard-light"
		, movementSpeed = .5
	} = config

	let spriteConfig = {ticks, sheet, composite};
	let sprite = new Sprite( spriteSheet, spriteConfig);

	let position = new Position(x,y);

	let entityConfig = { grid, position, movementSpeed, uid	};

	let entity = new Entity( sprite, entityConfig );

	return entity;
}