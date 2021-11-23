const express = require('express')
var cors = require('cors')
const app = express()
const request = require('request');
const fs = require('fs');
const schedule = require('node-schedule');
let num = 10;
let spec = `*/${num} * * * *`

const job = schedule.scheduleJob(spec, function() {
  (async () => {
    let date = new Date();
    console.log(spec);
    let filename = "4L-" + date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + "-" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + ".jpeg";
        const data = await download('http://172.24.1.2:8080/stream/snapshot.jpeg?delay_s=0', `/photos/${filename}`);
})();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.get('/interval', (req,res) => {
  res.status(200).json(num);
})

app.post('/interval', (req,res) => {
  console.log(req.query.num);
  if (parseInt(req.query.num) < 60 && parseInt(req.query.num) >= 1 ) {
    num = parseInt(req.query.num)
    spec = `*/${num} * * * *`
    job.reschedule(spec)
    res.status(200).send("OK");
  }
  else {
    res.status(400).send('La valeur rentrée doit etre comprise entre 1 et 59 minutes');
  }
  
})


app.get('/photos', async (req,res) => {
    let date = new Date();
    let filename = "4L-" + date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + "-" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + ".jpeg";
    
        const data = await download('http://172.24.1.2:8080/stream/snapshot.jpeg?delay_s=0', `/photos/${filename}`);
  
    res.status(200).send("OK")
})


app.get('/liste_auto_photos', async (req,res) => {


  res.status(200).send("OK")
})



app.listen(8080, () => {
    console.log("Serveur à l'écoute")
  })


  async function download(url, dest) {

    /* Create an empty file where we can save data */
    const file = fs.createWriteStream(dest);

    /* Using Promises so that we can use the ASYNC AWAIT syntax */
    await new Promise((resolve, reject) => {
      request({
        /* Here you should specify the exact link to the file you are trying to download */
        uri: url,
        gzip: true,
      })
          .pipe(file)
          .on('finish', async () => {
            console.log(`Une photo à été prise !`);
            resolve();
          })
          .on('error', (error) => {
            reject(error);
          });
    })
        .catch((error) => {
          console.log(`Aie une erreur est survenue ! : ${error}`);
        });
}


