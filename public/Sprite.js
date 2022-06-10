class Sprite{
    constructor(images = []) {

        this._imageArray = [];
        this._index = 0;
        this._flipX = false;
        this._collide = false;
        this._length = 0;

        if (images !== Array) images = [images];
        if (images.length == 0) throw new Error("No images provided");

        let thisSprite = this;

        if (images[0].constructor.name === "HTMLImageElement"){
            thisSprite._imageArray = images;
            thisSprite._length = thisSprite._imageArray.length;
        }else{
            thisSprite.imageLoader = new ImageLoader(images);
            thisSprite.onImagesLoaded(custom => {
            }).then(response=>{
                thisSprite._imageArray = response
                thisSprite._length = thisSprite._imageArray.length;
            }).catch(err=>{
                console.error(err);
            })
        } 
        
    }

    get image() {
        return this._imageArray[this._index];
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
        this._index = val;
    }

    set collide(val){
        this._collide = val;
    }

    onImagesLoaded(onLoad){
		return this.imageLoader.onLoad(onLoad);
	}

    get isReady(){
        return !this.imageLoader.loading;	
    }

    clone(){
        let cloned = new CanvasImage(this._imageArray);
        cloned.flipX = this._flipX;
        cloned.collide = this._collide;
        return cloned;
    }
}