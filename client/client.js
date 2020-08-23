
// want public key, private key is hidden on server
const publicVapidKey = 'BJXyGxIMu9nR-pDCAswU8cxnj3UpWTGyEZsYV0Y5CsIBtmbHa8CLm7oCG4xYgNywjs9c2UqQs9_fP5Wed_DyVT4';

// check service worker, is it able to be used in current browser?
if('serviceWorker' in navigator) { // navigator is browser internals 
    send().catch(err => console.error(err));
}

// function registers serviceWorker, registers push using browser api, send notification/push
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

    // test var:
    randomTime = new Date().getTime();
    randomTime = randomTime + Math.round(Math.floor(Math.random()*(100)));
    console.log(randomTime);
    testFunctionTimer(randomTime, 'Test Topic');
    //createNotification('Topic 1', '5 minutes');
} 

function testFunctionTimer(endTime, currTopic) {
    // initial endTime set
    startTime = new Date().getTime();
    currentTimestamp = new Date().getTime();
    timeLeft = endTime-startTime;
    createNotification(currTopic, timeLeft);
}

function createNotification(topic, time) { // create a notification based on topic and time left
    var img = 'https://images-na.ssl-images-amazon.com/images/I/51EQz9ME%2BKL._SY355_.jpg';
    if (time == 1) {
        timeOut = '1 second';
    } else if (time <= 60) { // if the time is less or equal to a minute, output in seconds
        timeOut = Math.round(time) + ' seconds';
    } else {
        timeOut = (time/60) + ' minutes';
    }
    var text = `You have ${timeOut} left for ${topic}`;
    var notification = new Notification('To Do', {body: text, icon:img});
    return notification;
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