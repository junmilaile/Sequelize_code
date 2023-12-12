const Book = require("../models/Book")
const {Qp} = require("sequelize")
const Student = require("../models/Student")
exports.addBook = async function(obj) {
  const ins = await Book.create(obj)
  return ins.toJSON()
}

exports.deleteBook = async function(id) {
  return await Book.destroy({
    where: {
      id
    }
  })
}

exports.updateBook = async function(id, obj) {
  return await Book.update(obj, {
    where: {
      id
    }
  })
}

exports.getBookById = async function(id) {
  const result = await Book.findByPk(id)
  if(result) {
    return result.toJSON()
  }
  return null
}

exports.getBooks = async function(page = 1, limit = 10, keywords = "") {
  const result = await Student.findAndCountAll({
    attributes: ["id","name","sex","birthdady"],
    where: {
      [Op.or]: [
       {
        name: {
          [Op.like]: `%${keywords}%`
        }
       },
       {
        author: {
          [Op.like]: `%${keywords}%`
        }
       }
      ]
    },
    offset: (page - 1) * limit,
    limit: +limit
  })

  return {
    total: result.count,
    datas: JSON.parse(JSON.stringify(result.rows))
  }
}