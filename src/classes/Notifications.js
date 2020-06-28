/* eslint-disable no-unused-vars */
export default class Notify {
  notifyUser(messageTitle, message, icon) {
    // deze functie geeft een promise terug
    const hasPermisson = async () => {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    };

    const showNotification = async () => {
      const hasPermission = await hasPermisson();
    };

    // eslint-disable-next-line no-new
    new Notification(messageTitle, {
      body: message, icon,
    });
  }

  // Different kinds of notification
  notifyModerator() {
    return this.notifyUser('Succes', 'Jij bent de moderator!', '../assets/images/logo.png');
  }
}