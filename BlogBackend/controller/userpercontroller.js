const { request } = require('express');
const User = require('../model/user');
const BlogPost = require('../model/blogspost');


let success = false;

module.exports.personaluser = async (req, res) => {
    success = false;
    try {
        let Userdata = await User.findById({ _id: req.user.id });
        if (!Userdata) {
            return res.status(404).send({ error: "Your Account is Not Found", success })
        }
        let Blog = await BlogPost.find({ userid: req.user.id });

        success = true;
        return res.status(200).json({ success, Userdata, Blog });
    } catch (e) {
        return res.status(200).json({ error: e, success });
    }
}

module.exports.getsearch = async (req, res) => {
    try {
        console.log(req.params.id)
        var pattern = "How to Write a Successful Fashion Blog?";
        let Blog_Title = await BlogPost.find( { 
            $or: [
                {
                    Blog_Title:  pattern
                },
                {  
                    Blogs_Description:  pattern
                } 
            ]
        })

        //let Blog_Title = await BlogPost.find({ Blog_Title: pattern })

        console.log(Blog_Title)




    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}