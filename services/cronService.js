`use strict`;

const cronJob = require(`cron`).CronJob;

class CronService {

    constructor(){
        this.initCron = this.initCron.bind(this);
        this.startCron = this.startCron.bind(this);
    }

    initCron(value) {
        console.log(value);
        return new cronJob(value, function() {
            console.log(`Cron has been started... `);
        }, null, false);
    }

    startCron(value) {

        value = value || `*/1 * * * * *`;
        let cronJob = this.initCron(value);
        cronJob.start();
    }
}

module.exports = new CronService();



