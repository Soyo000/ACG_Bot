const cron = require('node-cron');

//定时任务
cron.schedule("* * * * *", () => {
    console.log('run every minute');
})