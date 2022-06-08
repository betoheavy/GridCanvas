
window.onload = main;

function main() {
    const GC    = new GridCanvas('mainCanvas');
    const IL    = new ImageLoader();
    const SFX   = new SFXPlayer({floppa_miau: './sfx/floppa/miau.ogg', puaj: './sfx/floppa/guah.wav'});

    let left    = false;

    GC.onClick(getCoords);

    IL.addImageURL("img/base.svg");
    IL.addImageURL("img/block.svg");
    IL.addImageURL("img/floppa.png");
    IL.addImageURL("img/trasparent.png");
		IL.addImageURL("img/sword.png");
    
    IL.onLoad(imageArray =>{

				let background  = new GridLayer();
				let objects     = new GridLayer();
        let player      = new GridLayer();

				let controlCallbackDown = move,
					controlCallbackUp = null,
					controlBtns = null,
					controlMouse = {
						click:(e)=>{
							
						}
					}
        let controles   = new Control(
					controlCallbackDown
					, controlCallbackUp
					, controlBtns
					, controlMouse
				);

        imageArray[1].collide = true;
        imageArray[2].collide = true;

        let customGrid = [];
        for (let x = 0; x < 18; x++){
            let col = [];
            for (let y = 0; y < 18; y++){
                if (y == 0 || y == 17 || x == 0 || x== 17) col.push(imageArray[1]);
                else col.push(imageArray[0]);
            }
            customGrid.push(col);
        }

        //dibuja uu pasillo en la esquina para ver si floppa pasa
        customGrid[2][2] = imageArray[1];
        customGrid[2][3] = imageArray[1];
        customGrid[3][2] = imageArray[1];

        background.grid = customGrid;
        player.grid     = [[imageArray[2]]];
				objects.grid		= [[imageArray[3]]];

        
        GC.addGrid(background);
				GC.addGrid(objects);
        GC.addGrid(player);
        GC.start(ctx =>{
            player.grid[0][0].flipX = left;
						controles.triggerInput();

            if (player.isColliding(background)){
              background.posX = background.safeX;
              background.posY = background.safeY;
            }else{
                background.safeX = background.posX;
                background.safeY = background.posY;
            }
        });


        function move(dp, controls){
					
            if( dp[controls.right] ){background.moveLayer(-1/8,0);   left = false;}
            if( dp[controls.left] ) {background.moveLayer(1/8,0);    left = true;}
            if( dp[controls.up] )   {background.moveLayer(0,1/8);}
            if( dp[controls.down] ) {background.moveLayer(0,-1/8);}
            if( dp[controls.miau] ) {SFX.play('floppa_miau')}
						if( dp[controls.click] ){SFX.play('puaj')}
        }
    });
}
    
function getCoords(evt){
    let minDistanceSquared = Math.sqrt(window.innerWidth * window.innerHeight);

    const x = (evt.x -  window.innerWidth/2)/((minDistanceSquared/2)/9);
    const y = (evt.y - window.innerHeight/2)/((minDistanceSquared/2)/9);

    console.log(x.toFixed(2),y.toFixed(2));
}
