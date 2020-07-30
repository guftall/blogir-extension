/*!
 * blogir-extension
 * Copyright(c) 2020 Omid Dehghani
 * MIT Licensed
 */

document.addEventListener('DOMContentLoaded', loadOptions);
let intervalSec, persistDays
    , persistColor, unsavedColor, persistText, unsavedText, textColor;
let oldConfig;
function saveOptions(e) {
    e.preventDefault()

    let newConfig = {
        'interval_sec': intervalSec.value,
        'persist_days': persistDays.value,
        'persist_color': persistColor.value || oldConfig['persist_color'],
        'unsaved_color': unsavedColor.value || oldConfig['unsaved_color'],
        'persist_text': persistText.value || oldConfig['persist_text'],
        'unsaved_text': unsavedText.value || oldConfig['unsaved_text'],
        'text_color': textColor.value || oldConfig['text_color']
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
    persistColor = document.querySelector('#persistColor')
    unsavedColor = document.querySelector('#unsavedColor')
    persistText = document.querySelector('#persistText')
    unsavedText = document.querySelector('#unsavedText')
    textColor = document.querySelector('#textColor')

    new Config(true, config => {

        intervalSec.value = config['interval_sec']
        persistDays.value = config['persist_days']
        persistColor.value = config['persist_color']
        unsavedColor.value = config['unsaved_color']
        persistText.value = config['persist_text']
        unsavedText.value = config['unsaved_text']
        textColor.value = config['text_color']
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
