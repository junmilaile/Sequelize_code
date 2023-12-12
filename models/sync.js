// 同步所有模型
require('./Admin')
require('./Class')
require('./Book')
require('./Student')

const sequelize = require('./db')

async function init() {
  await sequelize.sync({ alter: true })
  console.log('所有模型同步完成')
}

init()
