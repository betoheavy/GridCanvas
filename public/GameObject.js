class GameObject{
	/**
	 * 
	 * @param {string} name 
	 * @param {Images Array} sprites 
	 * @param {function} onUpdate 
	 * @param {boolean} hasCollition 
	 */
	constructor(name, sprites, onUpdate, hasCollition = true){

		this.sprites = sprites;
		this.updateFunction = onUpdate;
		this.hasCollition = hasCollition;
		this.gameObjectName = name;
	}

	get sprite(){
		return this.sprites[0] || this.sprites || null;
	}
	set sprite(val){
		this.sprites.push(val);
	}

	onUpdate(){
		this.updateFunction();
	}
}