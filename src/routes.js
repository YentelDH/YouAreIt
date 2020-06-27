// import pages
import SignUpPage from './pages/signup';
import SignInPage from './pages/signin';
import MapPage from './pages/map';
import MapModeratorPage from './pages/mapmoderator';
import IntroPage from './pages/intro';
import StartGamePage from './pages/startgame';
import SettingsModPage from './pages/settingsmod';
import SettingsMod2Page from './pages/settingsmod2';
import SettingsMod3Page from './pages/settingsmod3';
import OptionsPage from './pages/options';
import SettingsPlayerPage from './pages/settingsplayer';
import SettingsPlayer2Page from './pages/settingsplayer2';
import SettingsPage from './pages/settings';
import FriendsPage from './pages/friends';
import ProfilePage from './pages/profile';

export default [
  { path: '/signup', view: SignUpPage },
  { path: '/signin', view: SignInPage },
  { path: '/map', view: MapPage },
  { path: '/mapmoderator', view: MapModeratorPage },
  { path: '/intro', view: IntroPage },
  { path: '/startgame', view: StartGamePage },
  { path: '/settingsmod', view: SettingsModPage },
  { path: '/settingsmod2', view: SettingsMod2Page },
  { path: '/settingsmod3', view: SettingsMod3Page },
  { path: '/options', view: OptionsPage },
  { path: '/settingsplayer', view: SettingsPlayerPage },
  { path: '/settingsplayer2', view: SettingsPlayer2Page },
  { path: '/settings', view: SettingsPage },
  { path: '/friends', view: FriendsPage },
  { path: '/profile', view: ProfilePage },
];
