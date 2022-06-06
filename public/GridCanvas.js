class GridCanvas {
    
    constructor(id) {
        this.canvas  = document.getElementById(id);
        this.context = this.canvas.getContext('2d');
        this._grid = 9;
        
        this._images = [];

        this._camX = 0;
        this._camY = 0;

        this._maxArea = 0;

        this._onDraw = false;
        this._play = false;
    }

    set images(value) {
        this._images = value;
    }
    get images() {
        return this._images;
    }

    onClick(customFunction){
        this.canvas.addEventListener("click",customFunction);
    }

    async start(drawFunction){
        this._onDraw = drawFunction;
        this._play = true;
        
        window.addEventListener('resize', this.resizeCanvas.bind(this), false);
        this.resizeCanvas();

        while (this._onDraw && this._play){
            this.context.fillStyle = "black";
            this.context.fillRect(-this.canvas.width/2, -this.canvas.height/2, this.canvas.width, this.canvas.height);

            this._onDraw(this ,this.images);
            await this.delay(16); // 60 FPS WOW
        }
    }

    moveCamera(x,y){
        this._camX+=x;
        this._camY+=y;

        this.context.translate(
            x/this._grid, y/this._grid
        );
        console.log(this._camX, this._camY)
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

        this.context.translate(
            this._camX/this._grid, this._camY/this._grid
        );
    }

    drawGrid(grid){
        let gridH = grid.length;
        let gridW = 0;
            
        for (let row of grid){
            if (row) gridW = (row.length > gridW) ? row.length: gridW;
        }

        let hCenter = ((gridH % 2) > 0)? (gridH - 1) / 2 : gridH/2;
        let wCenter = ((gridW % 2) > 0)? (gridW - 1) / 2 : gridW/2;

        for (let h = 0; h < gridH; h++){
            for (let w = 0; w < grid[h].length; w++){
                if (grid[h][w]){
                    let canvasImage = this.images[grid[h][w]-1];

                    if (canvasImage.flipX){
                        this.context.scale(-1, 1);
                        this.context.drawImage(
                            canvasImage.image,
                            w-wCenter,
                            h-hCenter,
                            1,
                            1
                        );
                        this.context.scale(-1, 1);
                    }else{
                        this.context.drawImage(
                            canvasImage.image,
                            w-wCenter,
                            h-hCenter,
                            1,
                            1
                        );
                    }
                }
            }
        }
    }

    drawStaticGrid(grid){
        let gridH = grid.length;
        let gridW = 0;
            
        for (let row of grid){
            if (row) gridW = (row.length > gridW) ? row.length: gridW;
        }

        let hCenter = ((gridH % 2) > 0)? (gridH - 1) / 2 : gridH/2;
        let wCenter = ((gridW % 2) > 0)? (gridW - 1) / 2 : gridW/2;

        for (let h = 0; h < gridH; h++){
            for (let w = 0; w < grid[h].length; w++){
                if (grid[h][w]){
                    let canvasImage = this.images[grid[h][w]-1];
                    
                    if (canvasImage.flipX){
                        this.context.scale(-1, 1);
                        this.context.drawImage(
                            canvasImage.image,
                            w-wCenter - 1 + (this._camX/this._grid),
                            h-hCenter - (this._camY/this._grid),
                            1,
                            1
                        );
                        this.context.scale(-1, 1);
                    }else{
                        this.context.drawImage(
                            canvasImage.image,
                            w-wCenter - (this._camX/this._grid),
                            h-hCenter - (this._camY/this._grid),
                            1,
                            1
                        );
                    }
                }
            }
        }
    }

    delay(ms){
        return new Promise(res => setTimeout(res, ms))
    };

}

class ImageLoader {
    constructor() {
        this.imagesURL = [];
        this.images = [];
        this.imagePromises = [];
    }

    addImageURL(url){
        this.imagesURL.push(url);
    }

    async onLoad(customFunction){
        for(let imageURL of this.imagesURL){
            this.imagePromises.push(this.loadImage(imageURL));
        }
        this.images = await Promise.all(this.imagePromises);
        customFunction(this.images);
    }

    loadImage(url){
        return new Promise(resolve => {
            let image = new Image();
            image.addEventListener('load', () => {
                let CI = new CanvasImage([image]);
                resolve(CI);
            });
            image.src = url;
        });
    }
}

class CanvasImage{
    constructor(imageArray) {
        this._imageArray = imageArray;
        this._active = 0;
        this._flipX = false;
        this._length = imageArray.length;
    }

    get image() {
        return this._imageArray[this._active];
    }

    get flipX(){
        return this._flipX;
    }

    set flipX(val){
        this._flipX = val;
    }

    set active(val){
        this._active = val;
    }
}