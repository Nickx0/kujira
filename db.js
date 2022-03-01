const mysql = require("mysql")
const database = require('./config.json').database;
let connection = mysql.createConnection({
    host: database.host,
    user: database.username,
    password: database.password,
    database: database.name,
    port: database.port
});



connection.connect(function (err, db) {
    if(!!err){
        console.log("Error")
    }else{
        console.log("Connect")
    }
});
connection.query("SELECT * FROM vtuberlist",function (err,row,fields) {
    if(!!err){
        console.log("Error in consulte")
    }else{
        console.log("Connect Successfully")
        console.log(row)
    }
})
module.exports = connection

module.exports = (connection) => {
    try {
        function row (){
            
        }
    } catch (err) {

    }
}