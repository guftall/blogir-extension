chrome.contextMenus.removeAll(function(){
    chrome.contextMenus.create({
        id: 'showPersistedPosts',
        title: "پست های ذخیره شده",
        contexts: ['all']
    })
})
chrome.contextMenus.onClicked.addListener(function (info, tab) {

    if (info.menuItemId == 'showPersistedPosts') {
        showPosts(tab)
    }
})

function showPosts(tab) {
    chrome.tabs.sendMessage(tab.id, {
        modal: true
    })
}

new Config(true, config => {

    setInterval(() => {
        console.log('interval')
        console.log(config)
    }, config.interval_sec * 1000)
})