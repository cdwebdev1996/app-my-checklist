var express = require('express');
var router = express.Router();
var db = require('../database/db.config');


//GET
router.get('/getAll', (req, res) => {
  const payload = req.query;
  console.log('/getAll', payload);
  const sqlCommand = "SELECT * FROM `checklist` WHERE isCompleted = 0 AND isArchived = 0 ORDER BY priority ASC";
  db.query(sqlCommand, (err, result) => {
    if(err) {
      console.log('ERROR: ', err);
      throw err;
    };
      console.log('Response: ', result);
      res.send(result);
    });
});

// CREATE
router.post('/add', (req, res) => {
  const payload = req.body;
  console.log('/add', payload);
  const sqlCommand = `INSERT INTO checklist (priority, name, remarks, backgroundColor, tags) VALUES (${payload.priority}, '${payload.name}', '${payload.remarks}', '${payload.backgroundColor}', '${payload.tags}');`;
  db.query(sqlCommand, (err, result) => {
    if(err) throw err;
    console.log('Response: ', result);
    res.send(result);
  });
});

// UPDATE
router.patch('/update', (req, res) => {
  const payload = req.body;
  const id = req.body.id;
  console.log('/update', payload);

  const sqlCommand = 'UPDATE `checklist` SET ? WHERE id = ?';
  console.log('id', id);
  db.query(sqlCommand, [payload, id], (err, result) => {
    if(err) throw err;
    console.log('Result', result);
    console.log('sqlCommand', sqlCommand);
    res.send(result);
  });

});

// DELETE (SOFT)
router.patch('/delete', (req, res) => {
  const id = req.query.id;
  // console.log('/delete', payload);

  const sqlCommand = `UPDATE checklist SET isCompleted=1 WHERE ID=${id}`;
  db.query(sqlCommand, (err, result) => {
    if(err) throw err;
    res.send(result);
  });

});

module.exports = router;