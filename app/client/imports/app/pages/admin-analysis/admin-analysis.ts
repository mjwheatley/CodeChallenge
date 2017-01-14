import {Component, OnInit, NgZone} from '@angular/core';
import {NavController} from 'ionic-angular';
import {MeteorComponent} from 'angular2-meteor';
import {TranslateService} from 'ng2-translate';


import template from './admin-analysis.html'
@Component({
    selector: 'page-admin-analysis',
    template
})

export class AdminAnalysisPage extends MeteorComponent implements OnInit {
    public user:Meteor.User;
    public userIds:ReactiveVar<Array<string>> = new ReactiveVar([]);

    constructor(public nav:NavController,
                public zone:NgZone,
                public translate:TranslateService) {
        super();
    }

    ngOnInit():void {
        var self = this;
        self.autorun(() => {
            self.user = Meteor.user();

            self.subscribe('allUserData', () => {
                self.autorun(() => self.zone.run(() => {
                    self.setUserIds();
                }), true);
            });
        });
        //Meteor.users.findOne({_id: userId})
    }

    private setUserIds():void {
        var self = this;
        var users:Array<Meteor.User> = Meteor.users.find({}, {fields: {_id: 1}}).fetch();
        var userIds:Array<string> = [];
        users.forEach(user => {
            userIds.push(user._id);
        });
        self.userIds.set(userIds);
        console.log("page-admin-analysis userIds: ", self.userIds.get());
    }
}