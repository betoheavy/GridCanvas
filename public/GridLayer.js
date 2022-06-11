class GridLayer {
    constructor() {

		this.uid = 'GridLayer'+(new Date().getTime());

        this._grid = [];
        this._heigth = 0;
        this._width = 0;

        this._center = new Position();
        this._position = new Position();
    }

    get grid(){
        return this._grid;
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

    set grid(arry){
        this._grid = arry;

        this._heigth = this._grid.length;
        this._width = 0;
            
        for (let row of this._grid){
            if (row) this._width = (row.length > this._width) ? row.length: this._width;
        }

        this._center.y = ((this._heigth % 2) > 0)? (this._heigth - 1) / 2 : this._heigth/2;
        this._center.x = ((this._width % 2)  > 0)? (this._width -  1) / 2 : this._width/2;
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

	addItem(newItem){	
        this._grid.push(newItem);	
    }

    isColliding(anotherGrid){
        let collided = false;
        let thisGrid = this;

        thisGrid.each(checkWithAnother);

        function checkWithAnother(thisCell, th, tw){
            if (thisCell.collide){
                anotherGrid.each((anotherCell,ah,aw)=>{
                    if (anotherCell.collide){
                        let thisPosX    = tw - thisGrid.center.x    + thisGrid.position.x;
                        let anotherPosX = aw - anotherGrid.center.x + anotherGrid.position.x;

                        if (thisPosX > (anotherPosX-1) && thisPosX < (anotherPosX + 1)){
                            let thisPosY    = th - thisGrid.center.y    + thisGrid.position.y;
                            let anotherPosY = ah - anotherGrid.center.y + anotherGrid.position.y;

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