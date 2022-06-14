class GridCanvas {
    
    constructor(id) {
        this.canvas  = document.getElementById(id);
        this.context = this.canvas.getContext('2d');
        
        this._gridSquared = 9;
        this._grids = [];
        this._maxArea = 0;

        this._onDraw = false;
        this._play = false;

		this._background = null;
		this._focus = null;
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
            this.context.fillStyle = "black";
            this.context.fillRect(-this.canvas.width/2, -this.canvas.height/2, this.canvas.width, this.canvas.height);

            if (this._onDraw ) this._onDraw(this ,this.grids);
            for (let grid of this._grids) this.drawGrid(grid);

            this._resized = false;
            await this.delay(16); // 60 FPS WOW
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
            oGrid.position.x, oGrid.position.y
        );

        oGrid.each((entity,pos) =>{

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
        })
    }

    delay(ms){
        return new Promise(res => setTimeout(res, ms))
    };

    /**
     * sistema para mover camara multi layers
     * @param {*} x 
     * @param {*} y 
     */
    moveCamera( x, y ){
        
        // focus es la layer a la que se le centrara
        // la camara y chekeara colisiones
        let focus = this._focus;
        // el resto de las layer que se moveran
        let layersToMove = this.grids.filter(grid=>grid!=focus);
        // layer colisionada
        let collidedLayer = null;;

        for( let i=0; i<layersToMove.length; i++){

            let layer = layersToMove[i];
            // se mueve una de las layers
            layer.position.move(x, y);
            // en caso de que la layer focus colisione con otra layer
            // o ya se haya colisionado anteriormente
            // se vuelve a la ultima pos safe
            if (focus.isColliding(layer) || !!collidedLayer){
                layer.position.x = layer.safeX;
                layer.position.y = layer.safeY;
                // se actualiza las layer anteriores
                for( let c=i; c>=0; c-- ){
                    let prelayer = layersToMove[c];
                    prelayer.position.x = prelayer.safeX;
                    prelayer.position.y = prelayer.safeY;
                }
                // se actualiza que layer coliosono
                // y se salta el resto del for
                collidedLayer = layer;
                continue;
            }else{
                // en caso de que no haya problema, se actualiza la posicion
                // de la layer
                layer.safeX = layer.position.x;
                layer.safeY = layer.position.y;
            }
            
        }
    }
}


