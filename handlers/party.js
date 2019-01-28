const db = require('../models');

exports.getParties = function(req, res){
  db.Party.find()
    .then(parties => res.json(parties))
    .catch(err => res.send(err))
}

exports.createParty = function(req, res){
  db.Party.create(req.body)
    .then(newParty => res.status(201).json(newParty))
    .catch(err => res.send(err))
}

exports.getParty = function(req, res){
  db.Party.findById(req.params.partyId)
    .then(foundParty => res.json(foundParty))
    .catch(err => res.send(err))
}

exports.updateParty = function(req, res){
  db.Party.findOneAndUpdate({_id:req.params.partyId}, req.body, {new: true})
    .then(party => res.json(party))
    .catch(err => res.send(err))
}

exports.deleteParty = function(req, res){
  db.Party.deleteOne({_id:req.params.partyId})
    .then(() => res.json({message:"Deleted Party"}))
    .catch(err => res.send(err))
}

exports.joinParty = async function(req, res, next){
  try {
    const {partyId, id} = req.params
    const party = await db.Party.findById(partyId)
    const user = await db.User.findById(id)
    if(user.party && user.party._id.toString()===partyId) {
      return next({
        status: 403,
        message: "You're already in this party!"
      })
    } else if (party.joinType === 'open') {
      // take the user out of the old party
      user.party && await db.Party.findByIdAndUpdate(user.party,{$pull :{members: user._id}})
      await user.update({$set: {party:partyId}})
      await party.update({$push: {members:id}})
      const message = "You've successfully joined " + party.name
      const response = { user, party, message}
      res.status(200).json(response)
    } else if (party.joinType === 'approval') {
      // TODO: handle this functionality later. Would require some type of CMS
      // Unreachable without Admin Tools
      await party.update({$push: {approvalList:id}})
      const message = "You'on the approval list for " + party.name
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