import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {MeteorComponent} from 'angular2-meteor';
import {TranslateService} from 'ng2-translate';


import template from './admin-analysis.html'
//TODO change selector
@Component({
    selector: 'page-admin-analysis',
    template
})

export class AdminAnalysisPage extends MeteorComponent implements OnInit {
    public user:Meteor.User;

    constructor(public nav:NavController,
                public translate:TranslateService) {
        super();
    }

    ngOnInit():void {
        this.autorun(() => {
            this.user = Meteor.user();
        });
    }
}