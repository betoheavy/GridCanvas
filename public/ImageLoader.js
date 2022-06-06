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