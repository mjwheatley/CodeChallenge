import {OauthServiceConfig} from "../../lib/oauthConfig";
import {DutyHour} from "../../../both/models/dutyHour.model";
import {DutyHourCollection} from "../../../both/collections/dutyHour.collection";
import {MeteorMethods} from "./methods";
import * as moment from 'moment';

declare var process;

export class Main {
    start():void {
        this.printSettings();
        //this.initFakeData();

        var oauthProviderConfig = new OauthServiceConfig();
        oauthProviderConfig.initOauthServices();

        var meteorMethods = new MeteorMethods();
        meteorMethods.init();
    }

    initFakeData():void {
        
    }

    printSettings():void {
        console.log("process.env.ROOT_URL: " + process.env.ROOT_URL);
        console.log("process.env.MOBILE_DDP_URL: " + process.env.MOBILE_DDP_URL);
        console.log("process.env.MOBILE_ROOT_URL: " + process.env.MOBILE_ROOT_URL);
        console.log("process.env.METEOR_ENV: " + process.env.METEOR_ENV);
        console.log("process.env.METEOR_SETTINGS: " + process.env.METEOR_SETTINGS);
        if (!process.env.METEOR_SETTINGS) {
            console.log("No METEOR_SETTINGS found.  Please restart the app with the METEOR_SETTINGS environment variable set.")
        }
    }
}
