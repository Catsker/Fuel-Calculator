// Регистрация Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        const swPath = 'sw.js';
        console.log('Attempting to register Service Worker at:', swPath);

        // Проверка доступности файла
        try {
            const response = await fetch(swPath, { method: 'HEAD' });
            if (response.ok) {
                console.log('Service Worker file is available:', swPath);
            } else {
                console.error('Service Worker file is not available:', swPath);
            }
        } catch (error) {
            console.error('Error checking Service Worker file:', error);
        }

        // Регистрация Service Worker
        navigator.serviceWorker.register(swPath)
            .then(reg => console.log('Service Worker registered!', reg))
            .catch(err => console.error('Service Worker registration failed:', err));
    });
}

const fuel = {
    'none': '',
    'ai92': 2.34, //92
    'ai95': 2.44, //95
    'ai98': 2.66, //98
    'dt': 2.44, //дт
    'dt_eco': 3.58, //дт эко
    'dtz': 2.60, //дт -32
    'gas': 1.25, //газ
}

const selectors = {
    gitHub: '.gitHub',
    form: '[js-calculator]',
    volume: '.volume',
    cost: '.cost',
    select: '.select',
    rate: '.rate',
    translation: '[data-lang]',
    translation_placeholder: '[data-lang-placeholder]',
    langInput: '.settings__lang__input'
}

const translation = {
    "ru": {
        "title": "Калькулятор расхода топлива",
        "distance": "Расстояние",
        "expenditure": "Расход",
        "cost": "Стоимость литра топлива",
        "litres-required": "Понадобится литров",
        "amount": "на сумму (BYN)",
        "placeholder_km": "км.",
        "placeholder_l/m": "литров на 100 км.",
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
        "settings-close": "Закрыть",
    },

    "en": {
        "title": "Fuel consumption calculator",
        "distance": "Distance",
        "expenditure": "Consumption",
        "cost": "Cost per liter of fuel",
        "litres-required": "Required liters:",
        "amount": "for the amount of (BYN):",
        "placeholder_km": "km.",
        "placeholder_l/m": "liters per 100 km.",
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
        "settings-close": "Close",
    },

    "be": {
        "title": "Калькулятар выдатку паліва",
        "distance": "Адлегласць",
        "expenditure": "Выдатак",
        "cost": "Кошт літра паліва",
        "litres-required": "Спатрэбіцца літраў",
        "amount": "на суму (BYN)",
        "placeholder_km": "км.",
        "placeholder_l/m": "літраў на 100 км.",
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
        "settings-close": "Схаваць",
    }
}

//update
const currentVersion = 'v2.5.1'
let userVersion = localStorage.getItem("version")

if (currentVersion !== userVersion) {
    let update = document.getElementById("update")
    update.showModal()

    localStorage.setItem("version", currentVersion);
}


// langCHeck
let lang = localStorage.getItem("lang") || "ru"; // Используем let вместо const, чтобы можно было изменять
const dataLang = document.querySelectorAll('[data-lang]');
const dataLangPlaceholder = document.querySelectorAll('[data-lang-placeholder]');
const langSelect = document.getElementById(lang);
const langItems = document.querySelectorAll('.settings__lang__input');

// Устанавливаем выбранный язык в радио-кнопке
if (langSelect) {
    langSelect.checked = true;
}

function LoadLang() {
    // Устанавливаем атрибут lang у тега <html>
    document.documentElement.setAttribute("lang", lang);

    // Обновляем текст на странице
    dataLang.forEach((element) => {
        const key = element.getAttribute('data-lang');
        if (translation[lang] && translation[lang][key]) {
            element.textContent = translation[lang][key];
        }
    });

    // Обновляем плейсхолдеры
    dataLangPlaceholder.forEach((element) => {
        const key = element.getAttribute('data-lang-placeholder');
        if (translation[lang] && translation[lang][key]) {
            element.placeholder = translation[lang][key];
        }
    });
}

// langSet
LoadLang();

