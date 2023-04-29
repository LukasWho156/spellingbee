import { Sprite2D } from "luthe-amp/lib/graphics/utility/sprite-2d";
import { MouseInteractionComponent } from "luthe-amp/lib/input/mouse-interaction-component";

import createFlowerPopup from "../util/flower-popup.js";

const FlowerSystem = (scene, top, flowers, mis, messenger) => {

    let systems = [];

    const system = {
        update: (delta) => {
            systems.forEach(sys => sys.update(delta));
        }
    }

    flowers.forEach((flower, i) => {
        const sprite = new Sprite2D({
            texture: 'flowers',
            handle: 'top left',
            x: -300 + 60 * i,
            y: -510,
            z: 10,
            scaleX: 0.12,
            scaleY: 0.12,
        });
        sprite.setFrame(flower.frame);
        top.add(sprite);
        createFlowerPopup(scene, flower, mis, messenger).then(infoBox => {
            const interaction = new MouseInteractionComponent({cursor: 'pointer'}, sprite);
            interaction.addEventListener('click', () => infoBox.open());
            mis.add(interaction);
            systems.push(infoBox);
        });
    });

    if(!messenger) return system;

    messenger.triggerFlowerBuffEffectivity = (multiplier) => {
        flowers.forEach(flower => {
            if(typeof(flower.onBuffEffectivity) !== 'function') return;
            flower.onBuffEffectivity(multiplier);
        })
    };

    messenger.triggerFlowerBuffChance = (chance) => {
        flowers.forEach(flower => {
            if(typeof(flower.onBuffChance) !== 'function') return;
            flower.onBuffChance(chance);
        })
    };

    messenger.triggerFlowerDamageCalculation = (damage, wordLength) => {
        flowers.forEach(flower => {
            if(typeof(flower.onDamageCalculation) !== 'function') return;
            flower.onDamageCalculation(damage, wordLength);
        })
    };

    messenger.triggerFlowerDamagePlayer = (damage, wordLength) => {
        flowers.forEach(flower => {
            if(typeof(flower.onDamagePlayer) !== 'function') return;
            flower.onDamagePlayer(damage, wordLength);
        })
    };

    messenger.triggerFlowerCombDamage = (comb) => {
        flowers.forEach(flower => {
            if(typeof(flower.onCombDamage) !== 'function') return;
            flower.onCombDamage(comb);
        })
    };

    messenger.triggerFlowerEnemySpawned = (enemy) => {
        flowers.forEach(flower => {
            if(typeof(flower.onEnemySpawned) !== 'function') return;
            flower.onEnemySpawned(enemy);
        })
    };

    messenger.triggerFlowerRerollPrice = (price) => {
        flowers.forEach(flower => {
            if(typeof(flower.onRerollPrice) !== 'function') return;
            flower.onRerollPrice(price);
        })
    }

    messenger.triggerFlowerHints = () => {
        for (const flower of flowers) {
            if(flower.hints) return true;
        }
        return false;
    }

    return system;
    
}

export default FlowerSystem;