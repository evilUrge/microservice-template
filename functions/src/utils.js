module.exports = {
    bucketReader:
        (bucketName = 'cdn.yadati.co.il', ls = false, srcFilename = false) =>
            ls
                ? storage.bucket(bucketName).getFiles({prefix: ls})
                    .then((list) => [...new Set(list[0].map((x) => x.name.split('/')[1]))])
                    .catch((err) => false)

                : storage.bucket(bucketName).file(srcFilename).download()
                    .then((data) =>
                        JSON.parse(data[0].toString()))
                    .catch((err) => false),
    db:
        (collection = undefined, document = undefined,
         write = undefined, update = undefined) => {
            const firestore = require('./firebase').admin.firestore()
            return document ? firestore.doc(document) : firestore.collection(collection)
                [write ? 'add' : update ? 'update' : 'get'](write || update)
                .then(((doc) => write || update ? doc.id : doc))
                .catch(((error) => console.error(error)))
        }
}