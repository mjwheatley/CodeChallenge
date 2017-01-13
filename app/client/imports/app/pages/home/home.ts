import {Component, OnInit, NgZone, ViewChild} from '@angular/core';
import {App, NavController} from 'ionic-angular';
import {MeteorComponent} from 'angular2-meteor';
import {TranslateService} from 'ng2-translate';
import {Options} from "fullcalendar";
import {Constants} from "../../../../../both/Constants";
import * as moment from 'moment';
import * as $ from 'jquery';
import {TimeEntryPage} from "../time-entry/time-entry";
import {DutyHour} from "../../../../../both/models/dutyHour.model";
import {DutyHourCollection} from "../../../../../both/collections/dutyHour.collection";
import {ToastMessenger} from "../../utils/ToastMessenger";

import template from './home.html';
@Component({
    selector: 'page-home',
    template
})
export class HomePage extends MeteorComponent implements OnInit {
    @ViewChild('fullcalendar') fullcalendar:any;
    public user:Meteor.User;
    public isLoading:boolean = true;
    public calendarOptions:any;
    private dutyHours:DutyHour[];
    private calendarStartDate:string;

    constructor(public app:App,
                public nav:NavController,
                public zone:NgZone,
                public translate:TranslateService) {
        super();
    }

    ngOnInit():void {
        var self = this;

        Meteor.call("initFakeDataForUser", (error, result) => {
            if (error) {
                console.log("Error initializing fake data: ", error);
                new ToastMessenger().toast({
                    type: "error",
                    message: error.reason
                });
            }
        });

        // Use MeteorComponent autorun to respond to reactive session variables.
        this.autorun(() => this.zone.run(() => {
            this.user = Meteor.user();

            // Wait for translations to be ready
            // in case component loads before the language is set
            // or the language is changed after the component has been rendered.
            // Since this is the home page, this component and any child components
            // will need to wait for translations to be ready.
            if (Session.get(Constants.SESSION.TRANSLATIONS_READY)) {
                self.translate.get('page-home.title').subscribe((translation:string) => {
                    console.log("Home page title: ", translation);
                    // Set title of web page in browser
                    self.app.setTitle(translation);
                });
            }
        }));

        this.autorun(() => this.zone.run(() => {
            console.log("Session calendar start date: ", Session.get(Constants.SESSION.CALENDAR_START_DATE));
            // if (Session.get(Constants.SESSION.CALENDAR_START_DATE)) {
            //     self.calendarStartDate = moment(Session.get(Constants.SESSION.CALENDAR_START_DATE))
            //         .format("YYYY-MM-DD");
            //     Session.set(Constants.SESSION.CALENDAR_START_DATE, null);
            // }  else {
            //     self.calendarStartDate = moment().format("YYYY-MM-DD");
            // }
            // console.log("calendarStartDate: ", self.calendarStartDate);
        }));



        self.autorun(() => self.zone.run(() => {
            Session.set(Constants.SESSION.LOADING, true);
            self.subscribe('MyDutyHours', () => {
                // self.autorun(() => self.zone.run(() => {
                    Session.set(Constants.SESSION.LOADING, false);
                    self.isLoading = false;
                    var dutyHours:Array<DutyHour> = DutyHourCollection.find({}).fetch();
                    if (dutyHours && dutyHours.length > 0) {
                        self.dutyHours = dutyHours;
                    }
                    console.log("dutyHours:", self.dutyHours);

                    self.setCalendarDutyHours();
                // }), true);
            });
        }));
    }

    private setCalendarDutyHours():void {
        var self = this;
        var dutyHours:Array<DutyHour> = [];
        if (self.dutyHours && self.dutyHours.length > 0) {
            dutyHours = self.dutyHours;
        }
        console.log("adding duty hours to calendar options: ", dutyHours);
        self.calendarOptions = {
            height: 'parent',
            fixedWeekCount: false,
            defaultDate: self.calendarStartDate,
            editable: true,
            eventLimit: true, // allow "more" link when too many events
            event: dutyHours,
            eventClick: (event) => {
                self.nav.push(TimeEntryPage, event);
                return false;
            }
        };

        // $('angular2-fullcalendar').fullCalendar('render');
    }

    public addDutyHour():void {
        this.nav.push(TimeEntryPage);
    }
}

interface ICalendarOptions {
    height?:string,
    fixedWeekCount?:boolean,
    defaultDate?:string,
    editable?:boolean,
    eventLimit?:boolean,
    events?:Array<DutyHour>,
    eventClick?:Function
}


