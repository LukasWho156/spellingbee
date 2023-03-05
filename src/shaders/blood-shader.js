const BloodShader = {
    uniforms: {
        'tDiffuse': {
            value: null
        },
        'time': {
            value: 0.0
        },
        'intensity': {
            value: 0.0
        }
    },
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

    uniform sampler2D tDiffuse;

    uniform float intensity;

    varying vec2 vUv;

    void main() {

        vec4 cTextureScreen = texture2D( tDiffuse, vUv );

        float relX = 0.5 - vUv.x;
        float relY = 0.5 - vUv.y;

        float alpha = intensity * (relX * relX + relY * relY);

        vec3 cResult = vec3( cTextureScreen.x * (1.0 - alpha) + alpha, cTextureScreen.y * (1.0 - alpha) + 0.5 * alpha, cTextureScreen.z * (1.0 - alpha) );

        gl_FragColor =  vec4( cResult, cTextureScreen.a );

    }`
};

export default BloodShader;