// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const nodemailer = require('nodemailer');


exports.addMessage = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    admin.database().ref('/messages').push({original: original}).then(snapshot => {
        // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
        res.redirect(303, snapshot.ref);
    });
});


exports.createUser = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    const id = req.body.id;
    const password = req.body.password;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    admin.database().ref('/users').push({id: id,password:password}).then(snapshot => {
        // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
        res.send("유저생성완료")
    });
});



exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
    .onWrite(event => {
        // Grab the current value of what was written to the Realtime Database.
        const original = event.data.val();
        console.log('Uppercasing', event.params.pushId, original);
        const uppercase = original.toUpperCase();
        // You must return a Promise when performing asynchronous tasks inside a Functions such as
        // writing to the Firebase Realtime Database.
        // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
        return event.data.ref.parent.child('uppercase').set(uppercase);
    });


exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')


    .onWrite(event => {
        // Grab the current value of what was written to the Realtime Database.
        const original = event.data.val();
        console.log('Uppercasing', event.params.pushId, original);
        const uppercase = original.toUpperCase();
        // You must return a Promise when performing asynchronous tasks inside a Functions such as
        // writing to the Firebase Realtime Database.
        // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
        if(event.data.changed()){
            return event.data.ref.parent.child('change').set(uppercase);
        }


    });


exports.sendWelcomeEmail = functions.auth.user().onCreate(event => {


    let transporter = nodemailer.createTransport({
        service : 'Gmail',
        auth: {
            user: 'myeongsic89',
            pass: 'dknazvoubwivokle'
        }
    });

// setup email data with unicode symbols
    let mailOptions = {
        from: '하울코딩', // sender address
        to: event.data.email, // list of receivers
        subject: 'Welcome', // Subject line
        text: event.data.email+ '님이 회원가입을 축하합니다.', // plain text body
        //html: '<b>Hello world ?</b>' // html body
    };

// send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });

});

exports.sendByeEmail = functions.auth.user().onDelete(event => {


    let transporter = nodemailer.createTransport({
        service : 'Gmail',
        auth: {
            user: 'myeongsic89',
            pass: 'dknazvoubwivokle'
        }
    });

// setup email data with unicode symbols
    let mailOptions = {
        from: '하울코딩', // sender address
        to: event.data.email, // list of receivers
        subject: 'Bye', // Subject line
        text: event.data.email+ '님이 탈퇴하셨습니다. ', // plain text body
        //html: '<b>Hello world ?</b>' // html body
    };

// send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
});

