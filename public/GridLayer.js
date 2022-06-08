class GridLayer {
    constructor() {
        this._grid = [];
        this._heigth = 0;
        this._width = 0;
        this._hcenter = 0;
        this._wcenter = 0;
        
        this._posX = 0;
        this._posY = 0;
    }

    get grid(){
        return this._grid;
    }

    get hCenter(){
        return this._hcenter;
    }

    get wCenter(){
        return this._wcenter;
    }

    get posX(){
        return this._posX;
    }

    get posY(){
        return this._posY;
    }

    set posX(val){
        this._posX = val;
    }

    set posY(val){
        this._posY = val;
    }

    set grid(arry){
        this._grid = arry;

        this._heigth = this._grid.length;
        this._width = 0;
            
        for (let row of this._grid){
            if (row) this._width = (row.length > this._width) ? row.length: this._width;
        }

        this._hcenter = ((this._heigth % 2) > 0)? (this._heigth - 1) / 2 : this._heigth/2;
        this._wcenter = ((this._width % 2)  > 0)? (this._width -  1) / 2 : this._width/2;
    }

    each(funct){
        for (let h = 0; h < this._heigth; h++){
            for (let w = 0; w < this._grid[h].length; w++){
                if (this._grid[h][w]){
                    funct(this._grid[h][w],h,w);
                }
            }
        }
    }

    moveLayer(x,y){
        this._posX+=x;
        this._posY+=y;
    }

    isColliding(anotherGrid){
        let collided = false;
        let thisGrid = this;

        thisGrid.each(checkWithAnother);

        function checkWithAnother(thisCell, th, tw){
            if (thisCell.collide){
                anotherGrid.each((anotherCell,ah,aw)=>{
                    if (anotherCell.collide){
                        let thisPosX    = tw - thisGrid.wCenter    + thisGrid.posX;
                        let anotherPosX = aw - anotherGrid.wCenter + anotherGrid.posX;

                        if (thisPosX > (anotherPosX-1) && thisPosX < (anotherPosX + 1)){
                            let thisPosY    = th - thisGrid.hCenter    + thisGrid.posY;
                            let anotherPosY = ah - anotherGrid.hCenter + anotherGrid.posY;

                            if (thisPosY > (anotherPosY-1) && thisPosY < (anotherPosY + 1)){
                                collided = true;
                                return;
                            }
                        }
                    }
                });
            }
            if (collided) return;
        }

        return collided;
    }

}