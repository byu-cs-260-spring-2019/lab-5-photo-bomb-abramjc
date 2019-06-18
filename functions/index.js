const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');

const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);

const app = express();

var db = firebase.firestore();

app.get('/api/users/', async function(req, res) {
    try{
        let querySnapshot = await itemsRef.get();
        res.send(querySnapshot.docs.map(doc => doc.data()));
    }catch(err){
        res.sendStatus(500);
    }
});

app.post('/api/users/', async function(req, res) {
    try {
        let querySnapshot = await itemsRef.get();
        let numRecords = querySnapshot.docs.length;
        let item = {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            id: req.body.id,
        };

        itemsRef.doc(item.id.toString()).set(item);
        res.send(item);
      } catch (error) {
        console.log(error);
        res.sendStatus(500);
      }
});

app.delete('/api/users/:email', async function(req, res)  {
    try {
        let itemToDelete = itemsRef.doc(req.params.id.toString());

        let item = await itemToDelete.get();

        if (!item.exists) {
            res.status(404).send("Sorry, that item does not exist");
            return;
        }

        itemToDelete.delete();
        res.sendStatus(200);
        return;
    }
    catch(error) {
        console.log(error);
    }
});

app.put('/api/users/:email', async function(req, res)  {
    try {
        let itemToEdit = itemsRef.doc(req.params.id.toString());

        item = await itemToEdit.get();

        if (!item.exists) {
            res.status(404).send("Sorry, that item does not exist");
        }

        itemToEdit.update({
            title: req.body.title,
            description: req.body.description,
        });

        res.sendStatus(200);
        return;
    }
    catch (error) {
        console.log(error);
    }
});

exports.app = functions.https.onRequest(app);
