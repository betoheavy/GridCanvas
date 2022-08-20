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
				if (sprite[0].constructor.name === "String") this._sprites[defaultIndex] = new Sprite(sprite, {...options.spriteOpt,spriteSheetOpt:options.spriteSheetOpt});
			}else{
				throw new Error("Entity sprite can't be empty");
			}
		}

		let {
			collision = false,
			position = new Position(),
			index = defaultIndex,
			grid = false,
		} = options;

		if( !!options.spriteSheetOpt ){
			let {
				spriteSheetOpt:{
					xBegin=0,
					yBegin=0,
					spriteWitdth,
					spriteHeight,
					endIndex,
					xOff=0,
					yOff=0
				}={}
			} = options;

			this.spriteSheetOpt = typeof spriteSheetOpt === 'object'?spriteSheetOpt: {
				xBegin:0,
				yBegin:0,
				spriteWitdth: 128,
				spriteHeight: 128,
				endIndex: undefined,
				xOff:0,
				yOff:0
			};
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

		this.drawInPosition();

	}

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

	get isSpritesheet(){
			return !!this.spriteSheetOpt;
	}

	moveToPoint(x, y, velocity){

		while( this.position.x!=x || this.position.y!=y ){
			let currentX = this.position.x, currentY = this.position.y;
			let nextX	= currentX - x
			, nextY = currentY - y;

			x -= 10;
			y -= 10;

			this.position.move(nextX/velocity, nextY/velocity);
		}
	}

	drawInPosition(){
		if (this._grid){
			let find = this._grid.entities.findIndex(entity => entity === this);
			if (find == -1) this._grid.addEntity(this);
		}
	}

	onUpdate(){
		this.updateFunction();
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