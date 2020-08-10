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
    return this.notifyUser('SUCCES ✊', 'Jij bent de moderator!', '../assets/images/logo.png');
  }

  notifyPlayer() {
    return this.notifyUser('HET SPEL BEGINT ✋', 'Veel succes, verlies de weg niet!', '../assets/images/logo.png');
  }

  notifyKickPlayer() {
    return this.notifyUser('JE BEN ERUIT GESCHOPT ✊', 'De moderetor heeft jou verwijderd van het spel.', '../assets/images/logo.png');
  }

  notifyGameEnded() {
    return this.notifyUser('HET SPEL IS GESTOPT ✋', 'De moderetor heeft het spel vroegtijdig gestopt.', '../assets/images/logo.png');
  }
}
