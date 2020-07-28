/*!
 * blogir-extension
 * Copyright(c) 2020 Omid Dehghani
 * MIT Licensed
 */

chrome.contextMenus.removeAll(function () {
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
    if (tab.url.indexOf('blog.ir/panel') == -1) {
        return
    }
    chrome.tabs.sendMessage(tab.id, {
        modal: true
    })
}
