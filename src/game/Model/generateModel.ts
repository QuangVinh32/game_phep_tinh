// DataModel.ts
class generateModel {
    public spriteData: any;
    public isFramesLoaded: boolean = false;
    public HookCanInteract: boolean = true;
    public fishAmountOfLevel: number = 10;
    public amount_shark: number = 2;
    public isRestartPressed: boolean = false;
    public AllFishCaught: boolean = false;
    public isVisible: boolean = false;
    public levelIndex: number = 1;
    public fishLeft : number = 10;
    public isWrongAnswer: boolean = false;
    public currentID: number = 0; 
    public currentFishID: number = 0;
    public availableIDs: number[] = [];
    public scoreCategory: { [key: string]: number } = {
        "orange": 0,
        "blue": 0,
        "green": 0,
        "purple": 0,
        "yellow": 0,
    };
    constructor() {
        // Khởi tạo hoặc gán giá trị mặc định cho spriteData nếu cần
        this.spriteData = null;
    }
}

// Tạo instance duy nhất và export nó
const generateModelInstance = new generateModel();
export default generateModelInstance;
