// self.addEventListener("sync", (event) => {
//   if (event.tag === "sync-target") {
//     event.waitUntil(syncData());
//   }
// });

// function syncData() {
//   /**Sync offline with online data */
// }

let vapidPublicKey;

// Handle incoming messages
self.addEventListener("message", function (event) {
  console.log(event?.data);
  if (event.data.type === "SUBSCRIBE") {
    vapidPublicKey = event.data.vapidPublicKey;
    subscribeUser();
  }
});

function urlB64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function subscribeUser() {
  if (!vapidPublicKey) {
    console.error("VAPID public key not set!");
    return;
  }

  const applicationServerKey = urlB64ToUint8Array(vapidPublicKey);
  self.registration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    })
    .then(function (subscription) {
      console.log("User is subscribed:", subscription);
      // Send subscription to your server
    })
    .catch(function (err) {
      console.log("Failed to subscribe the user: ", err);
    });
}

// self.addEventListener("periodic-sync", (event) => {
//   if (event.tag === "get-latest-data") {
//     event.waitUntil(updateData());
//   }
// });

// function updateData() {
//   /**Sync offline with online data */
// }

self.addEventListener("push", (event) => {
  if (!(self.Notification && self.Notification.permission === "granted")) {
    return;
  }
  const data = event.data?.json() ?? {};
  const title = data.title || "Something Has Happened";
  const message =
    data.message || "Here's something you might want to check out.";
  const icon = "images/new-notification.png";

  const notification = new self.Notification(title, {
    body: message,
    tag: "simple-push-demo-notification",
    icon,
  });

  notification.addEventListener("click", () => {
    clients.openWindow(
      "https://example.blog.com/2015/03/04/something-new.html"
    );
  });
});
