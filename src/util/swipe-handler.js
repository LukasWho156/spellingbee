const TIME_THRESHOLD = 70;
const VELOCITY_THRESHOLD = 0.5;

class SwipeHandler extends EventTarget {

    _startTime;
    _startPosition;

    constructor(interaction) {
        super();
        interaction.addEventListener('dragstart', (e) => {
            this._startTime = performance.now();
            this._startPosition = e.detail.x;
        });
        interaction.addEventListener('dragend', (e) => {
            const time = performance.now() - this._startTime;
            this._startTime = performance.now();
            if(time < TIME_THRESHOLD) return;
            const velocity = (e.detail.x - this._startPosition) / time;
            if(Math.abs(velocity) < VELOCITY_THRESHOLD) return;
            this.dispatchEvent(new CustomEvent('swipe', {detail: {direction: velocity > 0 ? 'right' : 'left'}}));
        })
    }

}

export default SwipeHandler