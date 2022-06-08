class GridCanvas {
    
    constructor(id) {
        this.canvas  = document.getElementById(id);
        this.context = this.canvas.getContext('2d');
        
        this._grid = 9;
        this._grids = [];
        this._maxArea = 0;

        this._onDraw = false;
        this._play = false;
    }

    set grids(value) {
        this._grids = value;
    }
    get grids() {
        return this._grids;
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
        this._maxArea = Math.sqrt(window.innerWidth * window.innerHeight) / this._grid; //lado de los cubos de la grid

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

        this.context.restore(); //cuando dibujemos un layer nuevo, restaurar al posicion inicial
        this.context.save();    //cuando restaura "ocupa" el save, asi que mejor guardarlo enseguida

        this.context.translate(
            oGrid.posX, oGrid.posY
        );

        oGrid.each((canvasImage,h,w) =>{
            if (canvasImage.flipX){
                this.context.scale(-1, 1);
                
                this.context.drawImage(
                    canvasImage.image, 
                    w-oGrid.wCenter - 1, 
                    h-oGrid.hCenter
                    ,1,1
                );
                
                this.context.scale(-1, 1);
            }
            else{
                this.context.drawImage(
                    canvasImage.image, 
                    w-oGrid.wCenter, 
                    h-oGrid.hCenter, 
                    1, 1
                );
            }
        })
    }

    delay(ms){
        return new Promise(res => setTimeout(res, ms))
    };

}


