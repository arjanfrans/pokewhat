import Keyboard from '../../../engine/input/Keyboard';
import Gamepad from '../../../engine/input/Gamepad';
import HumanInput from '../../../engine/input/HumanInput';

class MenuInput extends HumanInput {
    constructor (state) {
        super();

        this.state = state;
    }

    update () {
        let state = this.state;

        if (this.keyboardDownOnce(Keyboard.UP) || Gamepad.isStickDown(0, 'left', 'up')) {
            state.currentMenu.moveUp();
        } else if (this.keyboardDownOnce(Keyboard.DOWN) || Gamepad.isStickDown(0, 'left', 'down')) {
            state.currentMenu.moveDown();
        }

        if (state.currentOptionsEdit && state.currentMenu.selectedItem.editable) {
            let option = state.options.get(state.currentOptionsEdit);

            if (this.keyboardDownOnce(Keyboard.ENTER)) {
                console.log('to be implemented');
            }

            if (Keyboard.letterKeyCodes.indexOf(Keyboard.lastPressed) !== -1) {
                this.state.options.set(state.currentOptionsEdit, option + Keyboard.keyByCode(Keyboard.lastPressed));
            }
        }

        if (this.keyboardDownOnce(Keyboard.ENTER) || this.keyboardDownOnce(Keyboard.SPACE) ||
                this.gamepadButtonDownOnce('actionSouth')) {
            state.currentMenu.selectCurrentItem();
        }
    }
}

export default MenuInput;
