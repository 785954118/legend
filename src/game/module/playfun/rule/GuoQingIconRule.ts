class GuoQingIconRule extends RuleIconBase {
    constructor(id:number, t){
        super(id, t);

    }

    checkShowIcon(): boolean {
        let date = new Date(GameServer.serverTime);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        return year == 2017 && ( (month == 9 && day == 30) || month == 10 && day < 9);
    }

    checkShowRedPoint(): number {
        return 0;
    }
    getEffName(redPointNum: number): string {
        this.effX = 38;
        this.effY = 38;
        return "actIconCircle";
    }
    tapExecute(): void {
        ViewManager.ins().open(GuoActivityWin);
    }
}