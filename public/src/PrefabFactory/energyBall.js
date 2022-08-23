

class StateEnergyBall extends State {
	constructor(state, entity){
		super(state)
		this.entity = entity;
	}

	onExplosion(){
		console.log( 'bum' )
		this.entity.changeState('E_B-exp')
	}
}

let spriteSheet= 'img/anim/projectiles/Energy ball/energyBallImpact.png'
	
let spriteConfig = {ticks: 5, sheet:true, composite:"hard-light"};
let sprite = new Sprite( spriteSheet, spriteConfig);
class StateExplosion extends State {
	constructor(state, entity){
		super(state)
		this.entity = entity;

	}

	enter(){
		console.log( 'soy una explosion', sprite.isReady )
		SFX.play('explo')
		this.entity.addNewSprite(sprite)
		this.leave()
	}

	follow(){

	}

	leave(){
		this.entity.removeTarget()
	}
}


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

	let entityConfig = { grid, position, movementSpeed, uid };

	let entity = new Entity( sprite, entityConfig );

	entity.addNewState(new StateEnergyBall('E_B-def', entity))
	entity.addNewState(new StateExplosion('E_B-exp', entity))
	console.log( {entity} )
	return entity;
}

