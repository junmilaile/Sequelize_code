const Admin = require("../models/Admin")
const md5 = require("md5")
const validate = require("validate.js")

exports.addAdmin = async function (adminObj) {

 await validate.async(adminObj, {
  loginId: {
    presence: {
      allowEmpty: false
    },
    type: "string"
  },
  loginPwd: {
    presence: {
      allowEmpty: false
    },
    type: "string"
  },
  name: {
    presence: {
      allowEmpty: false
    },
    type: "string"
  }
 })

  adminObj.loginPwd = md5(adminObj.loginPwd)
  const ins =  await Admin.create(adminObj)
  return ins.toJSON()
}

exports.deleteAdmin = async function(adminId) {
//  const ins =  await Admin.findByPk(adminId)
// //  console.log(ins);
// if(ins) {
//   await ins.destroy()
// }

//方式二
Admin.destroy({
  where: {
    id: adminId
  }
})
}

exports.updateAdmin = async function(id,adminObj) {
  // 方式一
  // 1.得到实例
  // const ins = await Admin.findByPk(id)
  // ins.loginId = adminObj.loginId
  // // 2. 保存
  // ins.save()

  // 方式二
  await Admin.update(adminObj, {
    where: {
      id: id
    }
  })
}

exports.login = async function(loginId, loginPwd) {
    loginPwd = md5(loginPwd)
    const result = await Admin.findOne({
      where: {
        loginId,
        loginPwd
      }
    })
   
    if(result && result.loginId === loginId) {
      const resultAll =  result.toJSON()
      delete resultAll.loginPwd
      return resultAll
    }
    return null
}

exports.getAdminById = async function(id) {
  const result = await Admin.findByPk(id);
  if (result) {
    return result.toJSON();
  }
  return null;
}

exports.getAdmins = async function () {
  const result = await Admin.findAll();
  return JSON.parse(JSON.stringify(result));
};