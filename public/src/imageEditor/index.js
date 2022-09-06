let canvas = document.createElement('canvas')
canvas.id = 'EditorCanvas';

const body = document.getElementsByTagName('body')[0];

body.appendChild(canvas);

import ImageEditor from './ImageEditor.js';

const imageEditor = new ImageEditor(canvas)

console.log('imageEditor', imageEditor)

function frameUpdate(){
	let lastTime = Date.now();

	let updateCycle = function(time){
		let current = Date.now(),
    dt = current - lastTime;

		lastTime = current;

		imageEditor.update(dt)

		window.requestAnimationFrame(updateCycle);
	}

	window.requestAnimationFrame(updateCycle);
}

frameUpdate();