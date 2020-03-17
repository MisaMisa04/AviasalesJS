const formSearch=document.querySelector('.form-search'),
     inputCitiesFrom=document.querySelector('.input__cities-from'),
     dropdownCitiesFrom=document.querySelector('.dropdown__cities-from'),
     inputCitiesTo=formSearch.querySelector('.input__cities-to'),
     dropdownCitiesTo=formSearch.querySelector('.dropdown__cities-to'),
     inputDateDepart=formSearch.querySelector('.input__date-depart');

const city=['Москва', 'Санкт Петербург', 'Минск', 'Караганда', 
    'Челябинск', 'Керчь', 'Волгоград','Самара', 'Днепропетровск',
    'Екатеринбург','Одесса', 'Ухань', 'Шымкент',
    'Нижний Новгород', 'Калининград', 'Вродслав','Ростов-на-дону'];

const ShowCity = (input, list) => 
    {
        // сначала затираем всё, чтобы не было дублирования
        list.textContent='';
    
        // вся функция с перебором и заполнением будет работать
        // только если ввод НЕ пустой
        if (input.value !== '')
        {
            // есть ещё forEach
            const filterCity = city.filter
            (
                (item) => 
                {
                    // переводим всё в нижний регистр
                    const fixItem=item.toLowerCase();
                    // всегда item это строчка
                    // возвращает item если условие true
                    return fixItem.includes(input.value.toLowerCase());
                }
            );
            filterCity.forEach( (item) => 
            {
                const li=document.createElement('li');
                li.classList.add('dropdown__city');
                li.textContent=item;
                list.append(li);
            });
        }
    };

// подписка бокса на событие ввода текста
inputCitiesFrom.addEventListener('input',()=>{ShowCity(inputCitiesFrom, dropdownCitiesFrom)});

dropdownCitiesFrom.addEventListener('click', (event) => 
{
    const target=event.target;
    if (target.tagName.toLowerCase() === 'li')
    {
        inputCitiesFrom.value=target.textContent;
        dropdownCitiesFrom.textContent='';
    }
});

// ДОМАШНЕЕ ЗАДАНИЕ С 1-го ЗАНЯТИЯ
// дз сделать всё, что было на уроке на "куда"
inputCitiesTo.addEventListener('input',()=>{ShowCity(inputCitiesTo, dropdownCitiesTo)});

dropdownCitiesTo.addEventListener('click', (event) => 
{
    const target=event.target;
    if (target.tagName.toLowerCase() === 'li')
    {
        inputCitiesTo.value=target.textContent;
        dropdownCitiesTo.textContent='';
    }
});

