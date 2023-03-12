import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";

const backgroundSystem = (scene, currentBackground) => {

    currentBackground ??= 0;

    const bg1 = new Sprite2D({
        texture: 'backgrounds',
        z: -50,
    });
    bg1.setFrame(currentBackground);
    scene.add(bg1);

    const bg2 = new Sprite2D({
        texture: 'backgrounds',
        z: -45,
    });
    bg2.setFrame(currentBackground);
    scene.add(bg2);

    return {
        update: (delta) => {
            if(bg2.material.opacity < 1) {
                bg2.material.opacity += 0.003 * delta;
                if(bg2.material.opacity >= 1) {
                    bg2.material.opacity = 1;
                }
            }
        },
        setBackground: (newBackground, log) => {
            if(log) console.log('Backgrounds:', currentBackground, newBackground);
            bg1.setFrame(currentBackground);
            bg2.material.opacity = 0;
            bg2.setFrame(newBackground);
            currentBackground = newBackground;
        }
    };

}

export default backgroundSystem;