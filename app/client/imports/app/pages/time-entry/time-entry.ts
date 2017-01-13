import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {MeteorComponent} from 'angular2-meteor';
import {TranslateService} from 'ng2-translate';
import {DutyHour} from "../../../../../both/models/dutyHour.model";
import {ToastMessenger} from "../../utils/ToastMessenger";
import * as moment from 'moment';
import {Constants} from "../../../../../both/Constants";

import template from './time-entry.html';
@Component({
    selector: 'page-time-entry',
    template
})
export class TimeEntryPage extends MeteorComponent implements OnInit {
    public user:Meteor.User;
    private dutyHour:DutyHour;
    private timeEntry:ITimeEntry;

    constructor(public nav:NavController,
                public params:NavParams,
                public translate:TranslateService) {
        super();
    }

    ngOnInit():void {
        this.dutyHour = new DutyHour(this.params.data);
        console.log("dutyHour: ", this.dutyHour);
        this.autorun(() => {
            this.user = Meteor.user();
        });

        this.timeEntry = {
            startDate: moment(this.dutyHour.start).format("YYYY-MM-DD"),
            startTime: moment(this.dutyHour.start).format("HH:mm"),
            endDate: moment(this.dutyHour.end).format("YYYY-MM-DD"),
            endTime: moment(this.dutyHour.end).format("HH:mm")
        };
    }
    
    public startDateChanged():void {
        console.log("startDate: ", this.timeEntry.startDate);
        this.onTimeEntryChanged();
    }
    
    public startTimeChanged():void {
        console.log("startTime: ", this.timeEntry.startTime);
        this.onTimeEntryChanged();
    }

    public endDateChanged():void {
        console.log("endDate: ", this.timeEntry.endDate);
        this.onTimeEntryChanged();
    }

    public endTimeChanged():void {
        console.log("endTime: ", this.timeEntry.endTime);
        this.onTimeEntryChanged();
    }
    
    private onTimeEntryChanged():void {
        this.dutyHour.start = this.timeEntry.startDate + "T" + this.timeEntry.startTime;
        this.dutyHour.end = this.timeEntry.endDate + "T" + this.timeEntry.endTime;
    }

    public saveTimeEntry():void {
        var self = this;
        self.onTimeEntryChanged();
        Session.set(Constants.SESSION.LOADING, true);
        console.log("saving dutyHour", self.dutyHour);
        Meteor.call("/dutyHour/save", self.dutyHour, (error, result) => {
            Session.set(Constants.SESSION.LOADING, false);
            if (error) {
                console.log("Error saving duty hour: ", error);
                new ToastMessenger().toast({
                    type: "error",
                    message: error.reason
                });
            } else {
                new ToastMessenger().toast({
                    type: "success",
                    message: self.translate.instant("page-time-entry.success")
                });
                self.nav.pop();
            }
        });
    }

    public deleteDutyHours():void {
        console.log("deleteDutyHours()");
        var self = this;
        Session.set(Constants.SESSION.LOADING, true);
        Meteor.call("/dutyHour/remove", self.dutyHour._id, (error, result) => {
            Session.set(Constants.SESSION.LOADING, false);
            if (error) {
                console.log("Error removing duty hour: ", error);
                new ToastMessenger().toast({
                    type: "error",
                    message: error.reason
                });
            } else {
                new ToastMessenger().toast({
                    type: "success",
                    message: self.translate.instant("page-time-entry.removed")
                });
                self.nav.pop();
            }
        });
    }
}

interface ITimeEntry {
    startDate?:any,
    startTime?:any,
    endDate?:any,
    endTime?:any
}