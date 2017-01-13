import {Constants} from "../../../both/Constants";
import {DutyHour} from "../../../both/models/dutyHour.model";
import {DutyHourCollection} from "../../../both/collections/dutyHour.collection";
var Future = Npm.require('fibers/future');
var bcrypt = Npm.require('bcrypt');

declare var console;
declare var Accounts;

export class MeteorMethods {
    private readonly bcryptSaltRounds = 13;

    public init():void {
        Meteor.methods({
            'initFakeDataForUser': () => {
                var self = this;
                var user:Meteor.User = self.checkForUser();  // throws errors
                if (user) {
                    if (DutyHourCollection.find({}).fetch().length === 0) {
                        const data:DutyHour[] = [
                                new DutyHour({
                                    userId: user._id,
                                    start: '2017-01-12T06:30:33',
                                    end: '2017-01-13T15:00:00'
                                }),
                                new DutyHour({
                                    userId: user._id,
                                    start: '2017-01-11T06:00:00',
                                    end: '2017-01-12T06:30:00'
                                }),
                                new DutyHour({
                                    userId: user._id,
                                    start: '2017-01-10T15:00:00',
                                    end: '2017-01-10T23:00:00'
                                })
                            ];
                        data.forEach((obj:DutyHour) => {
                            DutyHourCollection.insert(obj);
                        });
                    }
                }
            },
            '/dutyHour/save': (dutyHour:DutyHour) => {
                var self = this;
                var user:Meteor.User = self.checkForUser();  // throws errors
                if (user) {
                    var future = new Future();

                    var dutyHourId = dutyHour._id;
                    delete dutyHour._id;
                    console.log("saving dutyHour: ", dutyHour);
                    DutyHourCollection.upsert(dutyHourId, dutyHour, (error, result) => {
                        if (error) {
                            console.log("Error saving duty hour: ", error);
                            future.throw(error);
                        } else {
                            if (result.insertedId) {
                                dutyHour._id = result.insertedId;
                            }
                            future.return(dutyHour);
                        }
                    });

                    try {
                        return future.wait();
                    } catch (error) {
                        throw error;
                    }
                }
            },
            '/dutyHour/remove': (dutyHourId:string) => {
                var self = this;
                var user:Meteor.User = self.checkForUser();  // throws errors
                if (user) {
                    var future = new Future();

                    console.log("removing dutyHourId: ", dutyHourId);

                    DutyHourCollection.remove({_id: dutyHourId}, (error) => {
                        if (error) {
                            console.log("Error removing duty hour: ", error);
                            future.throw(error);
                        } else {
                            console.log("Successfully removed duty hour.");
                            future.return(true);
                        }
                    });

                    try {
                        return future.wait();
                    } catch (error) {
                        throw error;
                    }
                }
            }
        });
    }

    private checkForUser():Meteor.User {
        var currentUserId = Meteor.userId();
        var user:Meteor.User;
        if (!currentUserId) {
            throw new Meteor.Error("sign-in", "Please sign in.");
        } else {
            user = Meteor.users.findOne(currentUserId);
            if (!user) {
                throw new Meteor.Error("account-not-found", "Invalid User ID");
            }
        }
        return user;
    }
}