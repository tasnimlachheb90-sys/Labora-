const test=require("express")
const app=test()
const port=3000

const cookiesparser=require('cookies-parser')
require('dotenv').config()
app.use(cookiesparser())
async function testConnection(){
    try{
        await db.authenticate()
        console.log('Connection has been established successfully.');
    }catch(err){
        console.log("error connection database :",err.message)
    }
}

//  async function createtable(){
// await user.sync()
// }
try{
testConnection()
}catch(err){
    console.logt(err.message)
}






app.listen(port,()=>{
    console.log("this server is runnning ")
})





