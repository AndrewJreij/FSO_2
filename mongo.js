const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.ulhx4mv.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const numberSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Number = mongoose.model('Number', numberSchema)

if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]

    const newNumber = new Number({
        name: name,
        number: number,
    })

    newNumber.save().then(result => {
        console.log('number saved!')
        mongoose.connection.close()
    })

} else if (process.argv.length === 3) {
    Number.find({}).then(result => {
        result.forEach(number => {
            console.log(`${number.name} ${number.number}`)
        })

        mongoose.connection.close()
    })
}



// Note.find({}).then(result => {
//     result.forEach(note => {
//         console.log(note)
//     })
//     mongoose.connection.close()
// })

// Note.find({ important: true }).then(result => {
//     result.forEach(note => {
//         console.log(note)
//     })
//     mongoose.connection.close()
// })