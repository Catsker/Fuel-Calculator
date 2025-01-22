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
    'dt eco': 3.58, //дт эко
    'dtz': 2.60, //дт -32
    'gas': 1.25, //газ
}

const selectors = {
    gitHub: '.gitHub',
    form: '[js-calculator]',
    volume: '.volume',
    cost: '.cost',
    select: '.select',
    rate: '.rate'
}

// const namings = {
//     path: 'path',
//     expediture: 'expenditure',
//     rate: 'rate',
//     select: 'select',
// }




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
const form = document.querySelector('[js-calculator]')

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
    window.history.replaceState(
        {},
        '',
        `${window.location.pathname}`
    )

})

form.addEventListener('input', (event) => {
    change(event)
})
