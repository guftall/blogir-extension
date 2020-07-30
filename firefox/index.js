/*!
 * blogir-extension
 * Copyright(c) 2020 Omid Dehghani
 * MIT Licensed
 */

function initialize() {
    if (!Config.editPage()) {
        return
    }

    let topButtons = document.querySelector('.topbuttons')

    let span = document.createElement('span')
    span.id = 'custom_auto_save'
    span.style.padding = '5px'
    span.style.borderRadius = '4px'
    span.style.display = 'none'

    var persistColor = ''
    var unsavedColor = ''
    var persistText = ''
    var unsavedText = ''

    let input = document.createElement('input')
    input.style.border = '1px solid rgba(76, 77, 85, 0.55)'
    input.style.backgroundColor = persistColor
    input.style.width = '66px'
    input.style.textAlign = 'center'
    input.style.direction = 'rtl'
    input.style.opacity = '.7'
    input.type = 'text'
    input.disabled = true

    span.appendChild(input)
    topButtons.prepend(span)

    let textUpdated = false;
    let lastCheckDate = new Date()

    const DelayMillisecond = 1500

    let cachedText = ''

    const persister = new Persister()

    new Config(true, config => {

        let durationSec = 5 // config.interval_sec

        persistColor = config['persist_color']
        unsavedColor = config['unsaved_color']
        persistText = config['persist_text']
        unsavedText = config['unsaved_text']

        input.style.color = config['text_color']

        startCheckInterval()
        startPersisterInterval(durationSec)
    })

    function startCheckInterval() {
        setInterval(() => {

            try {

                if (cachedText == '') {
                    cachedText = loadText()
                }

                let newText = loadText()

                let _textUpdated = cachedText != newText

                if (_textUpdated) {
                    showUnsaved()
                    lastCheckDate = new Date()
                    cachedText = newText
                    textUpdated = true
                }
            } catch (err) {
                console.log(err)
            }
        }, 1500)
    }

    function startPersisterInterval(durationSec) {

        let postIndex = undefined
        setInterval(() => {

            try {

                let differenceMs = new Date() - lastCheckDate
                if (differenceMs <= DelayMillisecond)
                    return

                if (textUpdated) {
                    if (postIndex == undefined) {

                        postIndex = persister.addPost(cachedText)
                    } else {
                        persister.updatePost(postIndex, cachedText)
                    }

                    textUpdated = false
                    showSaved()
                }
            } catch (err) {
                console.log(err)
            }

        }, durationSec * 1000)
    }

    function showUnsaved() {
        setContainerColor(unsavedColor)
        updateAutosaveContainer(unsavedText)
    }

    function showSaved() {
        setContainerColor(persistColor)
        updateAutosaveContainer(persistText)
    }

    function setContainerColor(color) {
        input.style.backgroundColor = color
    }

    function updateAutosaveContainer(txt) {
        span.style.display = 'inline'
        input.value = txt
    }
}

function loadText() {
    var actualCode = `prepareToSave()`;

    var script = document.createElement('script')
    script.textContent = actualCode;
    (document.head || document.documentElement).appendChild(script)
    script.remove()

    try {

        let text = $('#post_add_form').serialize()
        let params = new URLSearchParams(text)
        return params.get("content")
    } catch (err) {
        console.log(err)
        throw err
    }
}

try {

    initialize()
} catch (err) {
    console.log(err)
}
