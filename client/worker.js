// handle push event
console.log('Service Worker loaded');
self.addEventListener('push', e => {
    const data = e.data.json();
    console.log('Push received');
    // show notification
    self.registration.showNotification(data.title, {
        body: 'Notified by Times Up!',
        icon: 'https://ih1.redbubble.net/image.668989250.8268/flat,750x,075,f-pad,750x1000,f8f8f8.u2.jpg'
        // icon, title, img, and other options available, check push notification options
    }); // comes in from server
});