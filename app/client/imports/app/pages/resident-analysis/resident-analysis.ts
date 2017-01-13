import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {MeteorComponent} from 'angular2-meteor';
import {TranslateService} from 'ng2-translate';

import template from './resident-analysis.html'
@Component({
    selector: 'page-resident-analysis',
    template
})
export class ResidentAnalysisPage extends MeteorComponent implements OnInit {
    public user:Meteor.User;
    public userIds:ReactiveVar<Array<string>> = new ReactiveVar([]);
    private initUser:boolean = true;

    constructor(public nav:NavController,
                public translate:TranslateService) {
        super();
    }

    ngOnInit():void {
        this.autorun(() => {
            this.user = Meteor.user();
            if (this.initUser && this.user) {
                this.initUser = false;
                this.setUserIds();
            }
        });
    }

    private setUserIds():void {
        this.userIds.set([this.user._id]);
        console.log("page-resident-analysis userIds: ", this.userIds.get());
    }
}