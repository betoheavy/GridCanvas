class GameObject{
	/**
	 * @param {string} name 
	 * @param {Images URL Array} sprites 
	 * @param {function} onUpdate 
	 * @param {object} meta 
	 */
	constructor(sprite, meta={}){

		this.uid = "GameObject"+(new Date().getTime());
        this._sprites = []; 
        
        if (sprite.length){
            if (sprite[0].constructor.name === "Sprite") this._sprites = sprite;
            if (sprite[0].constructor.name === "String") this._sprites.push(new Sprite(sprite));
        }

        if (this._sprites === undefined){
            throw new Error("GameObject sprite must be a string or a sprite");
        }

        let {
            collide = false,
            position = new Position(),
            index = 0,
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
		    let arr = [...[...this._grid.grid.flat(), this] ];
		    this._grid.grid = [arr];
        }
	}

	onUpdate(){
		this.updateFunction();
	}
}