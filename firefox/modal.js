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

                let modalBody = this.shadow.querySelector('.modal-body')
                let posts = this.persister.allPosts()

                for (let post of posts) {

                    let elem = document.createElement('div')
                    elem.style.width = '100%'
                    elem.style.height = '50px'
                    elem.style.backgroundColor = 'red'
                    elem.innerHTML = '<p>' + post + '</p>'
                    modalBody.appendChild(elem)
                }

                return true
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