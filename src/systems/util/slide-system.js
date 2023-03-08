const SLIDE_SPEED = 0.003;

class SlideSystem {

    _components;
    _callback;
    _state;
    _slideSpeed

    get ready() {
        return this._state === 'ready';
    }

    constructor(slideSpeed) {
        this._components = [];
        this._slideSpeed = slideSpeed ?? SLIDE_SPEED;
    }

    add(object3d, entity) {
        this._components.push(new SlideComponent(object3d, entity, this._slideSpeed));
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

    _slideSpeed

    constructor(object3d, entity, slideSpeed) {
        this._object3d = object3d;
        this._entity = entity;
        this._inY = entity.inY ?? object3d.position.y;
        this._outY = entity.outY ?? object3d.position.y;
        this._slide = this._inY - this._outY;
        this._slideSpeed = slideSpeed;
    }

    slideIn = (delta) => {
        const diff = this._inY - this._object3d.position.y;
        if(diff * this._slide > 0) {
            this._object3d.position.y += this._slide * delta * this._slideSpeed;
        }
        const newDiff = this._inY - this._object3d.position.y
        if(newDiff * this._slide <= 0) {
            this._object3d.position.y = this._inY;
            return false;
        }
        return true;
    }

    slideOut = (delta) => {
        if(this._entity.ignoreSlideOut) return false;
        const diff = this._outY - this._object3d.position.y;
        if(diff * this._slide < 0) {
            this._object3d.position.y -= this._slide * delta * this._slideSpeed;
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