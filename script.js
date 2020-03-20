// Документация к API Aviasales : https://www.aviasales.ru/API

// БЛОК КОНСТАНТ И ПЕРЕМЕННЫХ

const formSearch=document.querySelector('.form-search'),
     inputCitiesFrom=document.querySelector('.input__cities-from'),
     dropdownCitiesFrom=document.querySelector('.dropdown__cities-from'),
     inputCitiesTo=formSearch.querySelector('.input__cities-to'),
     dropdownCitiesTo=formSearch.querySelector('.dropdown__cities-to'),
     inputDateDepart=formSearch.querySelector('.input__date-depart'),
     cheapestTicket=document.getElementById('cheapest-ticket'),
     otherCheapTickets=document.getElementById('other-cheap-tickets'),
     errorHeader=document.getElementById('errorHeader'),
     MAX_COUNT = 10;

// данные
const citiesAPI ='DataBase/cities.json',
// или прямиком с сайта вот так:
// 'http://api.travelpayouts.com/data/ru/cities.json',
// но надо тогда добавлять в коде proxy + citiesAPI и прокси может отказать
    proxy='https://cors-anywhere.herokuapp.com/';
let city=[];
const API_KEY='91e82fccbbe795297c655ff1f7f71a48',
    // исходная страница calendar взята по адресу http://min-prices.aviasales.ru/calendar_preload?origin=SVX&destination=KGD&depart_date=2020-05-25&one-way=true
    // calendar='DataBase/calendar_preload.json',
    calendar='http://min-prices.aviasales.ru/calendar_preload',
    // исходная страница latestAPI взята по адресу http://api.travelpayouts.com/v2/prices/latest?currency=rub&origin=SVX&destination=KGD&beginning_of_period=2020-05-25&one_way=true&limit=1000&show_to_affiliates=false&sorting=price&token=91e82fccbbe795297c655ff1f7f71a48
    latestAPI='DataBase/latest.json';
    

// КОНЕЦ БЛОКА КОНСТАНТ И ПЕРЕМЕННЫХ
// БЛОК ФУНКЦИЙ

// функция для получения городов с кодами из сервера
// получаем через API браузера - XMLHttpRequest
const getData = (url, callback, reject = console.error) =>
{
        // создаём объект
        const request = new XMLHttpRequest();
        // открываем соединение с методом GET по адресу url
        // url передаём 
        request.open('GET', url);
        // отслеживаем событие
        request.addEventListener('readystatechange', () => {
            if (request.readyState !== 4) return;

            if (request.status === 200)
                callback(request.response);
            else
                reject(request.status);
        });
        // посылаем запрос
        request.send();
}
// функция, показывающая listBox с городами по фильтру
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
                        const fixItem=item.name.toLowerCase();
                        // ДЗ 3 пункт 3
                        // будем проверять на совпадение с регулярным выражением
                        const pattern=new RegExp(`^${input.value.toLowerCase()}.*`);
                        return fixItem.match(pattern);
                        //  return fixItem.includes(input.value.toLowerCase());
                }
            );
            // теперь отсортируем массив по городам в порядке возрастания
            filterCity.sort((a,b) => {
                if (a.name>b.name)
                    return 1;
                else if (a.name<b.name)
                    return -1;
                else
                    return 0;
                });            
            filterCity.forEach( (item) => 
            {
                const li=document.createElement('li');
                li.classList.add('dropdown__city');
                li.textContent=item.name;
                list.append(li);
            });
        }
    };
// функция для клика по городу, чтобы при клике заполнялся текстбокс
const selectCity = (event,input,list) => 
{
    const target=event.target;
    if (target.tagName.toLowerCase() === 'li')
    {
        input.value=target.textContent;
        list.textContent='';
    }
};
//изменение строки даты в другой формат
const getDate = (date) =>
{
    return new Date(date).toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
}
// получить название города по коду
const getNameCity = (code) =>
{
    const objCity=city.find((item) => item.code === code);
    return objCity.name;
}
// получаем кол-во пересадок в виде числа и возвращаем строку
const getChanges = (num) =>
{
    if (num)
    {
        return num === 1 ? 'С одной пересадкой' : 'С двумя пересадками';
    }
    else
        return 'Без пересадок';
}
// формируем ссылку
const getLinkAviasales = (data) =>
{
    let link='https://www.aviasales.ru/search/';
    link += data.origin;
    const date=new Date(data.depart_date);
    const day=date.getDate();
    const month=date.getMonth()+1;
    link += day < 10 ? '0' + day : day;
    link+=month < 10 ? '0' + month : month;
    // 1  в конце это количество пассажиров
    link += data.destination + '1';
    return link;
    // https://www.aviasales.ru/search/SVX2905KGD1

}
// теперь эта функция получает текст ошибки типа "на дату нет полётов" и может выводить такую ошибку как для текущей даты, так и для других
// для проверки, использовать 28 марта
// Киев - Ляньюньган нет билетов
// Киев - Монастир нет на текущую дату, но есть на другие

