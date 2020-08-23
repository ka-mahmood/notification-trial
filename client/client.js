
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

    await fetch('/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
            'content-type': 'application/json'
        }
    });
    console.log('Notification sent');
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