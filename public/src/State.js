class State {
	constructor(name, context){
		this.name = name;
		this.ctx = context;
	}
	enter(){}
	update(deltaTime){}
	leave(){}
}