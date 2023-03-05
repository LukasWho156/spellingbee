const GaugeShader = {
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
    #define M_PI 3.1415926535897932384626433832795

    varying vec2 vUv;

    uniform sampler2D map;
    uniform int mode;
    uniform float ratio;
    uniform vec2 bounds;
    uniform vec4 color;

    void main() {

        float spot = vUv.x;
        if(mode == 1) {
            spot = vUv.y;
        }
        if(mode == 2) {
            spot = atan(0.5 - vUv.x, 0.5 - vUv.y) / 2.0 / M_PI + 0.5;
        }
        if(mode == 3) {
            spot = atan(vUv.x - 0.5, 0.5 - vUv.y) / 2.0 / M_PI + 0.5;
        }
        vec2 point = vec2(vUv.x * 0.5, vUv.y);
        if(spot > bounds.x + ratio * (bounds.y - bounds.x)) {
            point.x += 0.5;
        }

        gl_FragColor = texture(map, point) * color;
        //gl_FragColor = vec4(point.x, point.y, 0.0, 1.0);

    }`
};

export default GaugeShader;