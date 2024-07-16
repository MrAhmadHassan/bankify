
const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config.json")
const auth = require("../middlewares/auth");
const checkAdmin = require("../middlewares/admin");
const Account = require("../models/account");
const router = express.Router();


router.get("/me",auth, async (req,res)=>{
    const logginedUser = await User.findById(req.user._id);
    console.log(logginedUser);
    res.send(logginedUser);
})


router.post("/login",async (req,res)=>{
    const {email,password} = req.body;
    console.log("login");
    const user = await User.findOne({email});
      
    if(!user){
        return res.status(404).send("user not found")
    }
    bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
            // Handle error
            return res.send("something went wrong");
        }
    
    if (result) {
        const jwttoken = jwt.sign({_id:user._id,isAdmin:user.isAdmin},config.JWT_SECRET_KEY);
        // Passwords match, authentication successful
        res.send({message:'Passwords match! User authenticated.',
            token:jwttoken
        });
    } else {
        // Passwords don't match, authentication failed
        res.send({message:'Passwords do not match! Authentication failed.'});
    }
    });
    
})

router.post("/register",async (req,res)=>{
        const {name,email,password,isAdmin} = req.body;
    try{
        let user = await User.findOne({email});
        if (user) return res.status(400).send("User already got registered.");
        user = new User(req.body);
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, async function(err, hash) {
                user.password = hash;
                await user.save().then(()=>{   
                   const acct=new Account();
                   acct.balance = 0;
                   acct.user = user._id;
                   const resultac = acct.save();
                   if(resultac){
                    console.log("account created");
                   }              
                const jwttoken = jwt.sign({_id:user._id, isAdmin:isAdmin},config.JWT_SECRET_KEY);
                res.header("x-auth-token",jwttoken).status(200).send({message:"User created successfully",user})
                }).catch(exc=> res.send({message:exc.message}));
            });
        }); 
        
    } catch(exc){
        res.status(500).send({
            message:exc.message
        })
    }
})

router.get("/",async (req,res)=>{
    const page = req.query.p || 0;
    const usersperpage = 3;
    const users = await User.find().skip(page*usersperpage).limit(usersperpage).populate();
    if(users){
        res.json({
            users
        })
    }
});

router.delete("/delete/:id",[auth,checkAdmin], async (req, res) => {
    const uid = req.params.id;

    try {
        // Delete user by ID
        const deletedUser = await User.findByIdAndDelete(uid);

        if (!deletedUser) {
            return res.status(404).send({ message: "User not found" });
        }

        // Find associated account and log balance
        const accdb = await Account.findOne({ user: uid });

        if (accdb) {
            console.log("User ID:", uid);
            console.log("Account balance:", accdb.id);
            Account.findByIdAndDelete(accdb.id).then(()=>{
                console.log("deletd");
            }).catch(exc=>console.log(exc.message));
        // Send success response
            res.send({ message: "User and associated account deleted successfully" });
        } else {
            console.log("No account found for User ID:", uid);
            
        // Send success response
        res.send({ message: "No account found for User ID:" });
        }

    } catch (error) {
        // Handle errors
        console.error("Error deleting user:", error);
        res.status(500).send({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    const uid = req.params.id;
    const userbalance = req.body.balance;
        // Delete user by ID
        const finduser = await User.findById(uid);

        if (!finduser) {
            return res.status(404).send({ message: "User not found" });
        }

        // Find associated account and log balance
        const accdb = await Account.findOne({ user: uid });

        if (accdb) {
            console.log("User ID:", uid);
            console.log("Account balance:", accdb.id);
            accdb.balance += userbalance;
            accdb.save()
            .then(()=>{
                res.send({message:"amount deposited successfully"})
            })
            .catch((err)=>{
                res.send(err.message);
            })
        }else{
            res.send({message:"No account exists"});
        }
    });  

    router.put("/:fid/:tid", async (req, res) => {
        const fid = req.params.fid;
        const tid = req.params.tid;
        const transactionAmount = req.body.balance;
            // Delete user by ID
            const fuser = await User.findById(fid);
    
            if (!fuser) {
                return res.status(404).send({ message: "User not found" });
            }
            const tuser = await User.findById(tid);

            if (!tuser) {
                return res.status(404).send({ message: "User not found" });
            }
            // Find associated account and log balance
            const faccdb = await Account.findOne({ user: fid });
            const taccdb = await Account.findOne({user:tid})
            if (faccdb && taccdb) {
                if (faccdb.balance<=0) {
                    return res.send({message:"Insufficient balance"});
                }
                faccdb.balance -= transactionAmount;
                taccdb.balance +=transactionAmount
                faccdb.save();
                taccdb.save();
                res.send({message:"transaction done successfully"})
                
            }else{
                res.send({message:"No account exists"});
            }
        });  
    



module.exports = router;