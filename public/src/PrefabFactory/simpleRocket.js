let sprExplConfig = {ticks: 5, sheet:{sheetHeight: 100, sheetWidth: 100, height: 100, width:100}, composite:"hard-light"};
let sprExplosion = new Sprite( 'img/anim/explosions/explo_1/spritesheet.png', sprExplConfig);

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
		sd.addToPlay( './sfx/FX065.mp3', false, 0.1) }

	setTimeout(() => {
		entity.changeState('rocket_homming')
	}, 500);

	
	stateHomming.enter = function(){
		
		sd.addToPlay( './sfx/FX78.mp3', true, 0.1,
		()=>{
			this.ctx.setNewTarget( flop,  {movementSpeed:9})
		})
	}
	stateHomming.update = function(deltaTime, runningTime){
		
		const entity = this.ctx;
		const timeSpeedMod = .001;

		if( !!entity.targetEntity ){

			let targetPos = entity.targetEntity.position;
			let targetX = targetPos.x
				, targetY = targetPos.y;

			let selfPos = entity.position;
			let selfX = selfPos.x
				, selfY = selfPos.y;

			let xDiff = targetX - selfX
				, yDiff = targetY - selfY;

			let mvsp = entity.mvsp;

			// const maxAngle = .95

			// se calcula el angulo entre este entity y el target
			let angle = entity.position.calcAngle(entity.targetEntity.position);
			// angle = Math.abs(angle) > maxAngle? (maxAngle* angle): angle;
			// angle = angle*maxAngle/mvsp
			entity._facingAngle = angle;

			// se efectua la rotacion del sprite
			entity.rotate = entity.position.calcAngleDeg( entity.targetEntity.position ) + 270
			
			// se aplican los modificadores de velocidad bloque/seg
			const mvspAfterMod = mvsp;

			// new pos = old pos + mvsp (/secs (mill)) * time delta
			
			// se calcula la posicion de acuerdo al angulo entre las 2 posicines
			// y obtener la distancia relativa
			const angleTiltX = Math.sin(angle);
			const angleTiltY = Math.cos(angle);
			// se calcula la distancia entre las 2 posiciones
			const distanceX = Math.abs(angleTiltX);
			const distanceY = Math.abs(angleTiltY);
			// se calcula la siguiente posicion de la entidad aplicando 
			// la velocidad de movimiento
			let nextXPos = distanceX * (mvspAfterMod * Math.sign(angleTiltX))
			let nextYPos = distanceY * (mvspAfterMod * Math.sign(angleTiltY))
			// se recalcula la siguiente posicion de la entidad para 
			// aplicar blques/segundos ( delta_time (ms) / 1000 )
			nextXPos *= deltaTime * timeSpeedMod
			nextYPos *= deltaTime * timeSpeedMod

			//se verifica que la siguiente posicion no sobre pase la posicion actual del
			// objetivo  
			nextXPos = (Math.abs(nextXPos) >= Math.abs(xDiff)) ? xDiff*distanceX: nextXPos;
			nextYPos = (Math.abs(nextYPos) >= Math.abs(yDiff)) ? yDiff*distanceY: nextYPos;

			// se efectua el movimiento de la entidad
			entity.position.move( nextXPos, nextYPos)

			// en caso de que el target este a menos de cierta distancia
			// se elimina el target, para que este no quede eternamente buscando 
			// el mismo target
			if( Math.abs(xDiff*distanceX) <= .05 && Math.abs(yDiff*distanceY) <= .05 ){
				
				entity.onReachActions.forEach((val)=>{
					if( val != null )	val(entity, entity.targetEntity);
				})

				if( !!entity.currentState.onExplosion )	entity.currentState.onExplosion();
				entity.changeState('rocket_reach')
			}
		}
	}

	stateReached.enter = function(){

		const entity = this.ctx;

		sd.addToPlay( './sfx/FX100.wav', true, 0.1)
		
		entity.addNewSprite(sprExplosion, 'explosion')

		rocket = null;
		
		entity.targetEntity.sprite.hue = 250;
		
		setTimeout(() => {
			entity.targetEntity.sprite.hue = 0;
		}, 50);
		entity.sprite._onFinishAnimationCycle = ()=>{
			if( entity.targetEntity ){
				
				this.leave()
			}
		}
	}

	stateReached.leave = function(){

		const entity = this.ctx;

		entity.removeTarget()
		entity.destroy();
	}

	

	entity.addNewState(stateDeployed)
	entity.addNewState(stateHomming)
	entity.addNewState(stateReached)
	// entity.addNewState(new StateExplosion('E_B-exp', entity))
	
	return entity;
}

