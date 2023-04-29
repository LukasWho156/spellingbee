import { Game } from "luthe-amp";
import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";

const addSoundControls = (menu) => {
    const musicSlider = menu.addSlider(Game.settings.musicVolume);
    const musicSprite = new Sprite2D({
        texture: 'musicVolume',
        scaleX: 0.25,
        scaleY: 0.25,
        x: -160,
        handle: 'right',
    });
    musicSlider.sprite.add(musicSprite);
    musicSlider.addEventListener('valuechanged', event => {
        if(Game.settings.musicVolume === event.detail.value) return;
        Game.settings.musicVolume = event.detail.value;
        Game.saveToStorage('bee_settings', Game.settings);
        Game.audio.musicVolume = event.detail.value;
    });
    const soundSlider = menu.addSlider(Game.settings.soundVolume);
    const soundSprite = new Sprite2D({
        texture: 'soundVolume',
        scaleX: 0.25,
        scaleY: 0.25,
        x: -150,
        handle: 'right',
    });
    soundSlider.sprite.add(soundSprite);
    soundSlider.addEventListener('valuechanged', event => {
        if(Game.settings.soundVolume === event.detail.value) return;
        Game.settings.soundVolume = event.detail.value;
        Game.saveToStorage('bee_settings', Game.settings);
        Game.audio.soundVolume = event.detail.value;
    });
}

export default addSoundControls;