class CanvasImage{
    constructor(imageArray) {
        this._imageArray = imageArray;
        this._active = 0;
        this._flipX = false;
        this._collide = false;
        this._length = imageArray.length;
    }

    get image() {
        return this._imageArray[this._active];
    }

    get flipX(){
        return this._flipX;
    }

    get collide(){
        return this._collide;
    }

    set flipX(val){
        this._flipX = val;
    }

    set active(val){
        this._active = val;
    }

    set collide(val){
        this._collide = val;
    }

    clone(){
        let cloned = new CanvasImage(this._imageArray);
        cloned.flipX = this._flipX;
        cloned.collide = this._collide;
        return cloned;
    }
}