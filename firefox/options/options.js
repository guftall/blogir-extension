/*!
 * blogir-extension
 * Copyright(c) 2020 Omid Dehghani
 * MIT Licensed
 */

document.addEventListener('DOMContentLoaded', loadOptions);
let intervalSec, persistDays;

function saveOptions(e) {
    e.preventDefault()

    let newConfig = {
        'interval_sec': intervalSec.value,
        'persist_days': persistDays.value
    }

    Config.setOptions(newConfig).then(() => {
        showMessage('ذخیره شد')
        chrome.extension.getBackgroundPage().window.location.reload()
    })
}

function loadOptions() {
    document.querySelector('form').addEventListener('submit', saveOptions)

    intervalSec = document.querySelector('#intervalSec')
    persistDays = document.querySelector('#persistDays')

    new Config(true, config => {

        intervalSec.value = config.interval_sec
        persistDays.value = config.persist_days
    })
}

function showMessage(msg) {
    let message = document.querySelector('#message');
    message.innerText = msg;
    message.style.display = 'block';
    setTimeout(function () {
        message.style.display = 'none';
    }, 3000);
}
