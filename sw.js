self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('push', e => {
  let d = {title: '📞 Shadow is calling', body: 'Tap to answer.'};
  try { d = Object.assign(d, e.data.json()); } catch (_) {}
  e.waitUntil(self.registration.showNotification(d.title, {
    body: d.body, icon: 'icon.svg', badge: 'icon.svg', tag: 'shadow-call', renotify: true,
    requireInteraction: true, vibrate: [800, 300, 800, 300, 800, 300, 800, 300, 800],
    actions: [{action: 'answer', title: 'Answer'}, {action: 'decline', title: 'Decline'}],
    data: {url: new URL('./?call=1', self.registration.scope).href}
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'decline') return;
  const url = e.notification.data.url;
  e.waitUntil(clients.matchAll({type: 'window', includeUncontrolled: true}).then(list => {
    for (const c of list) if ('focus' in c) return c.navigate(url).then(w => (w || c).focus());
    return clients.openWindow(url);
  }));
});
