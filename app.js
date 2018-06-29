"use strict";
exports.__esModule = true;
var express = require('express');
var builder = require("botbuilder");
var LineConnector_1 = require("./line/LineConnector");
var botbuilder_1 = require("botbuilder");
var config = require("./conf")["default"];
var server = express();
server.listen(process.env.port || process.env.PORT || 3000, function () {
    console.log("listening to");
});
var connector = new LineConnector_1.LineConnector({
    hasPushApi: true,
    autoGetUserProfile: true,
    channelId: config.channelId,
    channelSecret: config.channelSecret,
    channelAccessToken: config.channelAccessToken
});
server.post('/line', connector.listen());
// var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);
bot.dialog('/', [
    function (s) {
        // let m = new builder.Message(s)
        //     .text("hello world")
        //     .suggestedActions(
        //         builder.SuggestedActions.create(
        //             s, [
        //                 new CardAction().type("datatimepicker").title("time"),
        //                 new builder.CardAction().title("1").type("message").value("1"),
        //                 // builder.CardAction.openUrl(s, "https://1797.tw", "1797"),
        //                 // builder.CardAction.postBack(s, "action=buy&itemid=111", "send data")
        //             ]
        //         ));
        // s.send(m)
        // s.send(new builder.Message(s)
        //     .addAttachment(
        //         new Sticker(s, 1, 1)
        //     )
        //     .addAttachment(
        //         new Location(s, "my test", "中和", 35.65910807942215, 139.70372892916203)
        //     )
        //     .addAttachment(
        //         new builder.HeroCard(s)
        //             .title("財神到＜百萬紅包大方抽＞")
        //             .subtitle("免費抽紅包試手氣。獎品豐富，等您拿。")
        //             .text("好玩喔！")
        //             .images([builder.CardImage.create(s, 'https://imagelab.nownews.com/?w=1080&q=85&src=http://s.nownews.com/11/b9/11b93df1ec7012f4d772c8bb0ac74e10.png')])
        //             .buttons([
        //                 builder.CardAction.imBack(s, "buy classic gray t-shirt", "Buy"),
        //                 new CardAction().type("datatimepicker").title("time"),
        //                 builder.CardAction.postBack(s, "action=buy&itemid=111", "send data"),
        //                 builder.CardAction.openUrl(s, "https://1797.tw", "1797")
        //             ])
        //     )
        // )
        var msg = new builder.Message(s);
        msg.attachmentLayout(builder.AttachmentLayout.carousel);
        msg.attachments([
            new builder.HeroCard(s)
                .title("Classic White T-Shirt")
                .subtitle("100% Soft and Luxurious Cotton")
                .text("Price is $25 and carried in sizes (S, M, L, and XL)")
                .images([builder.CardImage.create(s, 'https://imagelab.nownews.com/?w=1080&q=85&src=http://s.nownews.com/11/b9/11b93df1ec7012f4d772c8bb0ac74e10.png')])
                .buttons([
                builder.CardAction.openUrl(s, "https://1797.tw", "1797"),
            ]),
            new builder.HeroCard(s)
                .title("Classic Gray T-Shirt")
                .subtitle("100% Soft and Luxurious Cotton")
                .text("Price is $25 and carried in sizes (S, M, L, and XL)")
                .images([builder.CardImage.create(s, 'https://imagelab.nownews.com/?w=1080&q=85&src=http://s.nownews.com/5d/6b/5d6b74b674e643f522ed68ef83053a1f.JPG')])
                .buttons([
                new botbuilder_1.CardAction().type("datatimepicker").title("time"),
            ]),
            new builder.HeroCard(s)
                .title("Classic White T-Shirt")
                .subtitle("100% Soft and Luxurious Cotton")
                .text("Price is $25 and carried in sizes (S, M, L, and XL)")
                .images([builder.CardImage.create(s, 'https://imagelab.nownews.com/?w=1080&q=85&src=http://s.nownews.com/11/b9/11b93df1ec7012f4d772c8bb0ac74e10.png')])
                .buttons([
                builder.CardAction.openUrl(s, "https://1797.tw", "1797"),
            ]),
        ]);
        s.send(msg);
        // builder.Prompts.text(s, msg);
    }
    // ,
    // async (s, r) => {
    //     s.send("hola:" + s.message.from.name + r.response)
    // }
]);
bot.dialog('leave', function (s) {
    s.send("byebye");
    connector.leave();
    s.endDialog();
}).triggerAction({
    matches: /^leave$/i
});
bot.on('conversationUpdate', function (message) {
    // console.log("conversationUpdate", message)
    switch (message.text) {
        case 'follow':
            break;
        case 'unfollow':
            break;
        case 'join':
            break;
        case 'leave':
            break;
    }
    var isGroup = message.address.conversation.isGroup;
    var txt = isGroup ? "Hello everyone!" : "Hello " + message.from.name;
    var reply = new builder.Message()
        .address(message.address)
        .text(txt);
    bot.send(reply);
    bot.beginDialog(message.address, "hello");
});
bot.dialog("hello", [
    function (s) {
        builder.Prompts.text(s, "go");
    },
    function (s, r) {
        s.send("oh!" + r.response);
        s.endDialog();
    }
]);