const createCard = (data, textNoDate) => 
{
    // ticket - это для вёрстки
    const ticket = document.createElement('article');
    ticket.classList.add('ticket');
    // сама вёрстка
    let deep = '';
    if (data)
    {
        deep=`
        <h3 class="agent">${data.gate}</h3>
        <div class="ticket__wrapper">
            <div class="left-side">
                <a href="${getLinkAviasales(data)}" target="_blank" class="button button__buy">Купить
                    за ${data.value}₽</a>
            </div>
            <div class="right-side">
                <div class="block-left">
                    <div class="city__from">Вылет из города
                        <span class="city__name">${getNameCity(data.origin)}</span>
                    </div>
                    <div class="date">${getDate(data.depart_date)}</div>
                </div>

                <div class="block-right">
                    <div class="changes">${getChanges(data.number_of_changes)}</div>
                    <div class="city__to">Город назначения:
                        <span class="city__name">${getNameCity(data.destination)}</span>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
    else
    {
        deep=`<h3>${textNoDate}</h3>`;
    }
    ticket.insertAdjacentHTML('afterbegin', deep);

    return ticket;
}
const renderCheapDate = (cheapTicket) => 
{
    cheapestTicket.style.display='block';
    cheapestTicket.innerHTML='<h2>Самые дешевые билеты на выбранную дату</h2>';
    const textNoDate = 'К сожалению, на текущую дату билетов не нашлось :(';
    const ticket = createCard(cheapTicket[0], textNoDate);
    cheapestTicket.append(ticket);
}
// тут реализована сортировка по времени отправления (ДЗ 3 пункт 2)
const renderCheapYear = (cheapTicket) => 
{
    if (cheapTicket.length !== 0)
    {
        otherCheapTickets.style.display='block';
        otherCheapTickets.innerHTML='<h2>Самые дешевые билеты на другие даты</h2>';
        cheapTicket.sort((a,b) => {
            //const dateDiff=new Date(a.depart_date)-new Date(b.depart_date);
            const valueDiff=a.value-b.value;
            return valueDiff;
        });   
            for(let i = 0; i < cheapTicket.length && i<MAX_COUNT; i++)
            {
                const ticket = createCard(cheapTicket[i]);
                otherCheapTickets.append(ticket);
            }
    }
    else
    {
        otherCheapTickets.style.display='block';
        otherCheapTickets.innerHTML='<h2>Самые дешевые билеты на другие даты</h2>';
        const textNoDate='К сожалению, на другие даты билетов не нашлось :(';
        const ticket = createCard(null,textNoDate);
        otherCheapTickets.append(ticket);
    }

};

// получаем данные (data) и дату (date) на самые дешёвые билеты
const renderCheap = (data, date) => {
    const cheapTicketYear = JSON.parse(data)['best_prices'];
    const cheapTicketDate=cheapTicketYear.filter((item) => item.depart_date === date);
    renderCheapDate(cheapTicketDate);
    renderCheapYear(cheapTicketYear);
};
// вывод ошибки в конце formSearch
const throwError = (errorText) =>
{
    errorHeader.style.display='block';
    errorHeader.textContent=errorText;
}

// КОНЕЦ БЛОКА ФУНКЦИЙ
// БЛОК ПОДПИСОК

// подписка текстбокса "Откуда" на событие ввода текста
inputCitiesFrom.addEventListener('input',()=>{
    ShowCity(inputCitiesFrom, dropdownCitiesFrom);
    // теперь когда вводишь в текстбоксы "откуда" и "куда" что-то, ошибка пропадает
    errorHeader.textContent='';
    errorHeader.style.display='none';
});
// подписка листбокса "Откуда" на событие клика на текст
dropdownCitiesFrom.addEventListener('click', (event) => {
        selectCity(event,inputCitiesFrom,dropdownCitiesFrom);
});
// ДЗ 4 пункт 2
// если кликают вне выпадающего списка - он исчезает
// если кликают на текстбоксе, который не пустой - появляется выпадающий список
document.addEventListener('click', (event) => {
    if (event.target.classList.value !== 'dropdown__city' && dropdownCitiesFrom.textContent !== '')
    {
        dropdownCitiesFrom.textContent = '';
    }
    if (event.target.classList.value !== 'dropdown__city' && dropdownCitiesTo.textContent !== '')
    {
        dropdownCitiesTo.textContent = '';
    }
    if (event.target === inputCitiesFrom && dropdownCitiesFrom.textContent === '')
    {
        ShowCity(inputCitiesFrom, dropdownCitiesFrom);
    }
    if (event.target === inputCitiesTo && dropdownCitiesTo.textContent === '')
    {
        ShowCity(inputCitiesTo, dropdownCitiesTo);
    }


})

// ДОМАШНЕЕ ЗАДАНИЕ С 1-го ЗАНЯТИЯ
// дз сделать всё, что было на уроке на "куда"

// подписка текстбокса "Куда" на событие ввода текста
inputCitiesTo.addEventListener('input',()=>{
    ShowCity(inputCitiesTo, dropdownCitiesTo);
    errorHeader.textContent='';
    errorHeader.style.display='none';
});
// подписка листбокса "Куда" на событие клика на текст
dropdownCitiesTo.addEventListener('click', () => {
    selectCity(event,inputCitiesTo,dropdownCitiesTo)});
// подписка кнопки поиска на событие сабмита
formSearch.addEventListener('submit', (event) => {
    // debugger; // смотреть результаты дебагера в sources
    // предотвратить выполнение действия по умолчанию
    event.preventDefault();
    cheapestTicket.textContent='';
    otherCheapTickets.textContent='';    
    errorHeader.style.display='none';
    errorHeader.textContent='';
    // find остановит функцию на первом вхождении?
    const cityFrom=city.find((item) => inputCitiesFrom.value === item.name);
    const cityTo=city.find((item) => inputCitiesTo.value === item.name);
    // формируем для дальнейшего запроса данные
    const formData =
    {
        from:cityFrom, 
        to:cityTo,
        when:inputDateDepart.value
    };
    // проверка на наличие кода для запроса
    if (formData.from && formData.to) 
    {
        // формат: обратные кавычки, далее текст как обычно, когда надо подставить что-то, ставим так: ${что-то} и продолжаем далее писать
        const requestData=`?depart_date=${formData.when}&origin=${formData.from.code}&destination=${formData.to.code}&one-way=true`;
        getData(calendar + requestData, (data) =>
        {
            renderCheap(data,formData.when);
        }, (error) => {
            throwError('В этом направлении нет рейсов!');
        });
    }
    else
        throwError('Введите корректное название города!');
});

// ДЗ 4 пункт 2 - всплывающее окно пропадает, когда кликаешь мимо него

// КОНЕЦ БЛОКА ПОДПИСОК
// БЛОК ВЫЗОВА ФУНКЦИЙ

getData(citiesAPI, (data) => {
    city=JSON.parse(data).filter((item) =>
    {
        return item.name;
    });
});

// ДЗ 2й урок:
// 1) повторить всё что писали
// 2) сделать ОДИН запрос на сервер на получение билета на 25 мая Екатеринбург-Калининград. Вывести в консоль полученный объект. Вывод при загрузке страницы.
// КОДЫ ГОРОДОВ:
// Екатеринбург - SVX
// Калининград - KGD

// можно реализовать двумя способами
// первый : через http://api.travelpayouts.com/v2/prices/latest
// см. константу latestAPI
// Ссылка на документацию: https://support.travelpayouts.com/hc/ru/articles/203956163

// getData(latestAPI,(data) => {
//     data=JSON.parse(data);
//     data=data['data'];
//     data=data.filter((item) => {
//         return item.depart_date==='2020-05-25';
//     })
//     console.log('Через latestAPI:');
//     console.log(data);
// });

// второй : через http://min-prices.aviasales.ru/calendar_preload
// см. константу calendar
// Ссылка на документацию: https://support.travelpayouts.com/hc/ru/articles/203972143-API-календаря-цен

// getData(proxy + calendar,(data) => {
//     data=JSON.parse(data);
//     data=data['current_depart_date_prices'];
//     data=data.filter((item) => {
//         return item.depart_date==='2020-05-25';
//     });
//     console.log('Через min-prices:');
//     console.log(data);
// });

// КОНЕЦ БЛОКА ВЫЗОВА ФУНКЦИЙ

// ДОМАШНЕЕ ЗАДАНИЕ 3й УРОК:
// 1) повторить всё, что было на уроке
// 2) в функции renderCheapYear отсортировать список билетов от самой маленькой даты до самой большой (см. array.prototype.sort)
// 3) отсортировать города в выпадающих списках, чтобы первая буква была именно та, которая идёт в текстбоксе, а далее по алфавиту. остальных городов нет - смотри функцию ShowCity

// ДЗ 4
// 1) Вместо алертов вывести на DOM сообщение чтобы ввели норм данные
// 2) когда кликаем мимо всплывающего окна, оно должно пропасть 