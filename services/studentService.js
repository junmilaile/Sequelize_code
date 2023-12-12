const Student = require('../models/Student');
const {Op } = require("sequelize")
const Class = require("../models/Class")
const validate = require("validate.js")
const moment = require("moment")
const { pick } = require("../util/propertyHelper")

exports.addStudent = async function(stuObj) {
  stuObj = pick(stuObj, "name","birthday", "sex", "mobile", "ClassId")
  // console.log(stuObj);
  validate.validators.classExits = async function(value) {
    const c = await Class.findByPk(value)
    if(c) {
      return
    }
    return "is not exist"
  }

  const rule = {
    //验证规则
    name: {
      presence: {
        allowEmpty: false,
      },
      type: "string",
      length: {
        minimum: 1,
        maximum: 10,
      }
    },
    birthday: {
      presence: {
        allowEmpty: false
      },
      datetime: {
        dateOnly: true,
        earliest: +moment.utc().subtract(100, "y"),
        latest: +moment.utc().subtract(5, "y"),
      }
    },
    sex: {
      presence: true,
      type: "boolean",
    },
    mobile: {
      presence: {
        allowEmpty: false
      },
      format: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/
    },
    ClassId: {
      presence: true,
      numericality: {
        onlyInteger: true,
        strict: false
      },
      classExits: true 
    }
  }
  
  await validate.async(stuObj, rule)
  const ins = await Student.create(stuObj);
  return ins.toJSON()
}


exports.deleteClass = async function(id) {
  return await Student.destroy({
    where: {
      id: id
    }
  })
}

exports.updateStudent = async function (id, obj) {
  return await Student.update(obj, {
    where: {
      id,
    },
  });
};

exports.getClassById = async function(id) {
  const result = await Student.findByPk(id)
  if(result) {
    return result.toJSON()
  }
  return null
}

exports.getStudents = async function(
  page = 1,
  limit = 10,
  sex = -1,
  name = ""
) {
  const where = {};
  if (sex !== -1) {
    where.sex = !!sex;
  }
  if (name) {
    where.name = {
      [Op.like]: `%${name}%`,
    };
  }

  const result = await Student.findAndCountAll({
    attributes: ["id", "name", "sex", "birthday"],
    where,
    include: [Class],
    offset: (page - 1) * limit,
    limit: +limit,
  });
  return {
    total: result.count,
    datas: JSON.parse(JSON.stringify(result.rows)),
  };
}