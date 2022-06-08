
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
					controlBtns = null;
				
        let controles   = new Control(
					controlCallbackDown
					, controlCallbackUp
					, controlBtns
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

        //dibuja un pasillo en la esquina para ver si Floppa pasa
        customGrid[2][2] = imageArray[1];
        customGrid[2][3] = imageArray[1];
        customGrid[3][2] = imageArray[1];

        background.grid = customGrid;
        player.grid     = [[imageArray[2]]];
				// objects.grid		= [[imageArray[4]]];

        
        GC.addGrid(background);
				GC.addGrid(objects);
        GC.addGrid(player);
				GC.focus = player;
        GC.start(ctx =>{
            player.grid[0][0].flipX = left;
						controles.triggerInput();
        });

				

				let swordGO = new GameObject(objects, 'sword_test', ['img/sword.png'], {});
				let fueguitoGO = new GameObject(objects, 'fuego', ['img/trasparent.png'], {});


        function move(dp, controls){

					let vel = 1/8;
					
					if( dp[controls.right] ){GC.moveCamera(-vel,0);left = false;}
					if( dp[controls.left] ) {GC.moveCamera(vel,0); left = true;}
					if( dp[controls.up] )   {GC.moveCamera(0,vel)}
					if( dp[controls.down] ) {GC.moveCamera(0,-vel)}
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
