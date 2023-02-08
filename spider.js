const puppeteer = require('puppeteer');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const fileName = path.resolve(__dirname,'data.json')

//获取作品总数
async function getAsoulVideoNum() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.78');
    await page.goto('https://www.douyin.com/user/MS4wLjABAAAAflgvVQ5O1K4RfgUu3k0A2erAZSK7RsdiqPAvxcObn93x2vk4SKk1eUb6l_D4MX-n',{ waitUntil: "load", timeout: 60000 });
  // 用js获取节点
    const getNum = page.evaluate(() => {
        const textDom = document.getElementsByClassName('J6IbfgzH')[0];
        return textDom.innerText;
    });
    let num = getNum;
    await browser.close();
    return num;
}

//获取作品页面链接
async function getVideoHref(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.78');
    await page.goto('https://www.douyin.com/user/MS4wLjABAAAAflgvVQ5O1K4RfgUu3k0A2erAZSK7RsdiqPAvxcObn93x2vk4SKk1eUb6l_D4MX-n',{ waitUntil: "load", timeout: 60000 });
    
    //模拟页面下拉
    // (async function f(){
    //     await page.evaluate(() => {
    //         window.scrollBy(0, window.innerHeight);
    //     });
    // })();

    const getAllVideo = await page.evaluate(() => {
        const liDomArray = document.querySelectorAll('li');
        let array = new Array();
        liDomArray.forEach(element => {
            if(element.firstElementChild!=null){
            let href = element.firstElementChild.getAttribute('href');
            array.push(href);
            }
        });
        array = array.filter(e => e!=null);
        for(let i = 0, len = array.length;i<len;i++){
            array[i] = 'https://www.douyin.com' + array[i];
        }
        return array;
    });
    let array = getAllVideo;
    await browser.close();
    return array;
}

//下载指定视频
async function getVideo(url){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url,{ waitUntil: "load", timeout: 90000 });

    let url2 = await page.evaluate(() => {
        let url3 = document.querySelector('video').firstElementChild.getAttribute('src');
        url3 = "https:" + url3;
        return url3;
    })
    // console.log(url2);
    await browser.close();
}

//main函数，如果有更新就更新，并return true;没有更新就return false
async function main(){
    let oldnum = 0;
    fs.readFile('./data.json', (err,data) => {
        if(err){
            console.log(err);
            return err;
        }
        oldnum = JSON.parse(data)["num"];
    });
    let num = await getAsoulVideoNum();
    //如果数据没有发生更新就直接退出
    if(num<=oldnum){
        console.log(`num = ${oldnum}, nothing changed`);
        return false;
    }
    // console.log(num);
    const browser = await puppeteer.launch();
    page = await browser.newPage();
    let array = await getVideoHref();
    let str = "";
    for(let i = 0,len = array.length;i<len;i++){
        if(i!=len-1)
        str = str + `"${array[i]}",`
        else
        str = str + `"${array[i]}"`
    }
    let jsonString = `{"num":${num},"array":[${str}]}`;

    fs.writeFile(fileName,jsonString,{flag:'w'},(error) => {
        if(error) console.log(error);
    })

    let now = new Date();
    console.log(now);

    await browser.close();
    return true;
}

//定时任务
// let getdata = cron.schedule("* 19 * * *", () => {
//     main();
// })

module.exports = main;



