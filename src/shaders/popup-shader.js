const PopupShader = {
    vertexShader:
/* glsl */
`

    varying vec2 vUv;

    void main() {

        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }`,
    fragmentShader:
/* glsl */
`

    #include <common>

    uniform sampler2D map;

    uniform float border;
    uniform float total;
    uniform float current;

    varying vec2 vUv;

    void main() {

        float pixelY = vUv.y * current;

        float newPixelY = vUv.y * current / total;
        if(pixelY > (current - border)) {
            newPixelY = vUv.y * current / total + (total - current) / total;
        }

        gl_FragColor =  texture2D(map, vec2(vUv.x, newPixelY));

    }`
};

export default PopupShader;