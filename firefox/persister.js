/*!
 * blogir-extension
 * Copyright(c) 2020 Omid Dehghani
 * MIT Licensed
 */

class Persister {
    constructor() {

        this.postStruct = {
            posts: []
        }
        this.defaultExpireDurationMs = 1 * 24 * 60 * 60 * 1000
        const that = this
        this._loadFromStorage(() => {
            that._removeExpiredPosts()
        })
        Config.loadConfig().then(config => {
            that.defaultExpireDurationMs = config.persist_days * 24 * 60 * 60 * 1000
        })
    }
    addPost(text) {

        let post = new Post()
        post.text = text
        this._setPostExpireAt(post)
        this.postStruct.posts.push(post)
        this._persistPosts().then(() => { })

        let postIndex = this.postStruct.posts.length - 1
        return postIndex
    }
    updatePost(index, text) {
        if (index >= this.postStruct.posts.length) {
            throw new Error('invalid post index: ' + index)
        }
        let post = this.postStruct.posts[index]

        post.text = text
        this._setPostExpireAt(post)
        this._persistPosts().then(() => { })
    }
    allPosts(cb) {

        if (cb == undefined) {
            return
        }

        let that = this
        this._loadFromStorage(() => {

            cb(that.postStruct.posts)
        })
    }
    removePost(index) {
        if (index >= this.postStruct.posts.length) {
            throw new Error('invalid post index: ' + index)
        }

        this.postStruct.posts.splice(index, 1)
        this._persistPosts()
    }

    _loadFromStorage(cb) {

        let that = this
        chrome.storage.local.get(['bir_pp'], savedJson => {

            if (savedJson == undefined || savedJson.bir_pp == undefined) {
                that.postStruct = {
                    posts: []
                }
            } else {

                that.postStruct = savedJson.bir_pp
            }

            if (cb != undefined) {

                cb()
            }
        })
    }
    _removeExpiredPosts() {
        const now = new Date().getTime()
        const posts = this.postStruct.posts
        const removeIndexes = []
        for (let i = posts.length - 1; i >= 0; i--) {

            if (posts[i].expireAt < now) {
                removeIndexes.push(i)
            }
        }

        removeIndexes.sort((a, b) => a > b)

        while (removeIndexes.length > 0) {
            posts.splice(removeIndexes.pop(), 1)
        }

        this._persistPosts().then(() => { })
    }
    _persistPosts() {

        return new Promise((resolve, reject) => {

            chrome.storage.local.set(
                {
                    'bir_pp': this.postStruct
                },
                items => resolve(items))
        })
    }
    _setPostExpireAt(post) {

        post.expireAt = new Date().getTime() + this.defaultExpireDurationMs
    }
}

class Post {
    constructor() {
        this.expireAt = new Date().getTime()
        this.text = 'I am a new post'
    }
}