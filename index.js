const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000

// midleware 

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uujg3og.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    const usedLaptopsCollection = client.db('laptopResaleMarket').collection('usedLaptop')
    const usersCollection = client.db('laptopResaleMarket').collection('users')

    app.get('/usedLaptop',async(req,res)=>{
      const query= {}
      const result = await usedLaptopsCollection.find(query).toArray()
      res.send(result)
    })
    
    app.get('/usedLaptop/:categorey',async(req,res)=>{
        const categorey = req.params.categorey;
        const query = {categorey: (categorey)}
        const result = await usedLaptopsCollection.find(query).toArray()
        console.log(result);
        res.send(result)
    })

    app.post('/users',async(req,res)=>{
      const user = req.body;
      const result = await usersCollection.insertOne(user)
      res.send(result)

    })

  }
  finally{

  }

}
run().catch(err=>console.error(err))



app.get('/', (req, res) => {
  res.send('resale market server is running')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})