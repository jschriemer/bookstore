const express = require('express');
const connect = require('./connection')
const redis = require("redis")

const app = express();
const port = 8000

app.get('/basket/getBasket/:uuid', (req, res) => {
    connect.createConnection().then(client => {
       client.hgetall(req.params.uuid, (err, results) => {
            if(results){
                res.json({basket:JSON.parse(results.basket)})
            }else{
                res.send(err)
            }
       })
      client.quit((err, reply) => {
            if(!err){
                console.log(reply)
             }else{
                 console.log(err)
            }
      })
     })
 });

app.post('/basket/addItem',jsonParser, (req, res) => {
    connect.createConnection().then(client => {
       //Use variables for readability 
       const basket = JSON.stringify(req.body.basket)
       const uuid = req.body.uuid
       client.hset(uuid, "basket", basket, redis.print)
       client.hgetall(uuid, (err, results) => {
          if(results){
             res.send(results)
          }else{
            res.send(err)
         }
 })
  client.quit((err, reply) => {
        if(!err){
           console.log(reply)
         }else{
          console.log(err)
         }
     })
   })
 })

app.listen(port, () => {
    console.log('App listening on port ' + port);
});