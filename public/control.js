class ControlBtns {

	constructor(up='w', down='s', left='a', right='d'){
		this.up = up;
		this.down = down;
		this.left = left;
		this.right = right;

		this.miau = 'g'
	}
}

class Control {

	constructor( callbackDown, callbackUp, controlBtns ){

		this.callbackDown = callbackDown;
		this.callbackUp =callbackUp;

		this.controlBtns = (controlBtns||new ControlBtns());

		this.diccionarioPressedKeys = {};
		
		this.setEvents();
	}

	triggerInput(customCallback){
		if(!!this.callbackDown){
			this.callbackDown(this.diccionarioPressedKeys, this.controlBtns);
		}
		if(!!customCallback){
			customCallback();
		}
	}

	setEvents(){

		window.addEventListener('keydown', (event) => {

			this.preDown();

			let key = event.key;

			this.diccionarioPressedKeys[key] = true;

			// if(!!this.callbackDown){
			// 	this.callbackDown(this.diccionarioPressedKeys, this.controlBtns);
			// }

			this.postDown();
		});

		window.addEventListener('keyup', (event) => {

			this.preDown();

			let key = event.key;
			delete this.diccionarioPressedKeys[key];

			if(!!this.callbackUp){
				this.callbackUp();
			}

			this.postUp()
		});
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