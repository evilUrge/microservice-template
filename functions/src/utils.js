const firebase = require('./firebase').admin

module.exports = {
    bucketReader:
        (bucketName = 'cdn.yadati.co.il', ls = false, srcFilename = false) =>
            ls
                ? firebase.storage.bucket(bucketName).getFiles({prefix: ls})
                    .then((list) => [...new Set(list[0].map((x) => x.name.split('/')[1]))])
                    .catch((err) => console.error(err.message))

                : firebase.storage.bucket(bucketName).file(srcFilename).download()
                    .then((data) =>
                        JSON.parse(data[0].toString()))
                    .catch((err) => console.error(err.message)),
    db:
        (collection = undefined, document = undefined,
         write = undefined, update = undefined) => {
            const firestore = firebase.firestore()
            return document ? firestore.doc(document) : firestore.collection(collection)
                [write ? 'add' : update ? 'update' : 'get'](write || update)
                .then(((doc) => write || update ? doc.id : doc))
                .catch(((error) => console.error(error.message)))
        },
    objectify:
        /**
         * Cast Arrays of objects into one object with predefined keys
         * @param arrayToObj [{key: value}, {key: value}]
         * @param key string - key to use as the main obj key
         * @returns JSON({key:{key: value}, key2:{key2: value2}})
         */
            (arrayToObj, key) => {
            let finalObj = {}
            arrayToObj.forEach(item => Object.assign(finalObj, {[item[key]]: item}))
            return finalObj
        }
}