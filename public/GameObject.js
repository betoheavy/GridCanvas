class GridPos{
	constructor({x=0, y=0, gridPos}){

		if( gridPos != null ){
			this({x: gridPos.posX, y: gridPos.posY});
		}else{
			this.x = x;
			this.y = y;
		}
	}
	get posX(){	return this.x;	}
	set posX(newX){	this.x = newX;	}
	get posY(){	return this.y;	}
	set posY(newY){	this.y = newY;	}
}

class Sprite{
	constructor(images){
		this.images = new ImageLoader(images);
		this._spriteIndex = 0;
	}
	get isReady(){	return !this.images.loading;	}
	set isReady(newVal){}

	get baseSprite(){	return this.images[0];	}

	get currentSprite(){	return this.images[this._spriteIndex]	}

	loadSprites(onLoad){
		return this.images.onLoad(onLoad);
	}
}

class GameObject{
	/**
	 * @param {string} name 
	 * @param {Images URL Array} sprites 
	 * @param {function} onUpdate 
	 * @param {object} meta 
	 */
	constructor(grid, name, sprites, onUpdate, meta={}){

		this.uid = name+(new Date().getTime());
		this.gameObjectName = name;

		this._grid = grid;

		this.sprites = new Sprite(sprites);
		this.updateFunction = onUpdate;

		let {
			hasCollition=false
			,x,y, gridPos
		} = meta;

		this.hasCollition = hasCollition;
		
		this.position = new GridPos( {x,y, gridPos} );
		this.start();
	}

	get sprite(){
		return this.sprites.baseSprite;
	}

	start(){
		this.sprites.loadSprites((spr)=>{
			// console.log( 'spr', spr )
		}).then(resp=>{

			this.drawInPosition(resp);

		}).catch(err=>{
			console.error(err);
		})
	}

	drawInPosition(loadedImages){
		
		this._grid.addItem( loadedImages )
		console.log( 'hola on cargar', this.sprites )
	}

	onUpdate(){
		this.updateFunction();
	}
}