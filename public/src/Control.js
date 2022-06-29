class ControlBtns {

	constructor(up='w', down='s', left='a', right='d'){
		this.up = up;
		this.down = down;
		this.left = left;
		this.right = right;

		this.miau = 'g';
		this.click = 'mousedown'

		this._useClick =	true;;
	}
	setOnlick(callback){

	}
}

class Control {
	/**
	 * 
	 * @param {function} callbackDown 
	 * @param {function} callbackUp 
	 * @param {ControlBtns} controlBtns 
	 * @param {object} mouseController 
	 */
	constructor( callbackDown, callbackUp, controlBtns ){

		this.callbackDown = callbackDown;
		this.callbackUp =callbackUp;
		this.controlBtns = (controlBtns||new ControlBtns());
		this.dicActiveControls = {};
		
		this.setEvents();
		this.setMouseEvents();
	}

	setMouseEvents(){
		

		// for( let evt in controls ){

		// 	window.addEventListener(evt, controls[evt]);
		// }
	}

	triggerInput(customCallback){
		if(!!this.callbackDown){
			this.callbackDown(this.dicActiveControls, this.controlBtns);
		}
		if(!!customCallback){
			customCallback();
		}
	}

	setEvents(){

		let downEventFunction = (event)=>{
			this.preDown();
			let key = event.key;
			this.dicActiveControls[key] = true;
			this.postDown();
		}

		let upEventFunction = (event)=>{
			this.preUp();
			let key = event.key;
			delete this.dicActiveControls[key];
			if(!!this.callbackUp) this.callbackUp();
			this.postUp()
		}

		window.addEventListener('keydown', downEventFunction);
		window.addEventListener('keyup', upEventFunction);

		if( !!this.controlBtns._useClick ){
			window.addEventListener('mousedown', ()=>{
				let key = 'mousedown';
				this.dicActiveControls[key] = true;
			});

			window.addEventListener('mouseup', ()=>{
				let key = 'mousedown';
				delete this.dicActiveControls[key];
			})
		}
	}

	preDown(){
		
	}

	postDown(){
		
	}

	preUp(){

	}

	postUp(){

	}

}