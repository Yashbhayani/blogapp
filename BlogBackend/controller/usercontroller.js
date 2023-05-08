const { request } = require('express');

const User = require('../model/user')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const JWT_SCERET = 'Yashisagoodboy';
let success = false;
const d = new Date();

module.exports.register = async (req, res) => {

    try {

        let Userdata = await User.findOne({ Email: req.body.Email });
        if (Userdata) {
            success = false;
            return res.status(200).json({ error: "Sorry a user with email alredy exists.", success });
        }

        Userdata = await User.findOne({ Mobile: req.body.MobileNumber });
        if (Userdata) {
            success = false;
            return res.status(200).json({ error: "Sorry a user with mobile number alredy exists.", success });
        }

        const secPass = await bcrypt.hash(req.body.Password, 10);

        let todayDate = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();

        Userdata = await User.create({
            surname: req.body.Surname,
            Firstname: req.body.FirstName,
            Lastname: req.body.LastName,
            Email: req.body.Email,
            Mobile: req.body.MobileNumber,
            Birthdate: req.body.Birthdate,
            Password: secPass,
            Gender: req.body.Gender,
            BlogPost: 0,
            Date: todayDate,
            Startyear: d.getFullYear(),
            Startmonth: Number(d.getMonth() + 1),
       });

        const data = {
            user: {
                id: Userdata.id,
                surname: Userdata.surname,
                Firstname: Userdata.Firstname,
                Lastname: Userdata.Lastname,
                Birthdate: Userdata.Birthdate,
                Email: Userdata.Email,
                Mobile: Userdata.Mobile,
                BlogPost: Userdata.BlogPost,
            }
        }
        success = true;
        const authToken = jwt.sign(data, JWT_SCERET);
        return res.status(200).json({ success, authToken, OTP });
    } catch (e) {
        return res.status(200).json({ error: e, success });
    }
}


module.exports.login = async (req, res) => {

    success = false;
    try {
        let Userdata = await User.findOne({ Email: req.body.email });
        if (!Userdata) {
            success = false;
            return res.status(404).send({ errors: "Your Account is Not Found", success })
        }

        const passeordcompare = await bcrypt.compare(req.body.password, Userdata.Password);
        if (!passeordcompare) {
            success = false;
            return res.status(400).json({ errors: "Please try to login with correct candidate.", success });
        }

            const data = {
                user: {
                    id: Userdata.id,
                    Firstname: Userdata.Firstname,
                    Lastname: Userdata.Lastname,
                    email: Userdata.Email,
                    Mobile: Userdata.Mobile
                }
            }
            const UDATA = {
                Firstname: Userdata.Firstname,
                surname: Userdata.surname
            }
            success = true;
            let OTPSUCCESS = true;
            const authToken = jwt.sign(data, JWT_SCERET);
            return res.status(200).json({ success, authToken, OTPSUCCESS, UDATA });
    } catch (e) {
        return res.status(200).json({ errors: e, success });
    }
}
