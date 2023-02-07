const { createClient, Platform } = require("oicq")
const account = 2441288014
const group1 = 519700368
const group2 = 700458704
const client = createClient(account)
const acg = require('./ac_automation');
const superagent = require('superagent')

// let list = ["嘉然","向晚","乃琳","贝拉","珈乐","asoul","a手",
//           "嘉心糖","顶碗人","奶淇琳","黄嘉琪","音乐珈","一个魂"];


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


let list = ["嘉然","向晚","乃琳","贝拉","珈乐","asoul","a手",
          "嘉心糖","顶碗人","奶淇琳","黄嘉琪","音乐珈","一个魂"];

client.on("message.group", (event) => {
  if(event.group_id === group2||event.group_id === group1){
    let msg = event.message[0].text;
    let result = acg.acSearch(list,msg);
    // console.log(result)
    if(result.length!=0){
      event.reply("acg",false);
    }
  }
});

//设置心跳间隔(单位/秒)
client.interval = 60;
//设置心跳函数
client.heartbeat = () =>{
  // console.log('run every minute');
  // let url = "https://www.douyin.com/user/MS4wLjABAAAAflgvVQ5O1K4RfgUu3k0A2erAZSK7RsdiqPAvxcObn93x2vk4SKk1eUb6l_D4MX-n";
  // superagent.get(url, (err,res) => {
  // })
};