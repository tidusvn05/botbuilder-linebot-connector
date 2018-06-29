"use strict";
exports.__esModule = true;
var express = require('express');
var config = require("./conf");
var builder = require("botbuilder");
// import * as  istorage from "./lib/IStorageClient";
// import * as  azure from './lib/AzureBotStorage.js';
var LineConnector_1 = require("./line/LineConnector");
var q_list = require("./questions.js");
// console.log(q_list)
var server = express();
server.listen(process.env.port || process.env.PORT || 3000, function () {
    console.log("listening to");
});
// var docDbClient = new istorage.IStorageClient();
// var tableStorage = new azure.AzureBotStorage({
//     gzipData: false
// }, docDbClient);
var connector = new LineConnector_1.LineConnector({
    hasPushApi: false,
    channelId: config.channelId,
    channelSecret: config.channelSecret,
    channelAccessToken: config.channelAccessToken
});
server.post('/line', connector.listen());
// var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);
// .set('storage', tableStorage); //set your storage here
bot.dialog("/", function (s) {
    s.beginDialog("start");
});
bot.on('conversationUpdate', function (message) {
    switch (message.text) {
        case 'follow':
            break;
        case 'unfollow':
            break;
        case 'join':
            bot.beginDialog(message.address, "start");
            break;
        case 'leave':
            break;
    }
    console.log("conversationUpdate");
});
bot.dialog("start", function (s) {
    s.send(new builder.Message(s).addAttachment(new LineConnector_1.Sticker(s, 1, 2)));
    s.send("遊戲開始");
    s.beginDialog("ask");
});
bot.dialog("ask", [
    function (s, args) {
        var q;
        if (args && args.q) {
            q = args.q;
        }
        else {
            q = q_list[Math.floor(Math.random() * (q_list.length - 1))];
        }
        s.dialogData.q = q;
        builder.Prompts.choice(s, new builder.Message(s)
            .text(q.q)
            .suggestedActions(builder.SuggestedActions.create(s, q.options.map(function (o) {
            return builder.CardAction.imBack(s, o, o);
        }))), q.options);
    },
    function (s, r) {
        s.dialogData.answers = [];
        if (r.response.entity === s.dialogData.q.a) {
            s.send(s.message.from.name + " \u7B54\u5C0D\u4E86! \u52A0\u4E00\u5206\uFF01");
            s.send(new builder.Message(s).addAttachment(new LineConnector_1.Sticker(s, 1, 2)));
            s.dialogData.q = null;
        }
        else {
            s.send(s.message.from.name + " \u7B54\u932F\u4E86! \u6263\u4E00\u5206\uFF01");
            s.send(new builder.Message(s).addAttachment(new LineConnector_1.Sticker(s, 1, 3)));
        }
        s.replaceDialog("ask", { q: s.dialogData.q });
    }
]);
bot.dialog("slice", [
    function (s) {
        console.log("log");
    }
]).triggerAction({
    matches: /^slice$/i
});
bot.dialog("leave", [
    function (s) {
        console.log("leave");
        connector.leave();
    }
]).triggerAction({
    matches: /^leave$/i
});
