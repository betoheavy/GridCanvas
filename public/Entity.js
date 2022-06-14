class Entity{
	/**
	 * @param {string} name 
	 * @param {Images URL Array} sprites 
	 * @param {function} onUpdate 
	 * @param {object} meta 
	 */
	constructor(sprite, meta={}){

		this.uid = "Entity"+(new Date().getTime());
        this._sprites = {}; 

        let defaultIndex = '0';

        if (sprite.constructor.name === "Sprite") sprite = [sprite];
        if (sprite.constructor.name === "String") sprite = [sprite];
        
        if (sprite.constructor.name === "Object"){
            this._sprites = sprite;
            defaultIndex = Object.keys(sprite)[0];
        }

        if (sprite.constructor.name === "Array"){
            if (sprite.length){
                if (sprite[0].constructor.name === "Sprite") for (let i in sprite) this._sprites[i] = sprite[i];
                if (sprite[0].constructor.name === "String") this._sprites[defaultIndex] = new Sprite(sprite);
            }else{
                throw new Error("Entity sprite can't be empty");
            }
        }

        let {
            collide = false,
            position = new Position(),
            index = defaultIndex,
            grid = false
        } = meta;
		

        this._grid = grid;
		this._collide = collide;
        this._position = position;
        this._index = index;

        this.drawInPosition();

	}

	get sprite(){
		return this._sprites[this._index];
	}

    get collide(){
        return this._collide;
    }

    set collide(value){
        this._collide = value;
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
    set grid(value){
        this._grid = value;
        this.drawInPosition();
    }
    get grid(){
        return this._grid;
    }

	drawInPosition(){
        if (this._grid){
		    this._grid.addEntity(this);
        }
	}

	onUpdate(){
		this.updateFunction();
	}

    clone(){
        return new Entity(this._sprites,{
            collide: this.collide,
            position: new Position(this.position.x, this.position.y),
            index: this.index,
            grid: this.grid
        })
    }
}