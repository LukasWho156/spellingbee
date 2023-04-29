import { THREE, Game } from "luthe-amp";

import GaugeShader from "../shaders/gauge-shader.js";

class Gauge extends THREE.Mesh {

    constructor(tex, width, height, mode, bounds) {

        super(new THREE.PlaneGeometry(width, height), new THREE.ShaderMaterial(GaugeShader));

        const texture = Game.getTexture(tex).texture;
        texture.minFilter = THREE.LinearFilter;

        let md = 0;
        switch(mode) {
            case 'h':
            case 'horizontal':
                md = 0;
                break;
            case 'v':
            case 'vertical':
                md = 1;
                break;
            case 'r':
            case 'radial':
            case 'cw':
            case 'clockwise':
                md = 2;
                break;
            case 'ccw':
            case 'counterclockwise':
                md = 3;
                break;
        }
        bounds ??= [0, 1];

        this.material.uniforms = {
            mode: {value: md},
            ratio: {value: 0},
            bounds: {value: bounds},
            map: {value: texture},
            color: {value: [1, 1, 1, 1]},
        };
        this.material.transparent = true;

    }

    setValue = (value) => {
        this.material.uniforms.ratio.value = value;
    }

    setColor = (color) => {
        const red = (color & 0xff0000) >> 16;
        const green = (color & 0x00ff00) >> 8;
        const blue = (color & 0x0000ff);
        this.material.uniforms.color.value = [red / 255, green / 255, blue / 255, 1];
    }

    dispose = () => {
        this.material.dispose();
        this.geometry.dispose();
    }

}

export default Gauge;