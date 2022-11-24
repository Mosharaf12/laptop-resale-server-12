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
    app.get('/usedLaptop',async(req,res)=>{
      const query= {}
      const result = await usedLaptopsCollection.find(query).toArray()
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