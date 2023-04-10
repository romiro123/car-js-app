async function getData() {
    let res = await fetch('https://cfb2-178-207-243-233.ngrok-free.app/api/clients', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    let data = await res.json();
    return data;
};
//создание нового клиента
async function createClient(obj) {
    let res = await fetch('https://cfb2-178-207-243-233.ngrok-free.app/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: obj.name,
            surname: obj.surname,
            lastName: obj.lastName,
            contacts: obj.contacts,
        })
    })
    let data = await res.json();
    return data;
};
//редактирование клиента
async function changeClient(obj, id) {
    let res = await fetch('https://cfb2-178-207-243-233.ngrok-free.app/api/clients/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: obj.name,
            surname: obj.surname,
            lastName: obj.lastName,
            contacts: obj.contacts,
        })
    })
    let data = await res.json();
    return data;
};
//удаление клиента
async function deleteClient(id) {
    await fetch('https://cfb2-178-207-243-233.ngrok-free.app/api/clients/' + id, {
        method: 'DELETE'
    })
};
//поиск
async function searchClient(value) {
    let res = await fetch('https://cfb2-178-207-243-233.ngrok-free.app/api/clients?search=' + value, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    let data = await res.json();
    return data;
};

//создание обертки модального окна
function modal(open, close) {
    let $modalWrap = document.createElement('div'),
        $modalBox = document.createElement('div'),
        $modalClosed = document.createElement('button');

    $modalWrap.classList.add('modal-wrap');
    $modalBox.classList.add('modal-box');
    $modalClosed.classList.add('btn--close', 'btn');

    $modalBox.append($modalClosed);
    $modalWrap.append($modalBox);
    body.append($modalWrap);

    open($modalWrap, $modalBox);

    if (body.querySelector('.modal-wrap')) {
        setTimeout(() => {
            $modalWrap.classList.add('open')
        }, 100);
    };

    $modalClosed.addEventListener('click', () => {
        close($modalWrap);
    });

    //удаление модалки при нажатии на ESC
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            close($modalWrap);
        }
    });

    //удаление модалки при клике вне модального окна
    $modalWrap.querySelector('.modal-box').addEventListener('click', event => {
        event._clickInModal = true;
    });
    $modalWrap.addEventListener('click', event => {
        if (event._clickInModal) return;
        event.currentTarget.classList.remove('open');
        close($modalWrap);
    });

};

function animateClose(item) {
    item.classList.remove('open');
    setTimeout(() => {
        item.remove();
    }, 500);
}

//создаем header
function createHeader() {
    let $header = document.createElement('header'),
        $logoLink = document.createElement('a'),
        $logoImg = document.createElement('img'),
        $formHeader = document.createElement('form'),
        $inputHeader = document.createElement('input');

    $header.classList.add('header');
    $logoLink.classList.add('header__logo');
    $logoImg.classList.add('logo');
    $logoImg.src = 'img/logo.svg';
    $logoImg.alt = 'logo';
    $formHeader.classList.add('header__form');
    $inputHeader.classList.add('header__input', 'txt_grey');
    $inputHeader.setAttribute('placeholder', 'Введите запрос');

    let timeout;

    $inputHeader.addEventListener('input', function () {
        let searchText = $inputHeader.value;
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(async () => {
            listData = await searchClient(searchText);
            if (listData.length == 0) {
                createCrmApp(listData);
                createNotFound();
            }
            else {
                createCrmApp(listData);
            }
        }, 300);

    });

    $header.append($logoLink);
    $logoLink.append($logoImg);
    $header.append($formHeader);
    $formHeader.append($inputHeader);
    return $header;
};

//создаем таблицу
function createTable() {
    let table = document.createElement('table')
    table.classList.add('table');
    table.setAttribute('id', 'sortTable')
    return table;
};

