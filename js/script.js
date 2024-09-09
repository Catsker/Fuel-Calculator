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

let pathValue = 0;
let expenditureValue = 0;
let rateValue = 0;
let x2form = false

const fuel = {
    '0': '',
    '1': 2.34, //92
    '2': 2.44, //95
    '3': 2.66, //98
    '4': 2.44, //дт
    '5': 3.58, //дт эко
    '6': 2.60, //дт -32
    '7': 1.25, //газ
}

const links = document.querySelectorAll('a');

// Привязываем обработчик клика ко всем ссылкам
links.forEach(link => {
    link.addEventListener('click', function(event) {
        // Показать диалоговое окно с подтверждением
        const isConfirmed = confirm(`Перейти на сайт?\n\n${link}`);
        
        // Если пользователь отменяет действие, предотвратить переход
        if (!isConfirmed) {
            event.preventDefault();
        }
    });
});

const form = document.forms.main;
let volume = form.volume
let cost = form.cost

// вычисления
function cals(path, expenditure, rate, cost, volume) {
    volume.value = Math.round(expenditure * path) / 100 
    cost.value = Math.round(volume.value * rate * 100) / 100
}

// расстояние
const path = form.path
path.addEventListener("input", function (event) {
    pathValue = path.value
    cals(pathValue, expenditureValue, rateValue, cost, volume)
})

// расход
const expenditure = form.expenditure
expenditure.addEventListener("input", function (event) {
    expenditureValue = expenditure.value
    cals(pathValue, expenditureValue, rateValue, cost, volume)

})

// цена
const rate = form.rate
rate.addEventListener("input", function (event) {
    select.selectedIndex = 0
    rateValue = rate.value
    cals(pathValue, expenditureValue, rateValue, cost, volume)
})

// список
const select = form.select
select.addEventListener("change", function (event) {
    switch(select.selectedIndex) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
            rate.value = fuel[select.selectedIndex]
            rateValue = rate.value
            cals(pathValue, expenditureValue, rateValue, cost, volume)
            break
        case 0:
            rate.value = ''
            rate.focus();
            break
    }
})

function x2on(x2) {
    console.log('x2 on')
    x2.style.background = '#009a3c'
    x2.style.color = 'white'

    if (path.value != '') {
        pathValue *= 2
        path.value = pathValue
    }

    cals(pathValue, expenditureValue, rateValue, cost, volume)

    x2form = true
}

function x2off(x2) {
    console.log('x2 off')
    x2.style.background = 'white'
    x2.style.color = 'black'

    if (path.value != '') {
        pathValue = Math.round(path.value * 50) / 100
        path.value = pathValue
    }

    cals(pathValue, expenditureValue, rateValue, cost, volume)
    
    x2form = false
}

// очистка
const clear = form.clear
clear.addEventListener("click", function (event) {
    pathValue = 0;
    expenditureValue = 0;
    rateValue = 0;
    x2off(x2);
})

// x2
const x2 = form.x2
x2.addEventListener("click", function (event) {
    if (x2form == false) {
        x2on(x2);
    } else {
        x2off(x2);
    }
})
