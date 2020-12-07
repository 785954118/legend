

class payDate extends BaseSystem {
    public payType : string = '1';
		public _url:string = ''
    public constructor() {
		super();
	}

    public static ins(): payDate {
		return super.ins() as payDate;
	}

}