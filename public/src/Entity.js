class Entity{
	/**
	 * @param {Sprite|String|Array[Sprite|String]|Object[Sprite]} sprite
	 * @param {object} options 
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
		
		this.fFollowTarget = fFollowTarget;

		this.drawInPosition();
		this.update = true
		this.deltaTime  = 0;

		this.mvsp = movementSpeed;
		this.easing = 'linear'

		this.onReachActions = []

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

	setNewTarget( newTarget, {movementSpeed, easing, onReach}={} ){
		if( movementSpeed!=null ){
			this.mvsp = movementSpeed;
		}
		if( easing != null )	this.easing = easing

		if( onReach != null ){
			if( Array.isArray( onReach ) ){
				this.onReachActions = onReach;
			}else{
				this.onReachActions.push( onReach )
			}
			
		}	

		this.targetEntity = newTarget;
	}

	get targetEntity(){	return this._targetEntity	}

	removeTarget(){
		this.targetEntity = null;
		this.onReachActions = [];
	}

	async onUpdate(){
		
		// almacen la cantidad de ms que el juego lleva corriendo
		let runningTime = 0;
		// timestamp del comienzo del juego
		const startTime = Date.now();
		// timestamp del ciclo actual
		let currentTime = startTime;
		// diferencia de startTime y 
		let delta = 0;
		
		while(this.update){
			
			delta = Date.now() - currentTime;
			currentTime = Date.now();
			this.deltaTime = delta;

			runningTime+=delta;

			if( !!this.targetEntity ){

				let targetPos = this.targetEntity.position;
				let targetX = targetPos.x, targetY = targetPos.y;

				let selfPos = this.position;
				let selfX = selfPos.x, selfY = selfPos.y;

				let xDiff = targetX - selfX, yDiff = targetY - selfY;

				let mvsp = this.mvsp;

				// en caso de que el target este a menos de cierta distancia
				// se elimina el target, para que este no quede eternamente buscando 
				// el mismo target
				if( Math.abs(xDiff) <= .1 && Math.abs(yDiff) <= .1 ){
					
					delta = 0;
					this.onReachActions.forEach((val)=>{
						if( val != null )	val();
					})

					this.removeTarget();
					continue
				}

				// se calcula el angulo entre este entity y el target
				let angle = this.position.calcAngle(this.targetEntity.position);
				this._facingAngle = angle;

				this.rotate = this.position.calcAngleDeg( this.targetEntity.position ) + 270

				let yAngle
				let xAngle

				xAngle = (Math.sin(angle))
				yAngle = (Math.cos(angle))
				

				xAngle += delta * Math.sign(Math.sin(angle)) * .05
				yAngle += delta * Math.sign(Math.cos(angle)) * .05

				// se multiplica por  para que la velocidad no sea imbecil
				const mvspAfterMod = mvsp *.1

				// se calcula cual seran las nuevas posiciones en la grid
				let nextXPos = xAngle * mvspAfterMod;
				let nextYPos = yAngle * mvspAfterMod;

				// this.nextXPos = nextXPos
				// this.nextYPos = nextYPos
				// se efectua el movimiento de la entidad
				this.position.move( nextXPos, nextYPos)
			}

			await this.delay(1000/60)
			delta = 0;
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