import startApplication from 'startApplication';
import platform from 'platform';
import loader from 'ui/resource/loader';
import { i18n } from 'src/lib/i18n/i18n';
import loadingGroups from 'src/loadingGroups';
import { waitForIt, isDevEnv } from 'src/lib/utils';
import StateObserver from './redux/StateObserver';
import Navigator from './game/navigation/Navigator';
import View from 'ui/View';

export default class Application extends View {
  constructor(opts) {
    super(opts);

    this.loadAssets()
      .then(() => platform.startGameAsync())
      .then(() => platform.sendEntryFinalAnalytics({}, {}, {}))
      .then(() => this.initializeStateObserver())
      .then(() => {
        waitForIt(() => {
          this.startGame();
        }, 300);
      });

    // device.screen.on('Resize', () => this.resize());
  }

  selectLocale() {
    let locale = platform.locale;

    if (isDevEnv()) {
      const testLang = 'en'; // localStorage.getItem('testLang');
      if (testLang) locale = testLang;
    }

    loader.setMap(locale);
    return locale;
  }

  loadAssets() {
    const locale = this.selectLocale();
    console.log('locale:', locale);

    let loadingProgress = 0;

    const setLoadingProgress = (progress) => {
      loadingProgress = progress;
      platform.setLoadingProgress(progress);
    };

    const updateLoadingProgress = () => {
      // Tricking the user by making the loading look fast
      // The progress incrementally increases by 0.5% every tick until next progress level
      // Capping at 99% to make sure we do not display 100% while game not entirely loaded
      // var nextProgress = initialAssets.nextProgress * 100;
      const progressStep = 0.5;
      // console.log('updateLoadingProgress:', loadingProgress + progressStep);
      setLoadingProgress(Math.min(99, loadingProgress + progressStep));
    };

    return new Promise((resolve) => {
      const initialAssets = loadingGroups.initialAssets;

      const progressUpdateHandle = setInterval(() => {
        updateLoadingProgress();
      }, 16);

      i18n.loadLocale(locale).then(() => {
        console.log('i18 locale was preloaded');

        // load initial assets
        initialAssets.load((res) => {
          console.log('initial assets were preloaded', res);

          setLoadingProgress(100);
          clearInterval(progressUpdateHandle);
          resolve();

          loadingGroups.soundAssets.load((res) => {
            // console.log('sounds were preloaded', res);
          });
        });
      });
    });
  }

  async initializeStateObserver() {
    return StateObserver.init({
      playerId: platform.playerID,
      signature: platform.playerSignature,
      // errorHandler: () => console.error('There was an error'), // this.onReplicantError,
      // networkErrorHandler: () => console.error('There was a network error'), // this.onNetworkError,
    }).catch((e) => console.error(e));
  }

  startGame() {
    const navigator = new Navigator({
      superview: this,
    });
  }
}

startApplication(Application);
