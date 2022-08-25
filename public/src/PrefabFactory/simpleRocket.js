function simpleRocketFactory(uid, grid, x=0, y=0, config={}){

	let {
		spriteSheet= 'img/anim/projectiles/simple_rocket.png'
		, ticks=5
		, sheet=true
		, composite= "hard-light"
		, movementSpeed = .5
	} = config

	let spriteConfig = {
		ticks, sheet:{
			sheetHeight: 32, sheetWidth: 32
			, height: 32, width:32
		}, composite};
	let sprite = new Sprite( spriteSheet, spriteConfig);

	let position = new Position(x,y);

	let entityConfig = { grid, position, movementSpeed, uid };

	let entity = new Entity( sprite, entityConfig );

	let stateDeployed = new State('rocket_deploy', entity);
	let stateHomming = new State('rocket_homming', entity);
	let stateReached = new State('rocket_reach', entity);

	stateDeployed.enter = ()=>{
		sd.addToPlay( './sfx/FX065.mp3', false, 0.1, 
		()=>{
			entity.changeState('rocket_homming')
		})
	}

	
	stateHomming.enter = function(){
		// console.log( 'hommin' )
		sd.addToPlay( './sfx/FX78.mp3', true, 0.1,
		()=>{
			this.ctx.setNewTarget( flop,  {movementSpeed:9, onReach: ()=>{
				this.ctx.changeState('rocket_reach')
			}})
		})
	}
	stateHomming.update = function(delta){}

	stateReached.enter = function(){

		sd.addToPlay( './sfx/FX100.wav', true, 0.1)
		
		this.ctx.addNewSprite(sprExplosion, 'explosion')
		this.ctx.sprite._onFinishAnimationCycle = ()=>{
			this.leave()
		}
	}

	stateReached.leave = function(){
		this.ctx.removeTarget()
		this.ctx.destroy();
	}

	

	entity.addNewState(stateDeployed)
	entity.addNewState(stateHomming)
	entity.addNewState(stateReached)
	// entity.addNewState(new StateExplosion('E_B-exp', entity))
	
	return entity;
}

let sprExplConfig = {ticks: 5, sheet:{sheetHeight: 100, sheetWidth: 100, height: 100, width:100}, composite:"hard-light"};
let sprExplosion = new Sprite( 'img/anim/explosions/explo_1/spritesheet.png', sprExplConfig);

