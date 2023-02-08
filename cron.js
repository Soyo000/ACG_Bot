const cron = require('node-cron');

//定时任务
cron.schedule("* 18 * * *", () => {
    console.log('run every minute');
})