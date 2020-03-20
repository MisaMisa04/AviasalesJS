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
    // calendar='DataBase/calendar_preload.json',
    calendar='http://min-prices.aviasales.ru/calendar_preload',
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
const renderCheapDate = (cheapTicket) => 
{
    console.log(cheapTicket);
}
// тут реализована сортировка по времени отправления (ДЗ 3 пункт 2)
const renderCheapYear = (cheapTicket) => 
{
    cheapTicket.sort((a,b) => {
        const dateDiff=new Date(a.depart_date)-new Date(b.depart_date);
        if (dateDiff<0)
            return -1;
        else if (dateDiff>0)
            return 1;
        else  
            return 0;
    });
     console.log(cheapTicket);
};

// получаем данные (data) и дату (date) на самые дешёвые билеты
const renderCheap = (data, date) => {
    const cheapTicketYear = JSON.parse(data)['best_prices'];
    const cheapTicketDate=cheapTicketYear.filter((item) => item.depart_date === date);
    renderCheapDate(cheapTicketDate);
    renderCheapYear(cheapTicketYear);
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
// подписка кнопки поиска на событие сабмита
formSearch.addEventListener('submit', (event) => {
    // предотвратить выполнение действия по умолчанию
    event.preventDefault();
    // find остановит функцию на первом вхождении?
    const cityFrom=city.find((item) => inputCitiesFrom.value === item.name);
    const cityTo=city.find((item) => inputCitiesTo.value === item.name);
    const formData =
    {
        from:cityFrom.code, 
        to:cityTo.code,
        when:inputDateDepart.value
    };
    // формат: обратные кавычки, далее текст как обычно, когда надо подставить что-то, ставим так: ${что-то} и продолжаем далее писать
    const requestData=`?depart_date=${formData.when}&origin=${formData.from}&destination=${formData.to}&one-way=true`;
    getData(calendar +requestData, (data) => {
        renderCheap(data,formData.when);
    });
});

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