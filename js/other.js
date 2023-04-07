
//обработчик даты
function createDate(date) {
    let getDate = new Date(Date.parse(date));
    const yyyy = getDate.getFullYear();
    let mm = getDate.getMonth() < 10 ? '0' + (getDate.getMonth() + 1) : getDate.getMonth() + 1;
    let dd = getDate.getDate() < 10 ? '0' + getDate.getDate() : getDate.getDate();
    return `${dd}.${mm}.${yyyy}`
}

//обработчик времени
function createTime(date) {
    let getDate = new Date(Date.parse(date));
    let hour = getDate.getUTCHours() < 10 ? '0' + getDate.getUTCHours() : getDate.getUTCHours();
    let min = getDate.getUTCMinutes() < 10 ? '0' + getDate.getUTCMinutes() : getDate.getUTCMinutes();
    return `${hour}:${min}`
}

//делаем список из кнопок контактов
function contacts(arr) {
    let $td = document.createElement('td'),
        $contactsList = document.createElement('ul');

    $contactsList.classList.add('contacts__list');

    function createContact(item) {
        let $contactsItem = document.createElement('li');
        let $contactsBtn = document.createElement('button');

        $contactsItem.classList.add('contacts__item');

        if (item.type === 'VK') {
            $contactsBtn.classList.add('btn', 'btn__social', 'social--vk');
            $contactsBtn.dataset.tippyContent = item.value;
        }
        if (item.type === 'Телефон') {
            $contactsBtn.classList.add('btn', 'btn__social', 'social--phone');
            $contactsBtn.dataset.tippyContent = item.value;
        }
        if (item.type === 'Email') {
            $contactsBtn.classList.add('btn', 'btn__social', 'social--mail');
            $contactsBtn.dataset.tippyContent = item.value;
        }
        if (item.type === 'Facebook') {
            $contactsBtn.classList.add('btn', 'btn__social', 'social--fb');
            $contactsBtn.dataset.tippyContent = item.value;
        }
        if (item.type === 'Другое') {
            $contactsBtn.classList.add('btn', 'btn__social', 'social--other');
            $contactsBtn.dataset.tippyContent = item.value;
        }
        if (item.type === 'Другое') {
            $contactsBtn.classList.add('btn', 'btn__social', 'social--other');
            $contactsBtn.dataset.tippyContent = item.value;
        }

        $contactsBtn.addEventListener("mouseenter", function () {
            tippy('.btn__social', {
                theme: 'tooltip',
                trigger: 'click',
            });
        });

        $contactsList.append($contactsItem);
        $contactsItem.append($contactsBtn);
    };

    function removeList() {
        let childList = $contactsList.querySelectorAll('.contacts__item');
        for (let item of childList) {
            item.remove();
        };
        for (let item of arr) {
            createContact(item);
        };
        $td.append($contactsList);
        return $td;
    }

    //условие для массива 4+ (доп кнопка)
    if (arr.length > 4) {
        let newArr = arr.slice(0, 4);
        for (let item of newArr) {
            createContact(item);
        }

        let $contactsItem = document.createElement('li');
        let $dropAllContact = document.createElement('button');
        $contactsItem.classList.add('contacts__item');
        $dropAllContact.classList.add('btn', 'btn__all-social')
        $dropAllContact.textContent = '+' + `${arr.length - 4}`;

        $dropAllContact.addEventListener('click', (removeList))
        $contactsList.append($contactsItem);
        $contactsItem.append($dropAllContact);

        $td.append($contactsList);
        return $td;
    }

    for (let item of arr) {
        createContact(item);
    }

    $td.append($contactsList);
    return $td;
}

//объединяем Ф_И_О
function getFio(item) {
    return `${item.surname} ${item.name} ${item.lastName} `;
}

//первая заглавная буква
function firstUppercase(str) {
    return result = str.substr(0, 1).toUpperCase() + str.substr(1).toLowerCase();
};

// СОРТИРОВКА 
function sortClients(sortName, direction, listData) {
    let sortClients = [...listData];
    let newListData = sortClients.sort(function (a, b) {
        let directionIf = a[sortName] < b[sortName];
        if (direction == true) {
            directionIf = a[sortName] > b[sortName];
        };
        if (directionIf == true) {
            return - 1;
        };
    });
    return newListData;
};

//валидация
function validate(form) {
    //удаляем все ошибки и классы error
    function clearError() {
        let errormass = document.querySelectorAll('.error-massage');
        //console.log(errormass);

        for (let item of errormass) {
            //console.log(item);
            item.remove();
        }
        form.querySelectorAll('input').forEach(input => {
            const parent = input.parentNode;
            if (parent.classList.contains('error')) {
                parent.classList.remove('error');
            };
        });
    }

    //убираем класс error при фокусе на input
    function check() {
        form.querySelectorAll('input').forEach(input => {
            const parent = input.parentNode;

            input.addEventListener('focus', function (event) {
                if (parent.classList.contains('error')) {
                    parent.classList.remove('error');
                };
            });

            input.addEventListener('blur', function (event) {
                if (input.value == '' && input.required) {
                    parent.classList.add('error');
                };
            });
        })
    };

    //создаем блок, класс и текст обшибки  
    function createError(input, box, text) {
        const parent = input.parentNode;
        parent.classList.add('error');

        let $errorMassage = document.createElement('div');
        $errorMassage.classList.add('error-massage');
        $errorMassage.textContent = text;
        box.after($errorMassage);
    }

    let result = true;

    clearError();
    check();

    //проверка
    form.querySelectorAll('input').forEach(input => {
        //console.log(input.value)
        if (input.value == "" && input.required) {
            const errorBox = form.querySelector('.select__box');

            createError(input, errorBox, 'Ошибка: Имеется не заполненное поле или контакт');

            result = false;
        }
    });

    return result;
}

function createNotFound() {
    let $content = document.querySelector('#sortTable');
    let $notFound = document.createElement('div');

    $notFound.classList.add('not-found');
    $notFound.textContent = 'По вашему запросу ни чего не найдено :(';

    $content.after($notFound);
}