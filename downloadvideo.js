const puppeteer = require('puppeteer');
const axios = require('axios')
const fs = require('fs');
// const { start } = require('repl');

//从视频页面获取下载链接
async function getVideo(url){
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    await page.goto(url,{ waitUntil: "load", timeout: 90000 });

    let url2 = await page.evaluate(() => {
        const url3 = document.querySelector('video').firstElementChild.getAttribute('src');
        return url3;
    })
    // await page.screenshot({path: 'screenshot.png'});
    await browser.close();//注意顺序，return后浏览器就关闭不了了
    return "https:"+url2;
}

//从下载链接(url)下载视频
async function downloadVideo(url,path){
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
      });

      response.data.pipe(fs.createWriteStream(path));

      return new Promise((resolve, reject) => {
        response.data.on('end', () => {
          resolve();
        });
    
        response.data.on('error', (err) => {
          reject(err);
        });
      });
}

// let url = "";

async function main(){
  let url = "";
  //fs是异步函数，不能保证使用数据时数据已被赋值，需要用Promise或async/await处理

  //test1
  // fs.readFile('./data.json', (err,data) => {
  //   if(err) throw err;
  //   let filedata = JSON.parse(data);
  //   let array = filedata["array"];
  //   array.sort();
  //   url2 = url2 + array.pop();
  //   console.log("test1"+url2)
  // });

  //test2
  // const readFilePromise = new Promise((resolve, reject) => {
  //   fs.readFile('./data.json', (err, data) => {
  //     if (err) reject(err);
  //     resolve(data);
  //   });
  // });

  // readFilePromise
  // .then(data => {
  //   let filedata = JSON.parse(data);
  //   let array = filedata["array"];
  //   array.sort();
  //   url = array.pop();
  //   // console.log("test1" + url);
  // })
  // .catch(err => {
  //   console.error(err);
  // });

  //test3
  try {
    const data = await new Promise((resolve, reject) => {
      fs.readFile('./data.json', (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });

    let filedata = JSON.parse(data);
    let array = filedata["array"];
    array.sort();
    url = array.pop();
    // console.log("test1" + url);
  } catch (err) {
    console.error(err);
  }

  // console.log("test2"+url);

  url = await getVideo(url);
  let date = new Date();
  let dateStr = date.toISOString();

  dateStr = dateStr.substring(0,10);

  await downloadVideo(url, `./video${dateStr}.mp4`)
    .then(() => console.log('Video downloaded successfully.'))
    .catch((err) => console.error(err));
  return dateStr;
}

module.exports = main;


// main();

// fs.readFile('./data.json', (err,data) => {
//     if(err) throw err;
//     let filedata = JSON.parse(data);
//     let array = filedata["array"];
//     array.sort();
//     let url = array.pop();
//     console.log(url);
    // console.log(array)
    
    // for (let i = 0,len = 2;i<len;i++){
    //     (async () => {
    //         const href = array[i];
    //         let link = await getVideo(href);
            
    //         // console.log(link);
    //         downloadVideo(link, `./video${i}.mp4`)
    //         .then(() => console.log('Video downloaded successfully.'))
    //         .catch((err) => console.error(err));
    //     })();
    // }
// })



// (async () => {
//     const href = "https://www.douyin.com/video/7185382178316881211";
//     let link2 = await getVideo(href);
    
//     console.log(link2);
//     downloadVideo(link2, './video.mp4')
//   .then(() => console.log('Video downloaded successfully.'))
//   .catch((err) => console.error(err));
// })();

