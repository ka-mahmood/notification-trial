// defining constants
const cron = require('node-cron');
const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path'); // module is core node.js module, defines static path for client

const app = express();

// store client data, set static path
app.use(express.static(path.join(__dirname, "client")));

// body-parser middleware
app.use (bodyParser.json());

// access web-push location to generate keys
const publicVapidKey = 
    'BJXyGxIMu9nR-pDCAswU8cxnj3UpWTGyEZsYV0Y5CsIBtmbHa8CLm7oCG4xYgNywjs9c2UqQs9_fP5Wed_DyVT4';
const privateVapidKey = 'DT0U2C3J75Hub1MCe3BAvv8x9s1k2JatFXSOM3YC53U';

// schedule tasks 
cron.schedule('10 * * * *', function() {
    console.log('running a task every 10s');
});

// set VAPID keys using web-push, identify who is sending notification
webpush.setVapidDetails(
    'mailto:test@test.com', 
    publicVapidKey, 
    privateVapidKey); // test email

// subscribe route
app.post('/subscribe', (req, res) => {
    // get pushSubscription object
    const subscription = req.body;

    // return a status - 201 = success
    res.status(201).json({});

    // create payload (optional, could be title of notif)
    const payload = JSON.stringify({ title: 'Push Test' });
    
    // pass object into sendNotificaiton
    webpush
        .sendNotification(subscription, payload)
        .catch(err => console.error(err));
});

const port = 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
