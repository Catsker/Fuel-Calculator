let pathValue = 0;
let expenditureValue = 0;
let rateValue = 0;

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
    // console.log(`расход ${expenditure}`)
    // console.log(`путь ${path}`)
    // console.log(`цена ${rate}`)

    // console.log(volume.value)
    volume.value = Math.round(expenditure * path) / 100 
    cost.value = Math.round(volume.value * rate * 100) / 100
    // console.log(cost.value)
}

// расстояние
const path = form.path
path.addEventListener("input", function (event) {
    pathValue = path.value
    // console.log(`value: ${pathValue}`)
    cals(pathValue, expenditureValue, rateValue, cost, volume)
})

// расход
const expenditure = form.expenditure
expenditure.addEventListener("input", function (event) {
    expenditureValue = expenditure.value
    // console.log(`value: ${expenditureValue}`)
    cals(pathValue, expenditureValue, rateValue, cost, volume)

})

// цена
const rate = form.rate
rate.addEventListener("input", function (event) {
    select.selectedIndex = 0
    rateValue = rate.value
    // console.log(`value: ${rateValue}`)
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
            // console.log(rate.value)
            rateValue = rate.value
            cals(pathValue, expenditureValue, rateValue, cost, volume)

            break
        case 0:
            rate.value = ''
            rate.focus();
            // rate.setSelectionRange(length, length);
            break
    }

    // console.log(select.selectedIndex)
})

// очистка
const clear = form.clear
clear.addEventListener("click", function (event) {
    // console.log('ok')
    pathValue = 0;
    expenditureValue = 0;
    rateValue = 0;
    // rate.focus();
    // rate.setSelectionRange(length, length);
})

// console.log(main.value);

// console.log(select.options)
// selected = select.selectedIndex
// console.log(selected)

// select.selectedIndex = 4