class Sprite{
    constructor(images = [], options = {}) {

        this._imageArray = [];
        this._length = 0;
        this._isReady = false;

        if (!Array.isArray(images)) images = [images];
        if (images.length == 0) throw new Error("No images provided");

        let thisSprite = this;

        if (images[0].constructor.name === "HTMLImageElement"){
            thisSprite._imageArray = images;
            thisSprite._length = thisSprite._imageArray.length;
            thisSprite._isReady = true;
        }else{
            thisSprite.imageLoader = new ImageLoader(images);
            
            thisSprite.onImagesLoaded(custom => {}).then(response=>{
                thisSprite._imageArray = response
                thisSprite._length = thisSprite._imageArray.length;
                thisSprite._isReady = true;
            }).catch(err=>{
                console.error(err);
            })
        }

        let{
            index = 0,
            flipX = false,
            ticks = 30
        }= options;

        this._index = index;
        this._flipX = flipX;
        this._ticks = ticks;

        this.currentTick = 0;

    }

    get image() {
        
        if (this.currentTick < this._ticks){
            this.currentTick++;
        }else{
            this.currentTick = 0;
            this._index++;
            if (this._index >= this._length) this._index = 0;
        }
        return this._imageArray[this._index];
    }

    get flipX(){
        return this._flipX;
    }

    set flipX(val){
        this._flipX = val;
    }

    set index(val){
        this._index = val;
    }

    onImagesLoaded(onLoad){
		return this.imageLoader.onLoad(onLoad);
	}

    get isReady(){
        return this._isReady;	
    }

    clone(){
        let cloned = new CanvasImage(this._imageArray);
        cloned.flipX = this._flipX;
        return cloned;
    }
}