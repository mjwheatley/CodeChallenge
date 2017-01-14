import {Component, OnInit, NgZone} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {MeteorComponent} from 'angular2-meteor';
import {TranslateService} from 'ng2-translate';
import {Constants} from "../../../../../../both/Constants";

import template from './select-users-modal.html';
@Component({
    selector: 'page-select-users-modal',
    template
})
export class SelectUsersModalPage extends MeteorComponent implements OnInit {
    public users:Array<any>;
    public selectAll:boolean = false;
    public paramUserIds:Array<string>;
    public isLoading:boolean = true;

    constructor(public zone:NgZone,
                public viewCtrl:ViewController,
                public params:NavParams,
                public translate:TranslateService) {
        super();
    }

    ngOnInit() {
        Session.set(Constants.SESSION.LOADING, true);
        console.log("params.data: ", this.params.data);
        this.paramUserIds = this.params.data.userIds;
        this.subscribe('allUserData', () => {
            this.autorun(() => this.zone.run(() => {
                Session.set(Constants.SESSION.LOADING, false);
                this.isLoading = false;
                console.log("getting user Data...");
                this.users = Meteor.users.find({}, {sort: {"profile.name.given": 1}}).fetch();
                console.log("users: ", this.users);
                if (this.paramUserIds) {
                    this.markAsSelected(this.paramUserIds);
                }
            }), true);
        });
    }

    private markAsSelected(userIds:Array<string>):void {
        var numSelected:number = 0;
        this.users.forEach(user => {
            if (userIds.indexOf(user._id) > -1) {
                user.selected = true;
                numSelected++;
            }
        });
        if (numSelected === this.users.length) {
            this.selectAll = true;
        }
    }

    public onUserSelectedClicked(user:any):void {
        if (this.selectAll) {
            this.selectAll = !this.selectAll
        } else {
            var selectAll = true;
            this.users.forEach(user => {
                if (!user.selected) {
                    selectAll = false;
                }
            });
            this.selectAll = selectAll;
        }
    }

    public onSelectAllClicked():void {
        if (this.users.length > 0) {
            this.users.forEach(user => {
                user.selected = this.selectAll;
            });
        }
    }

    public dismiss(id:string) {
        let userIds:Array<string> = [];
        if (id === "done") {
            userIds = this.getUserIdsToReturn(userIds);
        } else {
            userIds = this.paramUserIds;
        }
        this.viewCtrl.dismiss(userIds);
    }

    private getUserIdsToReturn(userIds:Array<string>):Array<string> {
        this.users.forEach(user => {
            if (user.selected) {
                userIds.push(user._id);
            }
        });
        return userIds;
    };
}