// Обработчики событий для переключения языка
langItems.forEach((langItem) => {
    langItem.addEventListener('click', () => {
        // Снимаем выбор со всех радио-кнопок
        langItems.forEach((item) => {
            item.checked = false;
        });

        // Устанавливаем выбор на текущую кнопку
        langItem.checked = true;

        // Обновляем переменную lang
        lang = langItem.value; // Обновляем значение переменной lang

        // Сохраняем выбранный язык в localStorage
        localStorage.setItem("lang", lang);

        // Применяем новый язык
        LoadLang();
    });
});



// GitHub link
const gitHubLink = document.querySelector(selectors.gitHub);

if (gitHubLink) {
    gitHubLink.addEventListener('click', function (event) {
        // Показать диалоговое окно с подтверждением
        const isConfirmed = confirm(`Перейти в профиль разработчика?\n\n${gitHubLink.href}`);

        // Если пользователь отменяет действие, предотвратить переход
        if (!isConfirmed) {
            event.preventDefault();
        }
    });
} else {
    console.error('Элемент .gitHub не найден.');
}

//form
const form = document.querySelector('.container')

//inputs
const path = document.getElementById('path')
const expediture = document.getElementById('exp')
const rate = document.getElementById('rate')
const select = document.getElementById('select')

//output
const volume = document.getElementById('volume')
const cost = document.getElementById('cost')

//buttons
const x2 = document.getElementById('x2')
const clear = document.getElementById('trash')

if (x2.checked) path *= 2
rate.value = fuel[select.value];

//loading
window.location.search
    .replace('?', '')
    .split('&')
    .forEach(queryParams => {
        const [name, value] = queryParams.split('=')

        // console.log(`${name}: ${value}`)

        // name.value = value

        // const elem = document.querySelector(`input[name="${name}"]`) || document.querySelector(`select[name="${name}"]`)

        const elem = document.getElementById(name)


        if (elem) {
            switch (name) {
                case 'x2':
                    elem.checked = value
                    break
                case 'select':
                    rate.value = fuel[value]
                    console.log(`rate: ${rate.value}`)
                    break
                default:
                    elem.value = value
                    break
            }
            if (name === 'x2') {
                elem.checked = value
            }

            elem.value = value
        }

        // console.log(name, value)

    });

volume.textContent = Math.round((expediture.value / 100 * path.value) * 100) / 100
cost.textContent = Math.round((expediture.value / 100 * path.value * rate.value) * 100) / 100

function selectNone() {
    return select.value === 'none' ? `&rate=${rate.value}` : ''
}

function change(event) {
    console.log(event.target.id)
    switch (event.target.id) {
        case 'select':
            if (fuel[select.value]) {
                rate.value = fuel[select.value];
            }
            if (select.value === 'none') {
                rate.focus()
            }
            break
        case 'rate':
            select.value = 'none'
            break
        case 'x2':
            if (path.value) {
                if (x2.checked) {
                    path.value *= 2
                } else {
                    path.value /= 2
                }
            }
            break
    }


    let dataString = ''

    if (x2.checked) dataString += `x2=true`
    if (path.value) dataString += `&path=${path.value}`
    if (expediture.value) dataString += `&exp=${expediture.value}`
    dataString += `&select=${select.value}`
    if (select.value === 'none' && rate.value !== '') dataString += `&rate=${rate.value}`

    window.history.replaceState(
        {},
        '',
        `${window.location.pathname}?${dataString}`
    )

    console.log(window.location.pathname)

    volume.textContent = Math.round((expediture.value / 100 * path.value) * 100) / 100
    cost.textContent = Math.round((expediture.value / 100 * path.value * rate.value) * 100) / 100
}

clear.addEventListener('click', (event) => {
    volume.textContent = 0
    cost.textContent = 0
    Array.from(select.options).forEach(option => {
        option.removeAttribute('selected')
    })
    window.history.replaceState(
        {},
        '',
        `${window.location.pathname}`
    )

})

form.addEventListener('input', (event) => {
    change(event)
})
