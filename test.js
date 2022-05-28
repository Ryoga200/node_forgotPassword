const sendmail = require('sendmail')();

sendmail({
    from: '',//メールアドレスを入力
    to: '',//メールアドレスを入力
    subject: 'メールのタイトルです',
    text: 'メールの本文です。この例はテキストです。html形式でもOK。',
  }, function(err, reply) {
    console.log(err && err.stack);
    console.dir(reply);
});