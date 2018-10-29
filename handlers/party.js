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
  db.Party.deleteOne({_id:req.params.partyId})
    .then(() => {
      res.json({message:"Deleted Party"})
    })
    .catch(err => {
      res.send(err);
    })
}

exports.joinParty = async function(req, res, next){
  try {
    const party = await db.Party.findById(req.params.partyId)
    const user = await db.User.findById(req.params.id)
    if (party.joinType === 'open') {
      if(user.party){
        if(user.party._id.toString()===req.params.partyId){
          return next({
            status: 403,
            message: "You're already in this party!"
          })
        } else {
          await db.Party.findByIdAndUpdate(user.party,{$pull :{members: user._id}})
        }
      }
      user.party = req.params.partyId
      party.members.push(req.params.id)
      const message = "You've successfully joined " + party.name
      await user.save()
      await party.save()
      const response = { user, party, message}
      res.status(200).json(response)
    } else if (party.joinType === 'approval') {
      // TODO: handle this functionality later. Would require some type of CMS
      party.approvalList.push(req.params.id)
      const message = "You'on the approval list for " + party.name
      await user.save()
      await party.save()
      const response = { user, party, message}
      res.status(200).json(response)
    } else if (party.joinType === 'closed') {
      return next({
        status: 403,
        message: "This Party is not accepting new members"
      })
    } else {
      return next({
        status: 403,
        message: "Error joining party"
      })
    }
    // fallback
    await user.save()
    await party.save()
    const response = { user, party, message}
    res.status(200).json(response)
  } catch (err){
    return next(err)
  }
}

exports.leaveParty = async function(req, res){
  try {
    let user = await db.User.findByIdAndUpdate(req.params.id, {party:null})
    await db.Party.findByIdAndUpdate(req.params.partyId, {$pull :{members: user._id}})
    res.status(200).json("You have left this party")
  } catch (err){
    res.send(err)
  }
}

module.exports = exports;