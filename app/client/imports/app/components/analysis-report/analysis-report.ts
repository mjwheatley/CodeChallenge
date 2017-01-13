import {Component, OnInit, Input, NgZone} from '@angular/core';
import {NavController} from 'ionic-angular';
import {MeteorComponent} from 'angular2-meteor';
import {TranslateService} from 'ng2-translate';
import {Constants} from "../../../../../both/Constants";
import {DutyHourCollection} from "../../../../../both/collections/dutyHour.collection";
import {DutyHour, IDutyHour} from "../../../../../both/models/dutyHour.model";
import * as moment from 'moment';

import template from './analysis-report.html'
@Component({
    selector: 'analysis-report',
    template
})
export class AnalysisReportComponent extends MeteorComponent implements OnInit {
    @Input() userIds:ReactiveVar<Array<string>>;
    public analysisStartDate:any;
    public isLoading:boolean = true;
    public analysisReport:Array<DutyHour>;
    public users:Array<Meteor.User> = [];
    public violations:Array<IUserViolations>;

    constructor(public nav:NavController,
                public zone:NgZone,
                public translate:TranslateService) {
        super();
    }

    ngOnInit():void {
        var self = this;
        self.autorun(() => {
            Session.set(Constants.SESSION.LOADING, true);
            self.subscribe('DutyHourCollection', () => {
                self.autorun(() => self.zone.run(() => {
                    Session.set(Constants.SESSION.LOADING, false);
                    self.isLoading = false;
                    console.log("analysis-report userIds: ", self.userIds.get());
                    self.generateAnalysisReport();
                }), true);
            });
            self.subscribe('userData', self.userIds.get(), () => {
                self.autorun(() => self.zone.run(() => {
                    self.userIds.get().forEach(userId => {
                        var user:Meteor.User =  Meteor.users.findOne({_id: userId});
                        self.users.push(user);
                    });
                }), true);
            });
        });

        self.analysisStartDate = moment().format("YYYY-MM-DD");
    }

    private generateAnalysisReport():void {
        var self = this;

        var dutyHoursByUser:Array<Array<DutyHour>> = self.getDutyHoursByUser();

        self.filterForViolations(dutyHoursByUser)

    }

    private getDutyHoursByUser():Array<Array<DutyHour>> {
        var self = this;
        var dutyHoursByUser:Array<Array<DutyHour>> = [];
        self.userIds.get().forEach(userId => {
            var dutyHours:Array<DutyHour> =  DutyHourCollection.find({userId: userId}).fetch();
            dutyHoursByUser.push(dutyHours);
        });
        return dutyHoursByUser;
    }

    private filterForViolations(data:Array<Array<DutyHour>>) {
        var self = this;
        
        self.violations = [];
        // loop through each user
        data.forEach((userArray:Array<DutyHour>) => {
            var userViolations:IUserViolations = self.getUserViolations(userArray);
            console.log("userViolations: ", userViolations);
            self.violations.push(userViolations);
        });
        console.log("violations: ", self.violations);
    }

    private getUserViolations(data:Array<DutyHour>):IUserViolations {
        var self = this;
        var userViolations:IUserViolations = {
            isOver24Hours: []
        };
        data.forEach((dutyHour:DutyHour) => {
            console.log("dutyHour: ", dutyHour);
            var isOver24Hours:boolean = self.isOver24Hours(dutyHour);
            if (isOver24Hours) {
                var startString:string = moment(dutyHour.start).format("ddd, MM/DD/YY, h:mm a");
                var endString:string = moment(dutyHour.end).format("ddd, MM/DD/YY, h:mm a");
                var displayInfo:any = dutyHour;
                displayInfo.startString = startString;
                displayInfo.endString = endString;
                userViolations.isOver24Hours.push(displayInfo);
            }
        });

        return userViolations;
    }

    private isOver24Hours(dutyHour:DutyHour):boolean {
        var self = this;
        var violation = false;

        var startMoment = moment(dutyHour.start);
        var endMoment = moment(dutyHour.end);
        var minutesWorked = endMoment.diff(startMoment, 'minutes');

        if (minutesWorked > 1440) {
            violation = true;
        }

        return violation;
    }

    public showOnCalendar(date:string):void {
        var self = this;
        console.log("selected date: ", date);
        console.log("Going to wife's birthday instead...");
        date = moment("2016-05-28").format("YYYY-MM-DD");
        Session.set(Constants.SESSION.CALENDAR_START_DATE, date);
        self.nav.popToRoot();
    }
}

interface IUserViolations {
    isOver24Hours?:Array<any>
}