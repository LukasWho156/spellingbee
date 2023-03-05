const ConnectionShader = {
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

    varying vec2 vUv;

    uniform vec2[20] points;

    void main() {

        float bestDist = 1000.0;

        for(int i = 0; i < points.length() - 1; i++) {

            vec2 p1 = points[i];
            vec2 p2 = points[i + 1];
            if(p2.x < 0.0 || p2.y < 0.0) {
                break;
            }

            vec2 b1 = normalize(p2 - p1);
            vec2 b2 = normalize(vec2(-b1.y, b1.x));
            vec2 p1ToUv = vUv - p1;
            vec2 uvInB = vec2(dot(b1, p1ToUv), dot(b2, p1ToUv));
            uvInB.x /= distance(p1, p2);

            float dist1 = distance(p1, vUv);
            float dist2 = distance(p2, vUv);
            float dist3 = 1000.0;
            if(uvInB.x > 0.0 && uvInB.x < 1.0) {
                dist3 = abs(uvInB.y) * (-(uvInB.x - 0.5) * (uvInB.x - 0.5) * 2.0 + 1.5);
            }
            bestDist = min(bestDist, min(dist1, min(dist2, dist3)));

        }

        float value = max(0.0, exp(-bestDist * 4.0));
        if(value > 0.875) {
            value = 1.0;
        } else {
            value = value * value * 0.5;
        }

        gl_FragColor = vec4(0.0, 0.4 * value, 0.8 * value, 1.0);

    }`
};

export default ConnectionShader;