const db = require('../models');

exports.getParties = function(req, res){
  db.Party.find()
    .then(parties => {
      res.json(parties)
    })
    .catch(err => {
      res.send(err)
    })
}

exports.createParty = function(req, res){
  db.Party.create(req.body)
    .then(newParty => {
      res.status(201).json(newParty);
    })
    .catch(err => {
      res.send(err);
    })
}

exports.getParty = function(req, res){
  db.Party.findById(req.params.partyId)
    .then(foundParty => {
      res.json(foundParty)
    })
    .catch(err => {
      res.send(err);
    })
}

exports.updateParty = function(req, res){
  db.Party.findOneAndUpdate({_id:req.params.partyId}, req.body, {new: true})
    .then(party => {
      res.json(party)
    })
    .catch(err => {
      res.send(err);
    })
}

exports.deleteParty = function(req, res){
  db.Party.remove({_id:req.params.partyId})
    .then(() => {
      res.json({message:"Deleted Party"})
    })
    .catch(err => {
      res.send(err);
    })
}

exports.joinParty = function(req, res){
  res.json({message:"Join Party route"})
}

exports.leaveParty = function(req, res){
  res.json({message:"Leave Party route"})
}

module.exports = exports;