//создаем thead таблицы и заполняем его
function createTableTH(path) {
    let thTable = document.createElement('thead'),

        tr = document.createElement('tr'),
        thId = document.createElement('td'),
        thIdBtn = document.createElement('button'),

        thFio = document.createElement('td'),
        thFioBtn = document.createElement('button'),

        thDateCreate = document.createElement('td'),
        thDateCreateBtn = document.createElement('button'),

        thLastChange = document.createElement('td'),
        thLastChangeBtn = document.createElement('button'),

        thContacts = document.createElement('td'),
        thActions = document.createElement('td');

    thTable.classList.add('thead');

    thIdBtn.classList.add('btn', 'btn--th', 'btn--th-active');
    thIdBtn.setAttribute('data-path', 'id');
    thIdBtn.textContent = 'ID';

    thFioBtn.classList.add('btn', 'btn--th');
    thFioBtn.setAttribute('data-path', 'surname');
    thFioBtn.textContent = 'Фамилия Имя Отчество';

    thDateCreateBtn.classList.add('btn', 'btn--th');
    thDateCreateBtn.setAttribute('data-path', 'createdAt');
    thDateCreateBtn.textContent = 'Дата и время создания';

    thLastChangeBtn.classList.add('btn', 'btn--th');
    thLastChangeBtn.setAttribute('data-path', 'updatedAt');
    thLastChangeBtn.textContent = 'Последние изменения';

    thContacts.textContent = 'Контакты';
    thActions.textContent = 'Действия';

    thTable.append(tr);
    tr.append(thId);
    thId.append(thIdBtn);
    tr.append(thFio);
    thFio.append(thFioBtn);
    tr.append(thDateCreate);
    thDateCreate.append(thDateCreateBtn);
    tr.append(thLastChange);
    thLastChange.append(thLastChangeBtn);
    tr.append(thContacts);
    tr.append(thActions);

    //document.querySelector(`[data-path="${path}"]`).classList.add('btn--th-active')
    return thTable;
};

