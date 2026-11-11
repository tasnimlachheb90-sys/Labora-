const {Sequelize} = require("sequelize");
const db=new Sequelize(
    {
        database: "labora",
        username: "root",
        password: "",
        dialect: "mysql",
        host: "localhost",
        port: 3306,
    }

)
module.exports=db
