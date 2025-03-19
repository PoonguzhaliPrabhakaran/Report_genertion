const express = require('express')
const sql = require('mssql')
const env = require('./env');
const cors = require('cors');
app.use(cors());

const  app= express();
const port = env.port || 3000

const config =
{
    user:env.db_user,
    password:env.db_password,
    server:env.db_server,
    database:env.db_database,
    options:{
        encrypt:false,
        //trustservercertificate:true
    }
};

sql.connect(config) .then(()=>console.log('connected to sql server'))
.catch(err=>console.log('DB connection Error:',err));



app.get('/reports',async(req,res)=>{
debugger;
    const{fromDate,toDate} = req.query;
    if(!fromDate || !toDate)
    {
        return res.status(400).json ({error:'Both from date and to date are required'});
      
    }
    try{

        const request = new sql.Request();
        request.input('FDT', sql.VarChar(10), fromDate);  // Passing fromdate
        request.input('TDT', sql.VarChar(10), toDate);    // Passing todate
        const result = await request.execute('IT_ADVANCE_SUMMARY_DETAILS_DATERANGE'); // Call stored procedure
      
        res.json({
            table1: result.recordsets[0],  // First table
            table2: result.recordsets[1]   // Second table
          });

    } catch(error)
    {
        console.error('Database error:',error);
        res.status(500).json({error:'Internal server Error'});
    }



});














app.listen(port,() =>{
    console.log(`server is running in the port ${port}`);
});