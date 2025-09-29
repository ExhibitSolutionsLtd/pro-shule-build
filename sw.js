/*
 * Push notifications.
 *
 * This section handles incoming push events within the service worker.
 * It first checks if the user has granted notification permissions.
 * If the permission is granted, the event data is processed to determine
 * whether it is in text or JSON format. Based on the format, the appropriate
 * data is extracted and passed to the `pushNotification` function.
 *
 *
 * The `pushNotification` function constructs and displays a notification with
 * a default title and message if not provided in the data. The notification
 * also includes an icon and a vibration pattern for emphasis.
 *
 * The `textEvent` and `jsonEvent` functions try to parse the event data
 * as text or JSON, respectively. If the parsing fails, they return `false`.
 */
function pushTextNotification(title = "AGM") {
  // Create and show the notification
  const img = "/logo512.png";
  const text = `${title} next week.`;

  self.registration.showNotification("ProShule", {
    body: text,
    icon: img,
  });
}

function pushDataNotification(data) {
  const title = data.title || "Something Has Happened";
  const message =
    data.message || "Here's something you might want to check out.";
  const icon = "/logo512.png";
  self.registration.showNotification(title, {
    body: message,
    icon,
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    tag: "vibration-sample",
  });
}

function pushFunction(event) {
  if (self.Notification.permission !== "granted") {
    return;
  }

  const textData = textEvent(event.data);
  const jsonData = jsonEvent(event.data);
  if (jsonData) {
    pushDataNotification(jsonData);
    return;
  }
  if (textData) {
    pushTextNotification(textData);
    return;
  }

  // if the data is json then return the data else return false
  function textEvent(data) {
    try {
      const d = data?.text();
      return d;
    } catch (e) {
      return false;
    }
  }

  //if the data is test then return the test else return false

  function jsonEvent(data) {
    try {
      const d = data?.json();
      return d;
    } catch (e) {
      return false;
    }
  }
}
self.addEventListener("push", pushFunction);
