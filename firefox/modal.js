/*!
 * blogir-extension
 * Copyright(c) 2020 Omid Dehghani
 * MIT Licensed
 */

class Modal {
    constructor() {
        this.persister = new Persister()
    }
    async build() {
        this.element = document.createElement('div')
        document.body.appendChild(this.element)

        this.shadow = this.element.attachShadow({ mode: 'open' })

        return fetch(chrome.runtime.getURL('content/modal.html'))
            .then(res => res.text())
            .then(html => {
                this.shadow.innerHTML = html

                let cssURL = chrome.runtime.getURL('content/modal.css')
                this.shadow.querySelector('.modal').insertAdjacentHTML(
                    "beforebegin",
                    "<link rel='stylesheet' href='" + cssURL + "' />"
                )

                this.shadow.querySelector('.close').onclick = () => this.destroy()

                let modal = this.shadow.querySelector('.modal')
                modal.onclick = event => {
                    if (event.target == modal) {
                        this.destroy()
                    }
                }

                let that = this
                window.addEventListener('_custom_remove_post__', function (e) {
                    try {

                        let index = e.detail.index
                        console.log('removing post index ', index)
                        that.persister.removePost(index)
                        that._appendPosts()
                    } catch(err) {
                        console.log(err)
                    }
                })

                this._appendPosts()

                return true
            })
    }
    _appendPosts() {

        let modalBody = this.shadow.querySelector('.modal-body')
        modalBody.innerHTML = ''
        this.persister.allPosts(posts => {

            const now = new Date()
            for (let i = 0; i < posts.length; i++) {

                let text = posts[i].text

                let expireAt = Math.ceil(Math.abs(posts[i].expireAt - now) / (1000 * 60 * 60))

                let div = document.createElement('div')
                div.classList.add('text-elem')
                div.innerHTML = `<p>
                <span class="_ind">${i}.</span>
                <span class="_del_date">حدود ${expireAt} ساعت دیگر</span>
                <span class="_del_btn" onclick="window.dispatchEvent(new CustomEvent('_custom_remove_post__', {detail: {index: ${i}}}))">حذف:</span>
                <br />
                ${text}</p>`
                modalBody.appendChild(div)
            }

        })
    }

    show() {
        this.shadow.querySelector('.modal').style.display = 'block'
    }
    hide() {
        this.shadow.querySelector(".modal").style.display = 'none'
    }
    destroy() {
        this.element.remove()
    }
}