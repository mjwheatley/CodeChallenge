export interface IDutyHour {
    _id?:string,
    userId?:string,
    start:string,
    end:string
}

export class DutyHour {
    _id:string;
    userId:string;
    start:string;
    end:string;

    constructor(dutyHourData?:IDutyHour) {
        if (dutyHourData) {
            if (dutyHourData._id) {
                this._id = dutyHourData._id;
            }
            this.userId = dutyHourData.userId;
            this.start = dutyHourData.start;
            this.end = dutyHourData.end;
        }
    }
}
