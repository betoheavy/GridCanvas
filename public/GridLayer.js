class GridLayer {
    constructor() {

		this.uid = 'GridLayer'+(new Date().getTime());

        this._entities = [];
        this._entitiesLength = 0;
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

    set grid(array){
        
        let heigth = array.length;
        let width = 0;
            
        for (let row of array) if (row) width = (row.length > width) ? row.length: width;

        let cx = ((heigth % 2) > 0)? (heigth - 1) / 2 : heigth/2;
        let cy = ((width % 2)  > 0)? (width -  1) / 2 : width/2;

        for (let row = 0; row < heigth; row++){
            for (let col = 0; col < width; col++){
                if (array[row] && array[row][col]){
                    let cloned = array[row][col].clone();
                    cloned.position.set(col-cy,cx-row);
                    this._entities.push(cloned);
                    this._entitiesLength++;
                }
            }
        }
    }

    each(funct){
        for (let h = 0; h < this._entitiesLength; h++){
            if (this._entities[h]){
                funct(this._entities[h],h);
            }
        }
    }

	addEntity(newItem){	
        this._entities.push(newItem);	
        this._entitiesLength++;
    }

    isColliding(anotherGrid){
        let collided = false;
        let thisGrid = this;

        thisGrid.each(checkWithAnother);

        function checkWithAnother(thisCell, pos){
            if (thisCell.collide){

                let th = -thisCell.position.y;
                let tw = thisCell.position.x;

                anotherGrid.each((anotherCell, pos2)=>{
                    if (anotherCell.collide){

                        let ah = -anotherCell.position.y;
                        let aw = anotherCell.position.x;

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