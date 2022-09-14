class GridLayer {
	/**
	 * Main class for managing the layers as grids
	 * 
	 * @param {"string"}	id							- id is the html DOM id of the canvas
	 * @param {"Object"}	[options]					- default options
	 * @param {"boolean"}	[options.frameDuration]		- number of milliseconds of animation;
	 * @param {"string"}	[options.backgroundColor] 	- color of the background;
	 * @param {"boolean"}	[options.debug]				- indicating  whether the canvas is debug enabled;
	 * @param {"Camera[]"}	[options.cameras]			- list of Cameras that gridCanvas going to render;
	 * @param {"number"}	[options.mainCamera]		- Select the main camera of the list of cameras to render Sprites default resolution based on its level of Zoom;
	 *                                                                                                                      
	 */
	constructor(options = {}) {

		this.uid = 'GridLayer'+(new Date().getTime());
		this.entities = [];
		this.entitiesLength = 0;

		let{
			frameDuration = 16,
			backgroundColor = "black",
			cameras = [new Camera()],
			mainCamera = '0',
			debug = false
		}= options;

		this._center = new Position();
		this._position = new Position();
	}

	get center(){
		return this._center;
	}

	set position(pos){
		this._position = pos;
	}
	
	get position(){
		return this._position;
	}

	/**
	 * Converts the position of a matrix of Entities into a grid, then adding to the GridCanvas
	 * @param {Array.<Entity[]>} 	array 				- The matrix of Entities
	 * @param {Object} 				options 			- default options
	 * @param {boolean} 			options.clone 		- if is true, clone the Entities before passing into the GridCanvas
	 * @param {Position} 			options.rowOffset 	- position of the next row based on the last one (default is [0,-1], making every row 1 below the last one)
	 * @param {Position} 			options.colOffset 	- position of the next Entity in the row, making every column (default is [1,0], making every column 1 to the right of the last one)
	 * @param {string} 				options.center 		- rule to center the entities of the matrix ("center","bottomLeft","topRight")
	 */
	grid(array, options = {}){
		
		let heigth = array.length;
		let width = 0;
		for (let row of array) if (row) width = (row.length > width) ? row.length: width;

		let{
			clone = false,
			rowOffset = new Position(0,-1),
			colOffset = new Position(1,0),
			center = "center",
		}= options;

		let topRight = new Position(0,0);
		let botLeft = new Position(0,0);

		// busca los limites del grid
		for (let row = 0; row < heigth; row++){
			for (let col = 0; col < width; col++){

				if (array[row] && array[row][col]){
					let cloned = array[row][col].clone();

					cloned.position.set(
						((col * colOffset.x) + (row * rowOffset.x)), 
						((row * rowOffset.y) + (col * colOffset.y)) 
					);

					botLeft.x = (cloned.position.x < botLeft.x)? cloned.position.x : botLeft.x;
					botLeft.y = (cloned.position.y < botLeft.y)? cloned.position.y : botLeft.y;
					topRight.x = (cloned.position.x > topRight.x)? cloned.position.x : topRight.x;
					topRight.y = (cloned.position.y > topRight.y)? cloned.position.y : topRight.y;

				}
			}
		}

		// revisa la regla de entrada para el centro
		let trueCenter;
		switch (center){
			case "center": 
				trueCenter = new Position(
					botLeft.x + (topRight.x - botLeft.x)/2,
					botLeft.y + (topRight.y - botLeft.y)/2
				);
				break;
			case "bottomLeft": 
				trueCenter = botLeft;
				break;
			case "topRight": 
				trueCenter = topRight;
				break;
			default: 
				break;
		}

		for (let row = 0; row < heigth; row++){
			for (let col = 0; col < width; col++){

				if (array[row] && array[row][col]){
					let cloned = array[row][col];
					if (clone) cloned = cloned.clone();

					cloned.position.set(
						((col * colOffset.x) + (row * rowOffset.x)), 
						((row * rowOffset.y) + (col * colOffset.y))
					);

					cloned.position.move(-trueCenter.x,-trueCenter.y);
					this.addEntity(cloned);
				}
			}
		}
	}

	addEntity(newItem){	
		this.entities.push(newItem);
		newItem.grid = this;
		this.entitiesLength++;
	}

	isColliding(otherGrid, ignore = []){
		let collided = false;
		let thisGrid = this;

		for (let thisCell of thisGrid.entities){
			if (thisCell.collision){
				for (let otherCell of otherGrid.entities){
					if (otherCell.collision && !ignore.includes(otherCell)){
						collided = thisCell.collision.collide(otherCell.collision);
						if (collided) break;     
					}
				}
			}
			if (collided) break;  
		}
		
		return collided;
	}

}