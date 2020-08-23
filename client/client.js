
// want public key, private key is hidden on server
const publicVapidKey = 'BJXyGxIMu9nR-pDCAswU8cxnj3UpWTGyEZsYV0Y5CsIBtmbHa8CLm7oCG4xYgNywjs9c2UqQs9_fP5Wed_DyVT4';

// check service worker, is it able to be used in current browser?
if('serviceWorker' in navigator) { // navigator is browser internals 
    send().catch(err => console.error(err));
}

// function registers serviceWorker, registers push using browser api, send notification/push
// required for permissions
async function send() {
    // registering serviceWorker
    console.log('Registering SW');
    const register = await navigator.serviceWorker.register('/worker.js', {
        scope: '/' // the page which serviceWorker applies
    });
    console.log('SW Registered');

    // register the push
    // note: the url-safe base 64 string for the VAPID key must be changed to uint8array
    // then passed into the subscribe call
    console.log('Registering push');
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
    console.log('Push registered');

    // send push notif
    console.log('Sending notification');
    // send subscription option to backend and pass to sendnotification, which goes to SW

    // output the notification (push) using function, "await" is old command
    // await ('/subscribe', createNotification('Topic 1', '5 minutes'));
    // console.log('Notification sent');
} 

// function that sends request for notification and notes timeout 
function sendRequest(waitTime) {
        // test var:
        endTime = new Date().getTime() + 640 + waitTime*1000;
        startTime = new Date().getTime();
        notifTime = new Date().getTime() + waitTime*1000;   
        //createNotification('Topic 1', '5 minutes');
        waitTime = waitTime*1000; // in milliseconds
        setTimeout(functionTimer, waitTime, notifTime, startTime, endTime, 'Topic 1');
}

function functionTimer(notifTime, startTime, endTime, currTopic) {
    // create a timer (a ten second delay in notification)

    // initial endTime set
    startTime = new Date().getTime();

    console.log(endTime-startTime);
    timeLeft = endTime-startTime;     
    createNotification(currTopic, timeLeft);
}

function createNotification(topic, time) { // create a notification based on topic and time left
    var img = 'icon.jpg';
    if (time == 1) {
        timeOut = 'is 1 second';
    } else if (time <= 60) { // if the time is less or equal to a minute, output in seconds
        timeOut = 'are ' + Math.round(time) + ' seconds';
    } else {
        timeOut = 'are ' + (time/60) + ' minutes';
    }
    var text = `There ${timeOut} remaining for ${topic}`;
    var notification = new Notification('Times Up! Notification', {
        body: text, 
        icon: img
    });
    notifSound();
    return notification;
}

function notifSound() {
    var audio = new Audio ('classic.mp3');
    audio.play();
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}