class Collision{
    /**
     * 
     * @param {string} type 
     * @param {object} options 
     */
    constructor(type = "rectangle", options = {}) {

		this.uid = 'Collision'+(new Date().getTime());
        
        let {
            offset = new Position(),
            width = 1,
            height = 1,
            radius = 1,
            entity = null
        } = options;

        this.type = type;
		this.offset = offset;
        this.width = width;
        this.height = height;
        this.radius = radius;
        this.entity = entity;
    }

    collide(target) {
        let result = false;

        if      (!this.entity)          throw new Error("This collision doesn't have a parent entity");
        else if (!this.entity.grid)     throw new Error("This collision doesn't have a parent grid");
        else if (!target.entity)        throw new Error("Target collision doesn't have a parent entity");
        else if (!target.entity.grid)   throw new Error("Target collision doesn't have a parent grid");
        else{
            let a = this.entity.position.sub(this.entity.grid.center).add(this.entity.grid.position).add(this.offset);
            let b = target.entity.position.sub(target.entity.grid.center).add(target.entity.grid.position).add(target.offset);

            if (this.type == "rectangle"){
                if (target.type == "rectangle"){
                    if (a.x > (b.x-this.width) && a.x < (b.x+this.width)){
                        if (a.y > (b.y-this.height) && a.y < (b.y + this.height)){
                            result = true; 
                        }
                    }
                }
            }

            if (this.type == "circle"){
                if (target.type == "circle"){
                    
                    let distance = a.distanceTo(b);

                    if (distance <= (this.radius + target.radius)){
                        collided = true;
                        return;
                    }
                }
            }
            
        }

        return result;
    }

    clone(){
        return new Collision(this.type, {
            offset:new Position(this.offset.x, this.offset.y),
            width: this.width,
            height: this.height,
            radius: this.radius,
            entity: this.entity
        })
    }
}
