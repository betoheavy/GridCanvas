class Entity{
	/**
	 * @param {Sprite|String|Array[Sprite|String]|Object[Sprite]} sprite
	 * @param {object} options 
	 */
	constructor(sprite, options={}){

		this.uid = "Entity"+(new Date().getTime());
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
            collision = false,
            position = new Position(),
            index = defaultIndex,
            grid = false,
						targetEntity = null,
						fFollowTarget = false
        } = options;
		
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

		this._grid = grid;
		this._collision = collision;
		this._position = position;
		this._index = index;
		this._facingAngle = 0;

		if( !!targetEntity )
			this._targetEntity = targetEntity;
		
		this.fFollowTarget = fFollowTarget;

		this.drawInPosition();
		this.update = true
		this.deltaTime  = 0;

		this.mvsp = 1;

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

	set targetEntity(newTarget){
		this._targetEntity = newTarget;
	}

	get targetEntity(){	return this._targetEntity	}

	removeTarget(){
		this.targetEntity = null;
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

	async onUpdate(){
		// this.updateFunction();
		let runningTime = 0;
		const startTime = Date.now();
		let preCycleTime = startTime;
		let delta = 0;
		
		// console.log( {runningTime, startTime} )
		while(this.update){
			
			delta = Date.now() - preCycleTime;
			preCycleTime = Date.now();
			this.deltaTime = delta;

			// if( delta < 100 ){
				
			// 	continue
			// };
			runningTime+=delta;

			if( !!this.targetEntity ){

				let targetPos = this.targetEntity.position;
				let targetX = targetPos.x, targetY = targetPos.y;

				let selfPos = this.position;
				let selfX = selfPos.x, selfY = selfPos.y;

				let xDiff = targetX - selfX, yDiff = targetY - selfY;

				let mvsp = this.mvsp;
				let minSpeed = .01;

				if( Math.abs(xDiff) <= .1 && Math.abs(yDiff) <= .1 ){
					console.log( 'on target vieja' )
					this.removeTarget();
					delta = 0;
					continue
				}

				let moveDirX = Math.sign(xDiff) * mvsp * delta
				let moveDirY = Math.sign(yDiff) * mvsp * delta

				let angle = this.position.calcAngle(this.targetEntity.position);
				this._facingAngle = angle;


				let xSS = Math.sin(angle) * mvsp * .01 * delta/2
				let ySS = Math.cos(angle) * mvsp * .01 * delta/2

				this.position.move( xSS, ySS)
			}

			await this.delay(10)
			delta = 0;
			
			// console.log( delta, runningTime )
		}
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