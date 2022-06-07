
window.onload = main;

function main() {
    const GC    = new GridCanvas('mainCanvas');
    const IL    = new ImageLoader();
    const SFX   = new SFXPlayer({floppa_miau: './sfx/floppa/miau.ogg'});

    let left    = false;

    GC.onClick(getCoords);

    IL.addImageURL("img/base.svg");
    IL.addImageURL("img/block.svg");
    IL.addImageURL("img/floppa.png");
    IL.addImageURL("img/trasparent.png");
    
    IL.onLoad(imageArray =>{

        var background  = new GridLayer();
        var player      = new GridLayer();
        var controles   = new Control(move);

        let customGrid = [];
        for (let x = 0; x < 18; x++){
            let col = [];
            for (let y = 0; y < 18; y++){
                if (y == 0 || y == 17 || x == 0 || x== 17) col.push(imageArray[1]);
                else col.push(imageArray[0]);
            }
            customGrid.push(col);
        }

        background.grid = customGrid;
        player.grid     = [[imageArray[2]]];

        
        GC.addGrid(background);
        GC.addGrid(player);
        GC.start(ctx =>{
            player.grid[0][0].flipX = left;
        });


        function move(dp, controls){
            if( dp[controls.right] ){background.moveLayer(-1,0);   left = false;}
            if( dp[controls.left] ) {background.moveLayer(1,0);    left = true;}
            if( dp[controls.up] )   {background.moveLayer(0,1);}
            if( dp[controls.down] ) {background.moveLayer(0,-1);}
            if( dp[controls.miau] ) {SFX.play('floppa_miau')}
        }
    });
}
    
function getCoords(evt){
    let minDistanceSquared = Math.sqrt(window.innerWidth * window.innerHeight);

    const x = (evt.x -  window.innerWidth/2)/((minDistanceSquared/2)/9);
    const y = (evt.y - window.innerHeight/2)/((minDistanceSquared/2)/9);

    console.log(x.toFixed(2),y.toFixed(2));
}
