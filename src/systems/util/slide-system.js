const SLIDE_SPEED = 0.003;

class SlideSystem {

    _components;
    _callback;
    _state;

    constructor() {
        this._components = [];
    }

    add(object3d, entity) {
        this._components.push(new SlideComponent(object3d, entity));
    }

    triggerSlideout = (callback) => {
        this._callback = callback;
        this._state = 'slideout';
    }

    mount = () => {
        this._state = 'slidein';
    }

    update = (delta) => {
        switch(this._state) {
            case 'slidein':
                let ready = true
                this._components.forEach(comp => {
                    if(comp.slideIn(delta)) {
                        ready = false;
                    }
                })
                if(ready) {
                    this._state = 'ready';
                }
                break;
            case 'slideout':
                let done = true;
                this._components.forEach(comp => {
                    if(comp.slideOut(delta)) {
                        done = false;
                    }
                })
                if(done && this._callback) {
                    this._callback();
                }
                break;
        }
    }
}

class SlideComponent {

    _object3d;
    _entity;

    _outY;
    _inY;
    _slide;

    constructor(object3d, entity) {
        this._object3d = object3d;
        this._entity = entity;
        this._inY = entity.inY;
        this._outY = entity.outY;
        this._slide = this._inY - this._outY;
    }

    slideIn = (delta) => {
        const diff = this._inY - this._object3d.position.y;
        if(diff * this._slide > 0) {
            this._object3d.position.y += this._slide * delta * SLIDE_SPEED;
        }
        const newDiff = this._inY - this._object3d.position.y
        if(newDiff * this._slide <= 0) {
            this._object3d.position.y = this._inY;
            return false;
        }
        return true;
    }

    slideOut = (delta) => {
        const diff = this._outY - this._object3d.position.y;
        if(diff * this._slide < 0) {
            this._object3d.position.y -= this._slide * delta * SLIDE_SPEED;
        }
        const newDiff = this._outY - this._object3d.position.y
        if(newDiff * this._slide >= 0) {
            this._object3d.position.y = this._outY;
            return false;
        }
        return true;
    }

}

export default SlideSystem;