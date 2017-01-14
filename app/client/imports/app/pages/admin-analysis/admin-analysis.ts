import {Component, OnInit, NgZone} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
import {MeteorComponent} from 'angular2-meteor';
import {TranslateService} from 'ng2-translate';
import {SelectUsersModalPage} from "../modals/select-user-modal/select-users-modal";
import {Constants} from "../../../../../both/Constants";

import template from './admin-analysis.html';
@Component({
    selector: 'page-admin-analysis',
    template
})
export class AdminAnalysisPage extends MeteorComponent implements OnInit {
    public user:Meteor.User;
    public rUserIds:ReactiveVar<Array<string>> = new ReactiveVar([]);
    public totalUsers:number;

    constructor(public nav:NavController,
                public modalCtrl:ModalController,
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
                    self.initUserIds();
                }), true);
            });
        });
    }
    
    private initUserIds():void {
        var self = this;
        var users:Array<Meteor.User> = Meteor.users.find({}, {fields: {_id: 1}}).fetch();
        self.totalUsers = users.length;
        var userIds:Array<string> = [];
        users.forEach(user => {
            userIds.push(user._id);
        });
        if (Session.get(Constants.SESSION.SELECTED_USER_IDS)) {
            userIds = Session.get(Constants.SESSION.SELECTED_USER_IDS);
        }
        self.setUserIds(userIds);
    }

    private setUserIds(userIds:Array<string>):void {
        var self = this;
        self.rUserIds.set(userIds);
        console.log("page-admin-analysis userIds: ", self.rUserIds.get());
    }
    
    public selectUsers():void {
        var self = this;
        let modal = this.modalCtrl.create(SelectUsersModalPage, { userIds: self.rUserIds.get() });
        modal.onDidDismiss((userIds:Array<string>) => {
            console.log("selected userIds: ", userIds);
            Session.set(Constants.SESSION.SELECTED_USER_IDS, userIds);
            self.setUserIds(userIds);
        });
        modal.present();
    }
}