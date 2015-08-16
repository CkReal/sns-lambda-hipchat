// Dependencies
var config = require('./config');
var HipChatClient = require('hipchat-client');

// HipChat Class
var hipchat = new HipChatClient(config.apiAuthToken);

exports.handler = (function(event, context) {
    // SNS Message Check
    if (!event.Records[0].Sns.Message) {
        throw 'SNS message is required!';
    }

    // Massage Formatting
    var msg = {
        subject : event.Records[0].Sns.Subject,
        message : JSON.parse(event.Records[0].Sns.Message)
    };

    // HipChat Color Check
    switch(msg.message.NewStateValue){
        case 'OK':      hipchat_color = 'green';break;
        case 'ALARM':   hipchat_color = 'red';break;
        default:        hipchat_color = 'gray';break;
    };

    // creation message and options
    var sendmsg = {
        room_id : config.roomId,
        from : config.from,
        message_format : "html",
        notify : "true",
        color : hipchat_color,
        message : 
            '<b>' + msg.subject + '</b><br>'
            + msg.message.AlarmDescription + '<br>'
            + msg.message.NewStateReason + '<br>'
    };

    // HipChat Send Message
    hipchat.api.rooms.message(sendmsg, function(err, res) {
        if (err) {
            throw err;
        }
        console.log(res);
        context.done(null, "HipChat Sent Message." );
    });
});