function createTR(tbody, item) {
    let tr = document.createElement('tr'),
        idTD = document.createElement('td'),
        nameTD = document.createElement('td'),
        dateCreateTD = document.createElement('td'),
        dateCreateDate = document.createElement('span'),
        dateCreateTime = document.createElement('span'),
        lastChangeTD = document.createElement('td'),
        lastChangeDate = document.createElement('span'),
        lastChangeTime = document.createElement('span'),
        contactsTD = document.createElement('td'),
        actionsTD = document.createElement('td'),
        changeButton = document.createElement('button'),
        deleteButton = document.createElement('button');

    tr.classList.add('tbody__tr');
    idTD.classList.add('td__id');
    idTD.textContent = item.id;
    nameTD.classList.add('td__name')
    nameTD.textContent = getFio(item);

    dateCreateTD.classList.add('td__date-create');
    dateCreateTime.classList.add('time', 'txt_grey');
    dateCreateDate.textContent = createDate(item.createdAt);
    dateCreateTime.textContent = createTime(item.createdAt);

    lastChangeTD.classList.add('td__date-update');
    lastChangeTime.classList.add('time', 'txt_grey');
    lastChangeDate.textContent = createDate(item.updatedAt);
    lastChangeTime.textContent = createTime(item.updatedAt);

    contactsTD = contacts(item.contacts);
    changeButton.classList.add('btn', 'btn--change');
    changeButton.setAttribute('id', 'btn-change');
    changeButton.textContent = 'Изменить';

    deleteButton.classList.add('btn', 'btn--delete');
    deleteButton.setAttribute('id', 'btn-delete');
    deleteButton.textContent = 'Удалить';

    //форма редактирования клиента
    changeButton.addEventListener('click', function () {
        for (let i = 0; i < listData.length; i++) {
            if (listData[i].id == item.id) {
                modal(
                    function (wrap, box, close) {
                        let form = document.createElement('form'),
                            formList = document.createElement('div'),
                            formWrapTitle = document.createElement('div'),
                            formTitle = document.createElement('h2'),
                            formSubTitle = document.createElement('span'),

                            formItemName = document.createElement('div'),
                            formLabelInputName = document.createElement('label'),
                            formInputName = document.createElement('input'),

                            formItemSurname = document.createElement('div'),
                            formLabelInputSurname = document.createElement('label'),
                            formInputSurname = document.createElement('input'),

                            formItemLastName = document.createElement('div'),
                            formLabelInputLastName = document.createElement('label'),
                            formInputLastName = document.createElement('input'),

                            formBtnSave = document.createElement('button'),
                            formBtnDel = document.createElement('button');

                        form.setAttribute('id', 'formChangeClient')
                        formList.classList.add('form__list')
                        formWrapTitle.classList.add('title-flex')
                        formTitle.textContent = 'Изменить данные'
                        formSubTitle.classList.add('sub-title')
                        formSubTitle.textContent = 'ID: ' + item.id

                        formItemName.classList.add('form__item')
                        formLabelInputName.classList.add('input__label')
                        formLabelInputName.textContent = 'Имя'
                        formInputName.classList.add('input__item')
                        formInputName.setAttribute('required', 'required')
                        formInputName.value = item.name

                        formItemSurname.classList.add('form__item')
                        formLabelInputSurname.classList.add('input__label')
                        formLabelInputSurname.textContent = 'Фамилия'
                        formInputSurname.classList.add('input__item')
                        formInputSurname.setAttribute('required', 'required')
                        formInputSurname.value = item.surname

                        formItemLastName.classList.add('form__item')
                        formLabelInputLastName.classList.add('input__label')
                        formLabelInputLastName.textContent = 'Отчество'
                        formInputLastName.classList.add('input__item')
                        formInputLastName.value = item.lastName

                        formBtnSave.classList.add('btn', 'btn--save')
                        formBtnSave.textContent = 'Сохранить'
                        formBtnDel.classList.add('btn', 'btn--cancel')
                        formBtnDel.textContent = 'Удалить клиента'

                        //сохранение изменений
                        formBtnSave.addEventListener('click', (e) => {
                            e.preventDefault();
                            let formInfo = document.querySelector('#formChangeClient');
                            console.log(formInfo)

                            let id = item.id;

                            if (validate(formInfo) == true) {

                                //объект нового клиента
                                let newClient = {
                                    name: firstUppercase(formInfo.elements[0].value),
                                    surname: firstUppercase(formInfo.elements[1].value),
                                    lastName: firstUppercase(formInfo.elements[2].value),
                                    contacts: [
                                    ]
                                };

                                //массив из всех блоков с select
                                let arrSelect = document.querySelectorAll('.select__wrap');
                                for (const contactItem of arrSelect) {
                                    newClient.contacts.push({
                                        type: contactItem.querySelector('select').value,
                                        value: contactItem.querySelector('input').value,
                                    })
                                }

                                wrap.remove()
                                changeClient(newClient, id).then(() => {
                                    getData().then((data) => {
                                        listData = data;
                                        console.log(listData);
                                        createCrmApp(listData);
                                    });
                                });
                            }

                        })

                        //удаление клиента
                        formBtnDel.addEventListener('click', (e) => {
                            e.preventDefault();
                            tr.remove();
                            if (listData[i].id == item.id) {
                                deleteClient(item.id).then(() => {
                                    getData().then((data) => {
                                        console.log(data);
                                        createCrmApp(data);
                                    });
                                });
                            }
                            wrap.remove()
                        });

                        console.log(item.contacts)

                        box.append(form)
                        form.append(formList)
                        formList.append(formWrapTitle)
                        formWrapTitle.append(formTitle)
                        formWrapTitle.append(formSubTitle)

                        formList.append(formItemName)
                        formItemName.append(formLabelInputName)
                        formItemName.append(formInputName)

                        formList.append(formItemSurname)
                        formItemSurname.append(formLabelInputSurname)
                        formItemSurname.append(formInputSurname)

                        createSelectBtn(form)

                        formList.append(formItemLastName)
                        formItemLastName.append(formLabelInputLastName)
                        formItemLastName.append(formInputLastName)
                        form.append(formBtnSave)
                        form.append(formBtnDel)
                    },
                    function (wrap) {
                        animateClose(wrap)
                    }
                )
            }
        }
        // объекты из массива контактов
        let boxItem = document.querySelector('.select__list')
        for (const contactItem of item.contacts) {
            createSelect(boxItem, contactItem)
        }
    });

    //форма удаления клиента
    deleteButton.addEventListener('click', function () {
        modal(
            function (wrap, box, closed) {
                let formDelWrap = document.createElement('div'),
                    title = document.createElement('h2'),
                    questionText = document.createElement('p'),
                    btnSave = document.createElement('button'),
                    btnCancel = document.createElement('button');

                formDelWrap.classList.add('form-del__wrap')
                title.classList.add('form-del__title')
                title.textContent = 'Удалить клиента'
                questionText.classList.add('form-del__question')
                questionText.textContent = 'Вы действительно хотите удалить данного клиента?'
                btnSave.classList.add('btn', 'btn--save')
                btnSave.textContent = 'Удалить'
                btnCancel.classList.add('btn', 'btn--cancel')
                btnCancel.textContent = 'Отмена'

                btnSave.addEventListener('click', (e) => {
                    e.preventDefault();
                    tr.remove();
                    for (let i = 0; i < listData.length; i++) {
                        if (listData[i].id == item.id) {

                            deleteClient(item.id).then(() => {
                                getData().then((data) => {
                                    console.log(data);
                                    createCrmApp(data);
                                });
                            });
                        }

                        wrap.remove();
                    }
                });

                btnCancel.addEventListener('click', (e) => {
                    animateClose(wrap)
                })

                box.append(formDelWrap)
                formDelWrap.append(title)
                formDelWrap.append(questionText)
                formDelWrap.append(btnSave)
                formDelWrap.append(btnCancel)
            },
            function (wrap) {
                animateClose(wrap)
            }
        )
    });

    tbody.append(tr);
    tr.append(idTD);
    tr.append(nameTD);

    tr.append(dateCreateTD);
    dateCreateTD.append(dateCreateDate);
    dateCreateTD.append(dateCreateTime);

    tr.append(lastChangeTD);
    lastChangeTD.append(lastChangeDate);
    lastChangeTD.append(lastChangeTime);

    tr.append(contactsTD);
    tr.append(actionsTD);
    actionsTD.append(changeButton);
    actionsTD.append(deleteButton);
};

