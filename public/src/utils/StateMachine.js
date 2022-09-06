export class State{
	constructor(ctx, name){
		this.context = ctx;
		if( !!name )
			this.name = name;
		else{
			const random = Math.random();
			let uuid = Number(random).toString(32)
			this.name = uuid;
		}
	}
	enter(){}
	update(dt){}
	leave(){}
}

export class StateMachine{
	constructor(ctx, name, stateDef={}, currentState){
		
		this.baseCtx = ctx;
		this.name = name;

		this.states = Array.isArray(stateDef) ? 
			arr.reduce((acc,curr)=>(acc[curr.name]='',acc),{})
			: stateDef;
		this._currentState = currentState;
	}

	get currentState(){
		return this.states[this._currentState]
	}
	set currentState(stateName){
		this._currentState = stateName
	}

	add(state, enter, update, leave, ctx){

		let newState;
		let stateName = state;

		if( state instanceof State ){
			state.context = this.baseCtx;
			newState = state;
			stateName = state.name;

		}else{
			const stateCtx = ctx || this.baseCtx;
			newState = new State(stateCtx, state);
		
			if( !!enter ) newState.enter = enter;
			if( !!update ) newState.update = update;
			if( !!leave ) newState.leave = leave;
		}

		this.states[stateName] = newState;
		return this.states;
	}

	update(){
		let currentState = this.currentState;
		if( !currentState ){

		}else{
			currentState.update();
		}
	}

	changeState(newState){

		if( !!this.getState(newState) ){
			
			if(this.getState(newState).name === this._currentState)	return;
		}

		let currentState = this.currentState;
		if( !!currentState )	currentState.leave();

		this.setCurrentState(newState);

		this.currentState.enter();
	}

	setCurrentState(state){
		this._currentState = this.getState(state).name;
		return this.currentState;
	}

	getState(state){
		if( state instanceof State ){
			return state
		}else{
			return this.states[state];
		}
	}
}