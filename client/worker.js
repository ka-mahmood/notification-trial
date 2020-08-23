// handle push event
console.log('Service Worker loaded');
self.addEventListener('push', e => {
    const data = e.data.json();
    console.log('Push received');
    // show notification
    self.registration.showNotification(data.title, {
        body: 'Notified by Times Up!',
        icon: 'icon.jpg'
        // icon, title, img, and other options available, check push notification options
    }); // comes in from server
});