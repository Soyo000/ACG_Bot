const { createClient } = require("oicq")
// const account = 111
// const group = 111
const client = createClient(account)
const acg = require('./ac_automation');

let list = ["嘉然","向晚","乃琳","贝拉","珈乐","asoul","a手",
          "嘉心糖","顶碗人","奶淇琳","黄嘉琪","音乐珈","一个魂"];


client.on("system.login.qrcode", function (e) {
    //扫码后按回车登录
    process.stdin.once("data", () => {
      this.login()
    })
  }).login()

client.on("system.online", () => console.log("Logged in!"))

// client.on("message", e => {
//   console.log(e)
//   e.reply("hello world",false) //true表示引用对方的消息
// })

client.on("message.group", (event) => {
  if(event.group_id === group){
    let msg = event.message[0].text;
    let result = acg.acSearch(list,msg);
    if(result.length!=0){
      event.reply("acg",false);
    }
  }
});
