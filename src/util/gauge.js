import { THREE, Game } from "luthe-amp";

import GaugeShader from "../shaders/gauge-shader.js";

const createGauge = (tex, width, height, mode, bounds) => {

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

    const mat = new THREE.ShaderMaterial(GaugeShader);
    mat.uniforms = {
        mode: {value: md},
        ratio: {value: 0},
        bounds: {value: bounds},
        map: {value: texture},
        color: {value: [1, 1, 1, 1]},
    };
    mat.transparent = true;

    const gauge = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
    gauge.setValue = (value) => {
        mat.uniforms.ratio.value = value;
    }
    gauge.setColor = (color) => {
        const red = (color & 0xff0000) >> 16;
        const green = (color & 0x00ff00) >> 8;
        const blue = (color & 0x0000ff);
        mat.uniforms.color.value = [red / 255, green / 255, blue / 255, 1];
    }

    return gauge;

}

export default createGauge;