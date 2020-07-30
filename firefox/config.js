/*!
 * blogir-extension
 * Copyright(c) 2020 Omid Dehghani
 * MIT Licensed
 */

class Config {

    constructor(loadConfig = true, cb = null) {

        if (loadConfig) {
            Config.loadConfig().then(() => {
                if (cb && typeof cb === 'function') {
                    cb(Config.config)
                }
            })
        }
    }

    static editPage() {
        let url = location.href
        let _editPage = url.indexOf('post_edit') != -1

        return _editPage
    }

    static defaultOptions() {
        return {
            'interval_sec': 5,
            'persist_days': 1,
            'persist_color': 'rgb(86, 192, 255)',
            'unsaved_color': 'rgb(255, 155, 244)',
            'persist_text': 'دائمی',
            'unsaved_text': 'موقت',
            'text_color': 'rgb(53, 53, 53)'
        }
    }

    static loadConfig() {
        let defaultOptions = Config.defaultOptions()

        return new Promise((resolve, reject) => {
            chrome.storage.local.get(defaultOptions, items => {
                Config.config = items
                resolve(items)
            })
        })
    }

    static async setOptions(options) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set(options, items => {
                resolve(items)
            })
        })
    }
}