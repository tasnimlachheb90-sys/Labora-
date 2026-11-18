const {Sequelize} = require("sequelize");
const db=new Sequelize(
    {
        database: "labora",
        username: "root",
        password: "",
        dialect: "mysql",
        host:"127.0.0.1",
        port: 3306,
    }

)
module.exports=db

