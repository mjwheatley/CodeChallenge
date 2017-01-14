Meteor.publish('userData', function (userIds:Array<string>) {
    return Meteor.users.find({
        _id: {$in: userIds}
    }, {
        fields: {
            "profile": 1,
            "emails": 1
        }
    });
});

Meteor.publish('allUserData', function () {
    return Meteor.users.find({}, {
        fields: {
            "profile": 1,
            "emails": 1
        }
    });
});