

class StateEnergyBall extends State {
	constructor(state, entity){
		super(state)
		this.entity = entity;
	}

	follow(){

	}

	onExplosion(){
		
		this.entity.changeState('E_B-exp')
	}
}

let spriteSheet= 'img/anim/projectiles/Energy ball/energyBallImpact.png'

class StateExplosion extends State {
	constructor(state, entity){
		super(state)
		this.entity = entity;

	}

	enter(){
		let spriteConfig = {ticks: 5, sheet:true, composite:"hard-light"};
		let sprite = new Sprite( spriteSheet, spriteConfig);
		
		// SFX.play('explo')
		this.entity.addNewSprite(sprite)
		this.entity.sprite._onFinishAnimationCycle = ()=>{
			this.leave()
		}

		sd.addToPlay( './sfx/explo.wav', false, 1 )
	}

	leave(){
		this.entity.removeTarget()
		this.entity.destroy();
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
	
	return entity;
}

