class Entity{
	/**
	 * @param {Sprite|String|Sprite[]|String[]|Object.<Sprite>} [sprites] 						- One or many collections of Sprites to show
	 * @param {Object}											[options]                       - Options for Entity creation
	 * @param {string}											[options.uid]	                - Unique id
	 * @param {Entity}											[options.targetEntity] 			- 
	 * @param {number}											[options.movementSpeed = 1] 	- entity's movement speed
	 * @param {boolean}											[options.fFollowTarget = false] - entity follow flag
	 */
	constructor(sprites, options={}){

		this._sprites = {}; 
		let defaultIndex = '0';

		if (typeof sprites === 'string') sprites = [sprites];
		else if (sprites.constructor.name === "Sprite") sprites = [sprites];
		
		if (sprites.constructor.name === "Object"){
			this._sprites = sprites;
			defaultIndex = Object.keys(sprites)[0];
		}else if ( Array.isArray(sprites) ){
			if (sprites.length){
				if (sprites[0].constructor.name === "Sprite") for (let i in sprites) this._sprites[i] = sprites[i];
				if (sprites[0].constructor.name === "String") this._sprites[defaultIndex] = new Sprite(sprites);
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
			uid = "Entity"+Math.floor(100000 + Math.random() * 900000),
		} = options;

		this.uid = uid;
	
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

	delay(ms){
		return new Promise(res => setTimeout(res, ms))
	};

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
		
		const startTime = Date.now();
		const timeSpeedMod = .001;
		let currentTime = startTime;
		let delta = 0;

		if( this.frameUpdateConfig.animationFrameId != null ){
			cancelAnimationFrame(this.frameUpdateConfig.animationFrameId)
		}

		const updateFunction = (runningTime)=>{

			delta = (Date.now() - (currentTime)) * timeSpeedMod;
			currentTime = Date.now();
			this.frameUpdateConfig.deltaTime = delta;

			if( !!this.targetEntity ){
				
				let thisPos 		= this.position;
				let targetPos 		= this.targetEntity.position;
				let angle 			= thisPos.angleTo(targetPos);
				
				this.rotate 		= angle + 270;

				let calcPos 		= thisPos.clone();
				calcPos.forward(angle, this.mvsp);
				calcPos.x *= delta;
				calcPos.y *= delta;

				let preCalculed = thisPos.clone().add(calcPos);

				// si la distancia precalculada es mayor que la distancia al objetivo, es que se va a pasar
				if (preCalculed.distanceTo(targetPos) > thisPos.distanceTo(targetPos)){
					thisPos.set( targetPos.x, targetPos.y);

					this.onReachActions.forEach((val)=>{
						if( val != null )	val(this, this.targetEntity);
					})

					this.removeTarget();
					this.frameUpdateConfig.animationFrameId = cancelAnimationFrame(this.frameUpdateConfig.animationFrameId)
					return;
				}else{
					thisPos.move( calcPos.x, calcPos.y);
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