const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
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
    const bookingsCollection = client.db('laptopResaleMarket').collection('bookings')

    app.get('/usedLaptop',async(req,res)=>{
      const query= {}
      const result = await usedLaptopsCollection.find(query).toArray()
      res.send(result)
    })
    app.post('/usedLaptop',async(req,res)=>{
      const product = req.body
      const result = await usedLaptopsCollection.insertOne(product)
      res.send(result)
    })
    
    app.get('/usedLaptop/:categorey',async(req,res)=>{
        const categorey = req.params.categorey;
        const query = {categorey: (categorey)}
        const result = await usedLaptopsCollection.find(query).toArray()
        res.send(result)
    })

    app.put('/usedLaptop', async(req, res) => {
      const id = req.query.id;
      const filter = {_id: ObjectId(id)};
      const options = {upsert: true};
      const updatedDoc = {
      $set: {
        report: true
      }
    }
    const result = await usedLaptopsCollection.updateOne(filter, updatedDoc, options)
    res.send(result)
  });

  app.get('/allReported', async(req, res) => {
    const report = req.query.report;
    const query = {report: true};
    const result = await usedLaptopsCollection.find(query).toArray();
    res.send(result)
})
    //  find the seller product 

    app.get('/myproduct',async(req,res)=>{
        const email = req.query.email;
        const query = {useremail: (email)}
        const result = await usedLaptopsCollection.find(query).toArray()
        res.send(result)
    })

    app.delete('/myproduct',async(req,res)=>{
      const id = req.query.id;
      const query = {_id: ObjectId(id)}
      const result = await usedLaptopsCollection.deleteOne(query)
      console.log(result);
      res.send(result)
    })

    app.post('/users',async(req,res)=>{
      const user = req.body;
      const result = await usersCollection.insertOne(user)
      res.send(result)
    })
    app.get('/users', async(req,res)=>{
      const query = {}
      const result = await usersCollection.find(query).toArray()
      res.send(result)
    })
    app.put('/users',async(req, res)=>{
      const id = req.query.id;
      const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updatedDoc = {
            $set: {
              verified: true
            }
          }
          const result = await usersCollection.updateOne(filter, updatedDoc, options)
          res.send(result)

    })

    app.get('/users/:email', async(req, res)=> {
      const email = req.params.email;
      const query = {email: email};
      const result = await usersCollection.find(query).toArray();
      res.send(email);
    
  });

  app.delete('/users', async(req,res)=>{
    const id = req.query.id;
    const query = {_id: ObjectId(id)}
    const result = await usersCollection.deleteOne(query)
    res.send(result);
  })

  //get admin route 
  app.get('/users/admin/:email',async(req,res)=>{
    const email = req.params.email;
    const query = {email}
    const user = await usersCollection.findOne(query)
    res.send({isAdmin: user?.role === 'admin'});
})
app.get('/users/seller/:email', async(req, res) => {
  const email = req.params.email;
  const query =  { email };
  const user = await usersCollection.findOne(query);
  res.send({isSeller: user?.role === 'seller'})
});

app.get('/laptop/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      const result = await usedLaptopsCollection.findOne(query)
      res.send(result)
    })
    // add booking product 
app.post('/booking',async(req,res)=>{
      const booking = req.body;
      const result = await bookingsCollection.insertOne(booking)
      res.send(result);
    })
    app.get('/booking',async(req,res)=>{
      const email = req.query.email;
      const query = {email: (email)}
      const bookings = await bookingsCollection.find(query).toArray()
      res.send(bookings);

    })

    app.put('/myproduct', async(req, res) => {
      const id = req.query.id;
      const filter = {_id: ObjectId(id)};
      const options = {upsert: true};
      const updatedDoc = {
      $set: {
        advertising: true
      }
    }
    const result = await usedLaptopsCollection.updateOne(filter, updatedDoc, options)
    res.send(result)
  })
//filter items for advertising 

  app.get('/advertisingProduct', async(req, res) => {
      const query = {};
      const phones = await usedLaptopsCollection.find(query).toArray();
      const advertising = phones.filter(ph => ph.advertising === true) 
      res.send(advertising)
  });

   app.delete('/booking', async(req, res) => {
            const id = req.query.id;
            const query = {_id: ObjectId(id)};
            const result = await bookingsCollection.deleteOne(query);
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