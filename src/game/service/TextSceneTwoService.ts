import secondModel from "../Model/secondModel";
export default class TextSceneTwoService {
    private model: secondModel;
    constructor(model: secondModel) {
        this.model = model;
    }
    public updateInstructionText(newText: string, isFail: boolean): void {
        if (this.model.levelInstructionText) {
            this.model.levelInstructionText.setText(newText);
        } else {
            console.warn("levelInstructionText undefined");
        }

        if (isFail && this.model.levelStateText) {
            this.model.levelInstructionText.setText(
                "Oh no! A shark ate your hook!"
            );
            this.model.levelStateText.setText(
                'Select "Start" to try this level again.'
            );
        }
    }
}
