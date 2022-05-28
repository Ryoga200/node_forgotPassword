var express = require('express');
var router = express.Router();
const sendmail = require('sendmail')();
var send_em = require('./index/send_email');
const bodyParser = require('body-parser');
const http = require('http');
const mysql = require('mysql2');
const fs = require('fs');
const ejs = require('ejs');
var crypto = require("crypto");
const NodeRSA = require('node-rsa');
const { stringify } = require('querystring');
const key = new NodeRSA({b: 512});
//const NodeMailer = require('nodemailer')
const app = express()
app.set('ejs',ejs.renderFile);
app.use(express.static('views'))
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', //この部分は秘密です
  database: 'forgotten'
});
connection.connect();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index/index', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
  res.render('index/login',{data:0});
});
router.post('/login', async function(req, res, next) {
  
  password=req.body.password;
  email=req.body.email;
  console.log(email);
  if(email!=''){
  async function bring_ps (email) {
    // `var ret`は不要

    // `new Promise`の前に`await`を付けることで、`Promise`の解決を待つ
    const data = await new Promise((resolve, reject) => {
        connection.query('select * FROM Users WHERE email = ?; ',email,
            (error, results, fields) => {
                resolve({
                    error: error,
                    results: results,
                    fields: fields
                });             
            }
        ); 
});
return data.results[0];
   };
   user= await bring_ps(email);
   console.log(email);
   if(password==user.password){
    res.render('index/success',{data:user});
   }
   else{
     login_error='error'
  res.render('index/login',{data:login_error});
   }}
   else{
    login_error='error'
    res.render('index/login',{data:login_error});
   }
});
router.get('/forgotten', function(req, res, next) {
  res.render('index/forgotten');
});
router.get('/signup', function(req, res, next) {
  res.render('index/signup');
});
router.post('/forgotten', async function(req, res, next) {
  email=req.body.email;
  async function bring_id (email) {
    // `var ret`は不要

    // `new Promise`の前に`await`を付けることで、`Promise`の解決を待つ
    const data = await new Promise((resolve, reject) => {
        connection.query('select * FROM Users WHERE email = ?; ',email,
            (error, results, fields) => {
                resolve({
                    error: error,
                    results: results,
                    fields: fields
                });
                
            }
        ); 
});
return data.results[0];
   };
account = await bring_id(email);
console.log(account);
  //send_email.main(email);
  console.log(email);
   let text=account.id;

   console.log(typeof(text));
    
    const encrypted = key.encrypt(text, 'base64');
    console.log('encrypted: ', encrypted);
    let password = encrypted.replace(/\//g,'*');
    console.log("aaaaaaaa"+text+password); 
    connection.query('insert into Passwords(user_id,password) values (?,?);',[text,password], function (error, results, fields) {
      if (error) throw error;
      console.log(results);
      console.log(results);  
  });
 
    console.log("aaa"+text);
    text = 'このURLから再登録をしてください\n/auth/forgotten/'+password+'/'+text;
    console.log(text);
    subject="パスワードを忘れの確認について"
  send_em(email,subject,text);
  res.render('index/done');
});
router.post('/signup',  async (req, res,next) => {
  email=req.body.email;
  connection.query('insert into Users (email) values (?); ',email, function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    console.log(results);
  
    
});
  async function bring_id (email) {
    // `var ret`は不要

    // `new Promise`の前に`await`を付けることで、`Promise`の解決を待つ
    const data = await new Promise((resolve, reject) => {
        connection.query('select * FROM Users WHERE email = ?; ',email,
            (error, results, fields) => {
                resolve({
                    error: error,
                    results: results,
                    fields: fields
                });
                
            }
        ); 
});
return data.results[0];
   };
account = await bring_id(email);
console.log(account);
  //send_email.main(email);
  console.log(email);
   let text=account.id;

   console.log(typeof(text));
    
    const encrypted = key.encrypt(text, 'base64');
    console.log('encrypted: ', encrypted);
    let password = encrypted.replace(/\//g,'*');
    console.log("aaaaaaaa"+text+password); 
    connection.query('insert into Passwords(user_id,password) values (?,?);',[text,password], function (error, results, fields) {
      if (error) throw error;
      console.log(results);
      console.log(results);  
  });
 
    console.log("aaa"+text);
    text = 'このURLから本登録をしてください\n/auth/register/'+password+'/'+text;
    console.log(text);
    subject="会員登録ありがとうございます。"
  send_em(email,subject,text);
  res.render('index/done');
});
router.get('/auth/register/:pass/:id',  async (req, res,next) => {
  let id=req.params.id;
  let password = req.params.pass;
  
  async function bring_ps (id) {
    const data = await new Promise((resolve, reject) => {
        connection.query('select * FROM Passwords WHERE user_id = ?; ',id,
            (error, results, fields) => {
                resolve({
                    error: error,
                    results: results,
                    fields: fields
                });
                
            }
        );
      });
return data.results[0];
   };
   auth_pass= await bring_ps(id);
   console.log(auth_pass+"auth");
   console.log(password+"pass");
  if(auth_pass.password!=password){
    res.redirect('/');
  }
  async function bring_usr (id) {
    const data = await new Promise((resolve, reject) => {
        connection.query('select * FROM Users WHERE id = ?; ',id,
            (error, results, fields) => {
                resolve({
                    error: error,
                    results: results,
                    fields: fields
                });
                
            }
        );
      });
return data.results[0];
   };
    
  user_data= await bring_usr(id);
   
    res.render('index/register',{data:user_data});
    
});
router.post('/register',async (req, res,next) => {
  console.log("aaa");
  up_data=req.body
  birthday=String(up_data.year)+'-'+String(up_data.month)+'-'+String(up_data.day);
  connection.query('update Users set name=? , password=? , gender=? , birthday = ?, validatedAt = CURRENT_TIMESTAMP() ,updatedAt = CURRENT_TIMESTAMP() where id = ?; ',[up_data.name,up_data.password,up_data.gender,birthday,up_data.id], function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    console.log(results);   
  });
  connection.query('DELETE FROM Passwords WHERE user_id = ?;',up_data.id, function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    console.log(results);   
  });
  res.redirect('/login');
});
router.get('/auth/forgotten/:pass/:id',  async (req, res,next) => {
  let id=req.params.id;
  let password = req.params.pass;
  async function bring_ps (id) {
    const data = await new Promise((resolve, reject) => {
        connection.query('select * FROM Passwords WHERE user_id = ?; ',id,
            (error, results, fields) => {
                resolve({
                    error: error,
                    results: results,
                    fields: fields
                });
                
            }
        );
      });
return data.results[0];
   };
   auth_pass= await bring_ps(id);
  if(auth_pass.password!=password){
    res.redirect('/');
  }
  async function bring_user (id) {
    // `var ret`は不要

    // `new Promise`の前に`await`を付けることで、`Promise`の解決を待つ
    const data = await new Promise((resolve, reject) => {
        connection.query('select * FROM Users WHERE id = ?; ',id,
            (error, results, fields) => {
                resolve({
                    error: error,
                    results: results,
                    fsields: fields
                });
                
            }
        );
      });
return data.results[0];
   };
    
  user_data= await bring_user(id);

  res.render('index/password_forgotten',{data:user_data});
});
router.post('/password_reset',async (req, res,next) => {
  console.log("aaa");
  email=req.body.email
  password=req.body.password
  async function bring_user (email) {
    // `var ret`は不要

    // `new Promise`の前に`await`を付けることで、`Promise`の解決を待つ
    const data = await new Promise((resolve, reject) => {
        connection.query('select * FROM Users WHERE email = ?; ',email,
            (error, results, fields) => {
                resolve({
                    error: error,
                    results: results,
                    fsields: fields
                });
                
            }
        );
      });
return data.results[0];
   };
    
  user_data= await bring_user(email);
  console.log(user_data.email);
  connection.query('update Users set  password=?  ,updatedAt = CURRENT_TIMESTAMP() where id = ?; ',[password,user_data.id], function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    console.log(results);   
  });
  connection.query('DELETE FROM Passwords WHERE user_id = ?;',user_data.id, function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    console.log(results);   
  });
  res.redirect('/login');
});
module.exports = router;
