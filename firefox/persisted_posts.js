chrome.runtime.onMessage.addListener(function (msg, sender, callback) {
    if (msg.modal) {
        showModal()
    }
})

function showModal() {
    let modal = new Modal()

    modal.build().then(() => {
        modal.show()
    })
}