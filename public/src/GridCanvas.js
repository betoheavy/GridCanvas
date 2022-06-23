class GridCanvas {
    
    constructor(id, options = {}) {
        this.canvas  = document.getElementById(id);
        this.context = this.canvas.getContext('2d');
        
        
        this._grids = [];
        this._maxArea = 0;

        this._onDraw = false;
        this._play = false;

		this._background = null;
		this._focus = null;

        let{
            frameDuration = 16,
            backgroundColor = "black",
            gridSquared = 9,
            debug = false
        }= options;

        this.debug = debug;
        this._gridSquared = gridSquared;
        this.backgroundColor = backgroundColor;
        this.frameDuration = frameDuration;


    }

    set grids(value) {
        this._grids = value;
    }
    get grids() {
        return this._grids;
    }
	set focus(newVal){	
        this._focus = newVal;	
    }

    addGrid(grid){
        this._grids.push(grid);
    }

    onClick(customFunction){
        this.canvas.addEventListener("click",customFunction);
    }

    async start(drawFunction){
        this._onDraw = drawFunction;
        this._play = true;
        
        window.addEventListener('resize', this.resizeCanvas.bind(this), false);
        this.resizeCanvas();

        while (this._play){
            this.context.fillStyle = this.backgroundColor;
            this.context.fillRect(-this.canvas.width/2, -this.canvas.height/2, this.canvas.width, this.canvas.height);

            if (this._onDraw ) this._onDraw(this ,this.grids);
            for (let grid of this._grids) this.drawGrid(grid);

            this._resized = false;
            await this.delay(this.frameDuration);
        }
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this._maxArea = Math.sqrt(window.innerWidth * window.innerHeight) / this._gridSquared; //lado de los cubos de la grid

        this.context.translate(
            this.canvas.width/2 - this._maxArea/2, 
            this.canvas.height/2 - this._maxArea/2
        );

        this.context.scale(
            this._maxArea , 
            this._maxArea
        );

        this.context.save();
    }

    drawGrid(oGrid){

			// console.log('oGrid', oGrid)

        this.context.restore(); //cuando dibujemos un layer nuevo, restaurar al posicion inicial
        this.context.save();    //cuando restaura "ocupa" el save, asi que mejor guardarlo enseguida

        this.context.translate(
            oGrid.position.x, -oGrid.position.y
        );

        for (let entity of oGrid.entities){

            let oSprite = entity.sprite;
            let h = entity.position.y;
            let w = entity.position.x;
            
            if (oSprite.isReady){
                if (oSprite.flipX){
                    this.context.scale(-1, 1);
                    
                    this.context.drawImage(
                        oSprite.image, 
                        w-oGrid.center.x - 1, 
                        -h-oGrid.center.y
                        ,1,1
                    );
                    
                    this.context.scale(-1, 1);
                }
                else{
                    this.context.drawImage(
                        oSprite.image, 
                        w-oGrid.center.x, 
                        -h-oGrid.center.y, 
                        1, 1
                    );
                }
            }
        }
    }

    delay(ms){
        return new Promise(res => setTimeout(res, ms))
    };

    /**
     * sistema para mover camara multi layers
     * @param {*} x 
     * @param {*} y 
     */
    moveAllLayers( x, y ){
        
        let focus           = this._focus;
        let layersToMove    = this.grids.filter(grid=>grid!=focus);
        let collidedLayer   = null;
        let lLength         = layersToMove.length;


        //primero chequea que no haya ningun colisionando (para no guardar safes incorrectos)
        for( let i=0; i<lLength; i++){

            let layer = layersToMove[i];
            layer.position.move(x, y);

            let collided = focus.isColliding(layer) ;

            if (focus && (collided || !!collidedLayer)){
                layer.position.x = layer.safeX;
                layer.position.y = layer.safeY;

                for( let c=i; c>=0; c-- ){
                    let prelayer = layersToMove[c];
                    prelayer.position.x = prelayer.safeX;
                    prelayer.position.y = prelayer.safeY;
                }

                collidedLayer = layer;
                i = lLength;
            }
        }
        
        // si no encotro ninguna, guarda los safes
        for( let i=0; i<lLength; i++){
            let layer = layersToMove[i];
            if(!collidedLayer){
                layer.safeX = layer.position.x;
                layer.safeY = layer.position.y;
            }
        }
    }
}


