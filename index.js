require("./init")
const stuServ = require("./services/studentService")

stuServ.addStudent({
    name: "李四",
    birthday: "2010-10-25",
    sex: true,
    mobile: "17674235613",
    ClassId: 5,
    deletedAt: "2010-1-1",
})
.catch((err) => {
  console.log(err);
})