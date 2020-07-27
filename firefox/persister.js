class Persister {
    allPosts() {

        var savedJson = localStorage.getItem('bir_pp')

        if (savedJson == undefined) {
            return ['پستی وجود ندارد']
        }

        let posts = JSON.parse(savedJson)

        let res = []
        const now = new Date().getTime()
        for (let post of posts) {

            if (post.expireAt > now) {
                res.push(post.text)
            }
        }

        return res
    }
}

class Post {
    constructor() {
        this.expireAt = new Date().getTime()
        this.text = 'I am a new post'
    }
}