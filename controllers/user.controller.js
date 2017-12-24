/**
 * Created by sazack on 8/11/17.
 */
'use strict';
//************************************************************************
// USE COLLECT LIBRARY in lib folder to collect DATA from the request body
//************************************************************************
let collect = require('../lib/collect');
let User = require('../models/user.model');

module.exports = {

    //*********************************************************************
    //SAMPLE FUNCTION TO COLLECT DATA AND STORE IN VARIABLE
    //*********************************************************************
    collectForUsers: (req, res, next) => {
        let collectInstance = new collect();
        collectInstance.setBody([
            'firstName',
            'middleName',
            'lastName',
            'city',
            'state',
            'country',
            'email',
            'username',
            'password',
            'passwordSalt',
            'phone',
            'deleted',
            'userRole'

        ])
        collectInstance.setFiles(['image'])

        collectInstance.setMandatoryFields({
            firstName: 'First Name not provided',
            lastName: 'Last Name not provided',
            email: 'Email not provided',
            username: 'Username not provided',
            password: 'Password not provided',
            city: 'City not provided',
            country: 'Country not provided',
            phone: 'Phone not provided'

        })
        collectInstance.collect(req).then((data) => {
            req.userData = data
            next();
        }).catch((err) => {
            err.status = 400
            next(err)
        })
    },
    create: (req, res, next) => {
	// console.log(req.body);
	let newUser = new User(req.userData)
	newUser.save((err,data) => {
	    if(err){
	    	console.log(err);
		next(err);
	    }
	    else if(data){
		req.cdata = {
		    success: 1,
		    message: "User added successfully"
		}
		next()
	    }
	})
    },
    get: (req, res, next) => {
	// console.log(req.query);
	var query = req.query;
	query.deleted = false;
	User.find(query,(err, user) => {
	    if(err){
		console.log(err);
		next(err);
	    }
	    // console.log(user);
	    req.cdata = {
		"success":1,
		"message":"User returned successfully",
		"data": user
	    };
	    next();
	})
    },
    getbyId: (req, res, next) => {
	var query = {_id:req.params.id}
	query.deleted = false;
	// console.log(query);
	User.find(query,(err, user) => {
	    if(err){
		console.log(err);
		next(err);
	    }
	    // console.log(user);
	    req.cdata = {
		"success":1,
		"message":"User returned successfully",
		"data": user
	    };
	    next()
	})
    },
    update: (req, res, next) => {
	if(req.body.id){
	    User.findOneAndUpdate({_id:req.body.id},
				  {firstName:req.body.firstName},
				  {upsert:true},
				  (err,data) => {
		if(err){
		    console.log(err)
		    return next(new Error("error occurred while updating data"))
		}
		else if (data){
		    // console.log(data);
		    req.cdata = {
			"success":1,
			"message":"User updated successfully"
		    };
		    next()
		}
	    })
	}
    },
    remove: (req, res, next) => {
	// console.log(req);
	if(req.query.id){
	    User.findOneAndUpdate({_id:req.query.id},
				  {deleted:true},
				  (err,data) => {
		if(err){
		    console.log(err)
		    return next(new Error("error occurred while deleting data"))
		}
		else if (data){
		    console.log(data)
		    req.cdata = {
			"success":1,
			"message":"User deleted successfully"
		    };
		    next()
		}
				  });
	}
    }
}

