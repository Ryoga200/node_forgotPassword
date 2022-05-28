const send_mail = require('sendmail')();
console.log("aha");
module.exports = function (email,subject,text){
  console.log("aho");
  console.log("aaa"+text);
send_mail({
  from: '',//メールアドレスを入力
  to: email,
  subject: subject,
  text: text,
}, function(err, reply) {
  console.log(err && err.stack);
  console.dir(reply);
})
};
//exports.sendemail = sendemail;