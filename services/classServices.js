const Class = require('../models/class');

exports.addClass = async function(obj) {
  const ins = await Class.create(obj);
  return ins.toJSON()
}

exports.deleteClass = async function(id) {
  return await Class.destroy({
    where: {
      id: id
    }
  })
}

exports.getClassById = async function(id) {
  const result = await Class.findByPk(id)
  if(result) {
    return result.toJSON()
  }
  return null
}

exports.getClasses = async function() {
  const result = await Class.findAll()
  return JSON.parse(JSON.stringify(result))
}
