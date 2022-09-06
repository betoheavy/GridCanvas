
import {StateMachine, State} from '/@/utils/StateMachine.js'

export default class ImageEditor{
	constructor(canvas, xOffset, yOffset){
		this.canvas = canvas;
		this.context = this.canvas.getContext("2d");
		this.xOffset = xOffset;
		this.yOffset = yOffset;

		this.stateMachine = new StateMachine( this, 'tst' );
		this.stateMachine.add('standby');
		this.stateMachine.currentState = 'standby';

		this.currentMouseEvent = null;

		this.stateMachine.add( drawingState );
		
		this.setEvents();
	}

	setEvents(){
		this.canvas.addEventListener('mousedown', function(e){
			this.stateMachine.changeState('drawing')
			this.currentMouseEvent = e;
		}.bind(this))

		this.canvas.addEventListener('mouseup', function(e){
			
			this.stateMachine.changeState('standby')
			this.currentMouseEvent = e;
			
		}.bind(this))
	}

	update(dt){
		
		this.stateMachine.currentState.update(dt)
	}

	draw() {

		if( !this.currentMouseEvent ){
			console.log( 'mouse no encotrado' )
			return;
		}

		let currX = this.currentMouseEvent.clientX
			, currY = this.currentMouseEvent.clientY

		currX -= this.canvas.offsetLeft;
		currY -= this.canvas.offsetTop;

		let color = 'black', lineWidth = 5

		this.context.beginPath();
		// this.context.moveTo(currX, currY);
		// this.context.lineTo(currX, currY);

		this.context.fillRect(currX,currY,lineWidth,lineWidth)

		this.context.strokeStyle = color;
		this.context.lineWidth = lineWidth;
		this.context.stroke();
		this.context.closePath();
	}
}


export class DrawingState extends State{
	constructor(name){
		super(null, name)
	}

	enter(){
		// console.log( 'soy un drawing state' )
	}

	update(deltaTime){
		this.context.draw();
	}

	leave(){
		// console.log( 'chao drawing' )
	}
}

let drawingState = new DrawingState('drawing')