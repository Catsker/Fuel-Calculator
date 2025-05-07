const App = {
  data() {
    return {
      translation: {
        "ru": {
          "title": "Калькулятор расхода топлива",
          "distance": "Расстояние",
          "expenditure": "Расход",
          "cost": "Стоимость литра топлива",
          "litres_required": "Понадобится литров",
          "amount": "на сумму (BYN)",
          "placeholder_km": "км.",
          "placeholder_l_m": "литров на 100 км.",
          "placeholder_l": "за 1 литр",
          "manual": "Ручной ввод",
          "ai92": "АИ-92",
          "ai95": "АИ-95",
          "ai98": "АИ-98",
          "dt": "ДТ",
          "dt_eco": "ДТ эко",
          "dtz": "ДТЗ -32°",
          "gas": "Газ (ПБА)",
          "settings": "Настройки",
          "change_the_lang": "Изменить язык",
          "settings_close": "Закрыть",
          "version": 'Версия',
          "dnl_title": 'Удобнее в приложении',
          "dnl_description": 'Работает без интернета, обновляется автоматически',
          "dnl_agree": 'Скачать',
          "dnl_disagree": 'Позже',
        },

        "en": {
          "title": "Fuel consumption calculator",
          "distance": "Distance",
          "expenditure": "Consumption",
          "cost": "Cost per liter of fuel",
          "litres_required": "Required liters:",
          "amount": "for the amount of (BYN):",
          "placeholder_km": "km.",
          "placeholder_l_m": "liters per 100 km.",
          "placeholder_l": "per liter",
          "manual": "Manual input",
          "ai92": "92 Octane",
          "ai95": "95 Octane",
          "ai98": "98 Octane",
          "dt": "Diesel fuel",
          "dt_eco": "Diesel ECO",
          "dtz": "Winter diesel -32°",
          "gas": "Gas (propane-butane)",
          "settings": "Settings",
          "change_the_lang": "Change the language",
          "settings_close": "Close",
          "version": "Version",
          "dnl_title": 'More convenient in the app',
          "dnl_description": 'Works offline, updates automatically',
          "dnl_agree": 'Download',
          "dnl_disagree": 'Later',
        },

        "be": {
          "title": "Калькулятар выдатку паліва",
          "distance": "Адлегласць",
          "expenditure": "Выдатак",
          "cost": "Кошт літра паліва",
          "litres_required": "Спатрэбіцца літраў",
          "amount": "на суму (BYN)",
          "placeholder_km": "км.",
          "placeholder_l_m": "літраў на 100 км.",
          "placeholder_l": "за 1 літр",
          "manual": "Ручны ўвод",
          "ai92": "АІ-92",
          "ai95": "АІ-95",
          "ai98": "АІ-98",
          "dt": "ДТ",
          "dt_eco": "ДТ эка",
          "dtz": "ДТЗ -32°",
          "gas": "Газ (ПБА)",
          "settings": "Налады",
          "change_the_lang": "Змяніць мову",
          "settings_close": "Схаваць",
          "version": 'Версія',
          "dnl_title": 'Зручней у дадатку',
          "dnl_description": 'Працуе без інтэрнэту, абнаўляецца аўтаматычна',
          "dnl_agree": 'Спампаваць',
          "dnl_disagree": 'Пазней',
        }
      },
      fuel: {
        // 'none': '',
        'ai92': 2.50, //92
        'ai95': 2.60, //95
        'ai98': 2.82, //98
        'dt': 2.60, //дт
        'dt_eco': 3.77, //дт эко
        // 'dtz': 2.72, //дт -32
        'gas': 1.32, //газ
      },
      path: '',
      exp: '',
      rate: '',
      x2: false,
      select: 'ai95',
      volume: '',
      cost: '',
      lastChanged: 'path',
      lang: 'ru',
      currentVersion: '3.02',
      staticBackground: false,
      isShow: false,
      // currentUrl: ''
      // showInstallButton: false,
    }
  },
  mounted() {
    // Обновляем данные из search строки
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    // console.log(`params: ${params}`)
    this.rate = this.fuel[this.select];
    if (params.toString() !== '') {
      this.lastChanged = params.get('lastChanged')
      if (params.has('x2')) {
        this.x2 = true
      }
      this.exp = params.get('exp') || '';
      this.select = params.get('select') || 'ai95';
      if (this.select === 'none') {
        this.rate = params.get('rate') || '';
      } else {
        this.rate = this.fuel[this.select] || '';
      }
      switch (this.lastChanged) {
        case 'cost':
          this.cost = params.get('cost') || '';
          break
        case 'volume':
          this.volume = params.get('volume')
          break
        default:
          this.path = params.get('path') || '';
          break
      }
      // console.log(`.lastChanged ${this.lastChanged}`)
      // console.log(`.x2 ${this.x2}`)
      // console.log(`.exp ${this.exp}`)
      // console.log(`.select ${this.select}`)
      // console.log(`.rate ${this.rate}`)
      // console.log(`.cost ${this.cost}`)
      // console.log(`.volume ${this.volume}`)
      // console.log(`.path ${this.path}`)
      this.recalculate('load')
    }


    // Проверяем поддержку Service Worker и PWA
    if ('serviceWorker' in navigator) {
      this.registerServiceWorker();
    }



    // Слушаем событие beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('📦 beforeinstallprompt triggered!');
      e.preventDefault(); // Отключаем стандартное окно установки
      this.deferredPrompt = e; // Сохраняем событие для использования позже
      // window.installApp.show(); // Показываем кастомное окно
      setTimeout(() => {
        this.isShow = true

      }, 5000)
      console.log('called to show the window')
    });

    //is installed
    // if (window.matchMedia('(display-mode: standalone)').matches) {
    //   this.showInstallButton = false;
    // }
    // window.addEventListener('appinstalled', () => {
    //   this.showInstallButton = false
    // })


    //other
    const userVersion = localStorage.getItem('version')
    if (!userVersion || userVersion !== this.currentVersion) {
      // this.openUpdateWindow()
      localStorage.setItem('version', this.currentVersion)
    }

    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      this.lang = savedLang;
    }
  },
  watch: {
    lang(value) {
      localStorage.setItem('lang', value)
    },
    select(event) {
      if (event !== 'none') {
        this.rate = this.fuel[this.select]
        this.recalculate('select')
      } else {
        this.updateURL()
      }
    }
  },
  methods: {
    updateURL() {
      let newSearch
      switch (this.lastChanged) {
        case 'cost':
          newSearch = `?lastChanged=${this.lastChanged}`
          if (this.x2) {
            newSearch += '&x2'
          }
          newSearch += `&cost=${this.cost}&exp=${this.exp}&select=${this.select}`
          break
        case 'volume':
          newSearch = `?lastChanged=${this.lastChanged}`
          if (this.x2) {
            newSearch += '&x2'
          }
          newSearch += `&volume=${this.volume}&exp=${this.exp}&select=${this.select}`
          break
        default:
          newSearch = `?lastChanged=${this.lastChanged}`
          if (this.x2) {
            newSearch += '&x2'
          }
          newSearch += `&path=${this.path}&exp=${this.exp}&select=${this.select}`
          break
      }

      if (this.select === 'none') {
        newSearch += `&rate=${this.rate}`
      }
      // console.log(newSearch)
      history.replaceState(null, '', `${location.pathname}${newSearch}`)
    },
    registerServiceWorker() {
      window.addEventListener('load', () => {
        const swPath = 'sw.js';
        console.log('Attempting to register Service Worker at:', swPath);
        navigator.serviceWorker
          .register(swPath)
          .then((reg) => console.log('Service Worker registered!', reg))
          .catch((err) => console.error('Service Worker registration failed:', err));
      });
    },
    installApp() {
      if (this.deferredPrompt) {
        // Показываем диалог установки
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            this.closeInstallPrompt()
            console.log('User dismissed the install prompt');
          }
          this.deferredPrompt = null;
          this.closeInstallPrompt() // Скрываем окно после попытки установки
        });
      }
    },
    closeInstallPrompt() {
      this.isShow = false
      // window.installApp.close()
    },
    openUpdateWindow() {
      window.update.showModal()
    },
    closeUpdateWindow() {
      window.update.close();
    },
    openSettings() {
      window.settings.showModal()
    },
    closeSettings() {
      window.settings.close();
    },
    x2Changed(event) {
      this.x2 = event.target.checked
      if (this.path !== '') {
        this.lastChanged = 'path'
        this.path *= this.x2 ? 2 : 0.5
      }
      this.recalculate('x2')
    },
    clear() {
      this.path = ''
      this.volume = ''
      this.cost = ''
      this.exp = ''
      this.select = 'none'
      this.rate = ''
      this.x2 = false
      this.lastChanged = 'path'
      history.replaceState(null, '', window.location.pathname);
    },
    rateClicked() {
      this.select = 'none'
      this.recalculate('rate')
    },
    pathChanged() {
      this.lastChanged = 'path'
      this.volume = Math.round((this.exp / 100 * this.path) * 100) / 100;
      this.cost = Math.round((this.volume * this.rate) * 100) / 100;
      this.updateURL()
    },
    volumeChanged() {
      this.lastChanged = 'volume'
      this.path = Math.round((this.volume / (this.exp / 100)) * 100) / 100;
      this.cost = Math.round((this.volume * this.rate) * 100) / 100;
      this.x2 = false
      this.updateURL()
    },
    costChanged() {
      this.lastChanged = 'cost'
      const volume = this.cost / this.rate;
      this.volume = Math.round(volume * 100) / 100;
      this.path = Math.round((volume / (this.exp / 100)) * 100) / 100;
      this.x2 = false
      this.updateURL()
    },
    recalculate(called) {
      switch (this.lastChanged) {
        case 'volume':
          this.path = Math.round((this.volume / (this.exp / 100)) * 100) / 100;
          this.cost = Math.round((this.volume * this.rate) * 100) / 100;
          break;
        case 'cost':
          const volume = this.cost / this.rate;
          this.volume = Math.round(volume * 100) / 100;
          this.path = Math.round((volume / (this.exp / 100)) * 100) / 100;
          break;
        default:
          this.volume = Math.round((this.exp / 100 * this.path) * 100) / 100;
          this.cost = Math.round((this.volume * this.rate) * 100) / 100;
          break;
      }
      console.log(called)
      this.updateURL()
    }
  }
}

Vue.createApp(App).mount('#app')