//создаем tbody таблицы и заполняем его
function createTableBody(data) {
    let $tbody = document.createElement('tbody');

    $tbody.setAttribute('id', 'tableBody');
    for (const item of data) {
        createTR($tbody, item);
    };
    return $tbody;
};

//Создание блоков контактов
function createSelectBtn(item) {
    let $selectBox = document.createElement('div'),
        $selectItem = document.createElement('div'),
        $btn = document.createElement('button');

    $selectBox.classList.add('select__box');
    $selectItem.classList.add('select__list');
    $btn.classList.add('btn', 'btn--add-client');
    $btn.textContent = 'Добавить контакт';
    $btn.disabled = false;

    $btn.addEventListener('click', (e) => {
        e.preventDefault();
        createSelect($selectItem);
        // let array = selectItem.querySelectorAll('.select__wrap');
        // let newArr = Array.from(array)
        // console.log(newArr.length)
        // if (newArr.length >= 10) {
        //     btn.disabled = true
        //     btn.style.color = 'rgba(51, 51, 51, 0.3)'
        // }
    })

    item.append($selectBox);
    $selectBox.append($selectItem);
    $selectBox.append($btn);

};

function createSelect(itemList, contacts) {
    let $selectWrap = document.createElement('div'),
        $select = document.createElement('select'),
        $inputSelect = document.createElement('input'),
        $btnDelete = document.createElement('button');

    $selectWrap.classList.add('select__wrap');
    $select.classList.add('multi-select');
    $select.name = 'select';
    createOption($select, 'Телефон');
    createOption($select, 'Email');
    createOption($select, 'Facebook');
    createOption($select, 'VK');
    createOption($select, 'Другое');
    if (contacts) {
        $select.value = contacts.type;
        $inputSelect.value = contacts.value;
    };

    $inputSelect.classList.add('select__input');
    $inputSelect.setAttribute('required', 'required');
    $btnDelete.classList.add('btn', 'btn--del-select');

    $btnDelete.addEventListener('click', function () {
        $selectWrap.remove();
    })

    itemList.append($selectWrap);
    $selectWrap.append($select);
    $selectWrap.append($inputSelect);
    $selectWrap.append($btnDelete);
    multiSelect();
    //let array = itemList.querySelectorAll('.selectWrap');
};

function createOption(select, value) {
    const $option = document.createElement('option');

    $option.value = value;
    $option.textContent = value;

    select.append($option);
};

