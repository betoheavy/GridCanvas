class Entity{
	/**
	 * @param {Sprite|String|Array[Sprite|String]|Object[Sprite]} sprite
	 * @param {Object} 	[options] 
	 * @param {uid}			[options.uid]	-	unique id
	 * @param	{Entity}	[options.targetEntity] - 
	 * @param {number} [options.movementSpeed = 1] - entity's movement speed
	 * @param {boolean} [options.fFollowTarget = false] - entity follow flag
	 */
	constructor(sprite, options={}){

		this._sprites = {}; 
		let defaultIndex = '0';

		if (typeof sprite === 'string') sprite = [sprite];
		else if (sprite.constructor.name === "Sprite") sprite = [sprite];
		
		if (sprite.constructor.name === "Object"){
			this._sprites = sprite;
			defaultIndex = Object.keys(sprite)[0];
		}else if ( Array.isArray(sprite) ){
			if (sprite.length){
				if (sprite[0].constructor.name === "Sprite") for (let i in sprite) this._sprites[i] = sprite[i];
				if (sprite[0].constructor.name === "String") this._sprites[defaultIndex] = new Sprite(sprite);
			}else{
				throw new Error("Entity sprite can't be empty");
			}
		}

		let {
			collision   = false,
			position    = new Position(),
			index       = defaultIndex,
			grid        = false,
			rotate      = 0,
			targetEntity = null,
			fFollowTarget = false,
			movementSpeed = 1,
			uid = "Entity"+(new Date().getTime())
			, states = {}
		} = options;

		this.uid = uid;
		
		if (sprite.constructor.name === "Object"){
			this._sprites = sprite;
			defaultIndex = Object.keys(sprite)[0];
		}else if ( Array.isArray(sprite) ){
			if (sprite.length){
				if (sprite[0].constructor.name === "Sprite") for (let i in sprite) this._sprites[i] = sprite[i];
				if (sprite[0].constructor.name === "String") this._sprites[defaultIndex] = new Sprite(sprite, {...options.spriteOpt,spriteSheetOpt:options.spriteSheetOpt});
			}else{
				throw new Error("Entity sprite can't be empty");
			}
		}
	
		if (collision === true){
			collision = new Collision();
		}

		if (collision.constructor.name === "Collision"){
			collision.entity = this;
		}

		this._grid      = grid;
		this._collision = collision;
		this._position  = position;
		this._index     = index;
		this._rotate    = rotate;
		this._facingAngle = 0;

		if( !!targetEntity )
			this._targetEntity = targetEntity;
		
		this.drawInPosition();

		this.mvsp = movementSpeed;

		this.onReachActions = []

		this.frameUpdateConfig = {
			fFollowTarget: fFollowTarget
			,update: true
			,deltaTime: 0
			,easingMovement: 'linear'
			,selfFps: 60
			,animationFrameId: null
		}

		this.states = states;
		this.currentState = states[ Object.keys(states)[0] ];

		// document.getElementById('spdSlider').addEventListener('input', e=>{
		// 	e.preventDefault()
		// 	let value = e.srcElement.value;
		// 	value = parseFloat(value)
		// 	this.mvsp = value
		// })
	}
	/**
	 * @return {Sprite} - current sprite
	 */
	get sprite(){
		return this._sprites[this._index];
	}

	addNewSprite(newSprite){
		this._sprites['tst'] = newSprite
		this._index = 'tst'
	}

	get sprites(){
		return this._sprites;
	}

	get collision(){
		return this._collision;
	}
	set collision(value){
		if (value.constructor.name === "Collision"){
			value.entity = this;
		}
		this._collision = value;
	}
	set index(value){
		this._index = value;
	}
	get index(){
		return this._index;
	}
	get position(){
		return this._position;
	}
	set position(value){
		this._position = value;
	}
	set grid(value){
		this._grid = value;
		this.drawInPosition();
	}
	get grid(){
		return this._grid;
	}
	set rotate(value){
		this._rotate = value;
	}
	get rotate(){
		return this._rotate;
	}

	drawInPosition(){
		if (this._grid){
			let find = this._grid.entities.findIndex(entity => entity === this);
			if (find == -1) this._grid.addEntity(this);
		}
	}

	set targetEntity(newTarget){
		this._targetEntity = newTarget;
	}

	/**
	 * sets new target with configuration
	 * @param {Entity}	newTarget 
	 * @param {object}	[options] 
	 * @param {number}	[options.movementSpeed] - sets entity's movement speed
	 * @param {Function|Function[]}	[options.onReach] - on reaching target will execute this as callback( this, target )
	 */
	setNewTarget( newTarget, {movementSpeed, easing, onReach, fFollowTarget=true}={} ){
		if( movementSpeed!=null ){
			this.mvsp = movementSpeed;
		}
		if( easing != null )	this.frameUpdateConfig.easing = easing

		if( onReach != null ){
			if( Array.isArray( onReach ) ){
				this.onReachActions = onReach;
			}else{
				this.onReachActions.push( onReach )
			}
			
		}	

		this.targetEntity = newTarget;

		this.frameUpdateConfig.fFollowTarget = fFollowTarget
		if( this.frameUpdateConfig.fFollowTarget )	this.onUpdate()
	}

	get targetEntity(){	return this._targetEntity	}

	removeTarget(){
		this.targetEntity = null;
		this.onReachActions = [];
	}
	/**
	 * 
	 */
	async onUpdate(){
		
		// timestamp del comienzo del juego
		const startTime = Date.now();
		// timestamp del ciclo actual
		let currentTime = startTime;
		// diferencia de startTime y 
		let delta = 0;
		// modiicador para manejo tiempo (ms a s)
		const timeSpeedMod = .001;
		// se verifica 
		if( this.frameUpdateConfig.animationFrameId != null ){
			cancelAnimationFrame(this.frameUpdateConfig.animationFrameId)
		}

		const updateFunction = (runningTime)=>{

			delta = Date.now() - (currentTime);
			currentTime = Date.now();
			this.frameUpdateConfig.deltaTime = delta;


			if( !!this.targetEntity ){

				let targetPos = this.targetEntity.position;
				let targetX = targetPos.x
					, targetY = targetPos.y;

				let selfPos = this.position;
				let selfX = selfPos.x
					, selfY = selfPos.y;

				let xDiff = targetX - selfX
					, yDiff = targetY - selfY;

				let mvsp = this.mvsp;

				// se calcula el angulo entre este entity y el target
				let angle = this.position.calcAngle(this.targetEntity.position);
				this._facingAngle = angle;

				// se efectua la rotacion del sprite
				this.rotate = this.position.calcAngleDeg( this.targetEntity.position ) + 270
				
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
				nextXPos *= delta * timeSpeedMod
				nextYPos *= delta * timeSpeedMod

				//se verifica que la siguiente posicion no sobre pase la posicion actual del
				// objetivo  
				nextXPos = (Math.abs(nextXPos) >= Math.abs(xDiff)) ? xDiff*distanceX: nextXPos;
				nextYPos = (Math.abs(nextYPos) >= Math.abs(yDiff)) ? yDiff*distanceY: nextYPos;

				// se efectua el movimiento de la entidad
				this.position.move( nextXPos, nextYPos)

				// en caso de que el target este a menos de cierta distancia
				// se elimina el target, para que este no quede eternamente buscando 
				// el mismo target
				if( Math.abs(xDiff*distanceX) <= .05 && Math.abs(yDiff*distanceY) <= .05 ){
					
					this.onReachActions.forEach((val)=>{
						if( val != null )	val(this, this.targetEntity);
					})

					this.currentState.onExplosion();
					this.removeTarget();
					this.frameUpdateConfig.animationFrameId = cancelAnimationFrame(this.frameUpdateConfig.animationFrameId)
					return;
				}
			}

			this.frameUpdateConfig.animationFrameId = requestAnimationFrame(updateFunction)
		}

		updateFunction(0);
	}

	isColliding(otherObject, ignore = []){

		if (otherObject.constructor.name == "GridLayer"){
			if (this.collision){
				let arraycol = otherObject.entities.map(entity => {
					if (!ignore.includes(entity.collision)) return entity.collision;
					else return false;
				});

				arraycol = arraycol.filter(collision => !!collision)

				return this.collision.collide(arraycol);
			}
		}

		if (otherObject.constructor.name == "Entity"){
			if (this.collision && otherObject.collision){
				return this.collision.collide(otherObject.collision);
			}
		}

		return false;
	}

	addNewState(state){
		// let state = new State( name, this, enter, leave )
		this.states[state.name] = state
		if( !this.currentState ){
			this.changeState( this.states[state.name] )
		}
	}

	changeState(state){
		if( !!this.currentState && !!this.currentState.leave ){
			this.currentState.leave();
		}

		if( state instanceof State )
			this.currentState = state
		else
			this.currentState = this.states[state]
		
		if( !!this.currentState.enter )
			this.currentState.enter();
	}

	clone(){
		return new Entity(this._sprites,{
			collision: (!!this.collision) ? this.collision.clone(): this.collision,
			position: new Position(this.position.x, this.position.y),
			index: this.index,
			grid: this.grid
		})
	}
}

let tfn = {
  'linear': function(k) {
		
		return k;
  }, 
  'ease-in': function(k) {
		
		return Math.pow(k, 2)
  }, 
  'ease-out': function(k) {
		return 1 - Math.pow(1 - k, 3);
  }, 
  'ease-in-out': function(k) {
		return .5*(Math.sin((k - .5)*Math.PI) + 1);
  }
};