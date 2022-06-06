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