function createCrmApp(data, path = 'id', refresh = 0) {
    if (refresh == 0) {
        crmContainer.innerHTML = '';

        let $header = createHeader();
        let $tableWrap = document.createElement('div');
        let $title = document.createElement('h2');
        let $table = createTable();
        let $tableTH = createTableTH(path);
        let $btnAddClient = document.createElement('button');

        $tableWrap.classList.add('content');
        $title.textContent = 'Клиенты';
        $btnAddClient.setAttribute('id', 'btn-add');
        $btnAddClient.classList.add('btn', 'btn__add-client');
        $btnAddClient.textContent = 'Добавить клиента';

        crmContainer.append($header);
        crmContainer.append($tableWrap);
        $tableWrap.append($title);
        $tableWrap.append($table);
        $table.append($tableTH);
        crmContainer.append($btnAddClient);

        //форма создания нового клиента
        $btnAddClient.addEventListener('click', function () {
            modal(
                function (wrap, box) {
                    let $form = document.createElement('form'),
                        $formList = document.createElement('div'),
                        $formTitle = document.createElement('h2'),
                        $formInputList = document.createElement('div'),

                        $formItemName = document.createElement('div'),
                        $formInputName = document.createElement('input'),

                        $formItemSurname = document.createElement('div'),
                        $formInputSurname = document.createElement('input'),

                        $formItemLastName = document.createElement('div'),
                        $formInputLastName = document.createElement('input'),

                        $formBtnSave = document.createElement('button'),
                        $formBtnCancel = document.createElement('button');

                    $form.setAttribute('id', 'formAddNewClient');
                    $formList.classList.add('form__list');
                    $formTitle.classList.add('form__title');
                    $formTitle.textContent = 'Новый клиент';

                    $formInputList.classList.add('input__list');

                    $formItemSurname.classList.add('form__item');
                    $formInputSurname.classList.add('input__item');
                    $formInputSurname.setAttribute('placeholder', 'Фамилия*');
                    $formInputSurname.setAttribute('name', 'surname');
                    $formInputSurname.setAttribute('required', 'required');

                    $formItemName.classList.add('form__item');
                    $formInputName.classList.add('input__item');
                    $formInputName.setAttribute('name', 'name');
                    $formInputName.setAttribute('placeholder', 'Имя*');
                    $formInputName.setAttribute('required', 'required');

                    $formItemLastName.classList.add('form__item');
                    $formInputLastName.classList.add('input__item');
                    $formInputLastName.setAttribute('placeholder', 'Отчество');
                    $formInputLastName.setAttribute('name', 'lastName');


                    $formBtnSave.classList.add('btn', 'btn--save');
                    $formBtnSave.textContent = 'Сохранить';

                    $formBtnCancel.classList.add('btn', 'btn--cancel');
                    $formBtnCancel.textContent = 'Отмена';


                    $formBtnSave.addEventListener('click', (e) => {
                        e.preventDefault();
                        let formInfo = document.querySelector('#formAddNewClient');

                        if (validate(formInfo) == true) {
                            //объект нового клиента
                            let newClient = {
                                name: firstUppercase(formInfo.name.value),
                                surname: firstUppercase(formInfo.surname.value),
                                lastName: firstUppercase(formInfo.lastName.value),
                                contacts: [
                                ]
                            };

                            //массив из всех блоков с select
                            let arrSelect = document.querySelectorAll('.select__wrap');

                            for (const contactItem of arrSelect) {
                                newClient.contacts.push({
                                    type: contactItem.querySelector('select').value,
                                    value: contactItem.querySelector('input').value,
                                });
                            };

                            wrap.remove();
                            createClient(newClient).then(() => {
                                getData().then((data) => {
                                    console.log(data);
                                    listData = data;
                                    createCrmApp(listData);
                                });
                            });
                        }
                    });
                    $formBtnCancel.addEventListener('click', (e) => {
                        e.preventDefault();
                        animateClose(wrap);

                    });

                    box.append($form);
                    $form.append($formList);
                    $formList.append($formTitle);
                    $formList.append($formInputList);

                    $formInputList.append($formItemName);
                    $formItemName.append($formInputName);

                    $formInputList.append($formItemSurname);
                    $formItemSurname.append($formInputSurname);

                    $formInputList.append($formItemLastName);
                    $formItemLastName.append($formInputLastName);

                    createSelectBtn($form);
                    $form.append($formBtnSave);
                    $form.append($formBtnCancel);
                },
                function (wrap) {
                    animateClose(wrap);
                },
            );
        });

        const btnTR = document.querySelectorAll('.btn--th');
        for (let btnTRSelected of btnTR) {
            btnTRSelected.addEventListener('click', btnSort);
        };
    };

    let tbodyId = document.getElementById('tableBody');
    if (tbodyId !== null) {
        tbodyId.remove();
    }
    let $tbody = createTableBody(data);
    crmContainerTable = document.getElementById('sortTable');
    crmContainerTable.append($tbody);
}

// сортировка по нажатию на соответствующую кнопку в th
function btnSort(event) {
    let arrowFlip = event.currentTarget;
    let path = event.currentTarget.dataset.path;
    if (arrowFlip.classList.contains('btn--th-active')) {
        arrowFlip.classList.toggle('btn--th-active');
    }
    else {
        document.querySelectorAll('.btn--th').forEach(function (flip) {
            flip.classList.remove('btn--th-active');
        });
        arrowFlip.classList.add('btn--th-active')
    };
    sortName = path;
    sortDirection = !sortDirection;
    createCrmApp(sortClients(sortName, sortDirection, listData), path, 1);
}


let listData = await getData();
console.log(listData);

let body = document.querySelector('body');
let crmContainer = document.getElementById('crm__container');
crmContainer.classList.add('container');
let crmContainerTable = document.getElementById('sortTable');

let sortName = '';
let sortDirection = false;

createCrmApp(listData);


