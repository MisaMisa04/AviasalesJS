// Документация к API Aviasales : https://www.aviasales.ru/API

// БЛОК КОНСТАНТ И ПЕРЕМЕННЫХ

const formSearch=document.querySelector('.form-search'),
     inputCitiesFrom=document.querySelector('.input__cities-from'),
     dropdownCitiesFrom=document.querySelector('.dropdown__cities-from'),
     inputCitiesTo=formSearch.querySelector('.input__cities-to'),
     dropdownCitiesTo=formSearch.querySelector('.dropdown__cities-to'),
     inputDateDepart=formSearch.querySelector('.input__date-depart');

// данные
const citiesAPI ='DataBase/cities.json',
// или прямиком с сайта вот так:
// 'http://api.travelpayouts.com/data/ru/cities.json',
// но надо тогда добавлять в коде proxy + citiesAPI и прокси может отказать
    proxy='https://cors-anywhere.herokuapp.com/';
let city=[];
const API_KEY='91e82fccbbe795297c655ff1f7f71a48',
    // исходная страница calendar взята по адресу http://min-prices.aviasales.ru/calendar_preload?origin=SVX&destination=KGD&depart_date=2020-05-25&one-way=true
    calendar='DataBase/calendar_preload.json',
    // исходная страница latestAPI взята по адресу http://api.travelpayouts.com/v2/prices/latest?currency=rub&origin=SVX&destination=KGD&beginning_of_period=2020-05-25&one_way=true&limit=1000&show_to_affiliates=false&sorting=price&token=91e82fccbbe795297c655ff1f7f71a48
    latestAPI='DataBase/latest.json';
    

// КОНЕЦ БЛОКА КОНСТАНТ И ПЕРЕМЕННЫХ
// БЛОК ФУНКЦИЙ

// функция для получения городов с кодами из сервера
// получаем через API браузера - XMLHttpRequest
const getData = (url, callback) =>
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
            console.error(request.status);
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
                        // всегда item это строчка
                        // возвращает item если условие true
                        return fixItem.includes(input.value.toLowerCase());
                }
            );
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

// КОНЕЦ БЛОКА ФУНКЦИЙ
// БЛОК ПОДПИСОК

// подписка текстбокса "Откуда" на событие ввода текста
inputCitiesFrom.addEventListener('input',()=>{
    ShowCity(inputCitiesFrom, dropdownCitiesFrom)});
// подписка листбокса "Откуда" на событие клика на текст
dropdownCitiesFrom.addEventListener('click', () => {
    selectCity(event,inputCitiesFrom,dropdownCitiesFrom)});

// ДОМАШНЕЕ ЗАДАНИЕ С 1-го ЗАНЯТИЯ
// дз сделать всё, что было на уроке на "куда"

// подписка текстбокса "Куда" на событие ввода текста
inputCitiesTo.addEventListener('input',()=>{
    ShowCity(inputCitiesTo, dropdownCitiesTo)});
// подписка листбокса "Куда" на событие клика на текст
dropdownCitiesTo.addEventListener('click', () => {
    selectCity(event,inputCitiesTo,dropdownCitiesTo)});

// КОНЕЦ БЛОКА ПОДПИСОК
// БЛОК ВЫЗОВА ФУНКЦИЙ

getData(citiesAPI, (data) => {
    city=JSON.parse(data).filter((item) =>
    {
        return item.name;
    });
});

// КОНЕЦ БЛОКА ВЫЗОВА ФУНКЦИЙ

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

getData(latestAPI,(data) => {
    data=JSON.parse(data);
    data=data['data'];
    data=data.filter((item) => {
        return item.depart_date==='2020-05-25';
    })
    console.log('Через latestAPI:');
    console.log(data);
});

// второй : через http://min-prices.aviasales.ru/calendar_preload
// см. константу calendar
// Ссылка на документацию: https://support.travelpayouts.com/hc/ru/articles/203972143-API-календаря-цен

getData(calendar,(data) => {
    data=JSON.parse(data);
    data=data['current_depart_date_prices'];
    data=data.filter((item) => {
        return item.depart_date==='2020-05-25';
    });
    console.log('Через min-prices:');
    console.log(data);
});