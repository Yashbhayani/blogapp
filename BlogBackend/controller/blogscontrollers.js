const { request } = require('express');
const User = require('../model/user');
const BlogPost = require('../model/blogspost');
const { ObjectId } = require('mongodb');


let success = false;
const d = new Date();


module.exports.addBlogs = async (req, res) => {
    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            let Auth = true;
            return res.status(404).send("Not Found User", success, Auth)
        }
        let data = [];

        let info = {
            blogdata: req.body.blog_info_1,
            image: req.files[0].filename
        }
        data.push(info)
        info = {
            blogdata: req.body.blog_info_2,
            image: req.files[1].filename
        }
        data.push(info)
        let has = [];
        const array = req.body.hastag.split(",")
        for (let i = 0; i < array.length; i++) {
            has.push(array[i].trim())
        }

        let todayDate = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();


        let blog = await BlogPost.create({
            userid: req.user.id,
            Blog_Title: req.body.blog_title,
            Blogs_Description: req.body.Blogs_Description,
            Blog_content: data,
            Hastag: has,
            Date: todayDate,
        });

        user = await User.findByIdAndUpdate(req.user.id, { BlogPost: user.BlogPost + 1 }, { new: true });

        success = true;
        res.json({ blog, success });
    } catch (e) {
        return res.status(200).json({ error: e, success });
    }
}

module.exports.getallBlogs = async (req, res) => {
    try {
        const estimateUser = await BlogPost.estimatedDocumentCount();
        let blog = await BlogPost.aggregate([{ $sample: { size: estimateUser } }])
        success = true;
        res.json({ blog, success });
    } catch (e) {
        return res.status(200).json({ error: e, success });
    }
}

module.exports.getBlogs = async (req, res) => {
    try {
        let blog = await BlogPost.findById(req.params.id)
            .populate('userid')
        if (!blog) {
            success = false;
            return res.status(400).send("Blogs not found", success)
        }
        let user = await User.findById(blog.userid);
        let userio = await User.findById(req.user.id);

        success = true;
        res.json({ blog, success, user, userio });
    } catch (e) {
        return res.status(200).json({ error: e, success });
    }
}

module.exports.getallhasBlogs = async (req, res) => {
    try {
        let bloghas = await BlogPost.find({ Hastag: req.params.id })
        if (!bloghas) {
            success = false;
            return res.status(400).send("Hastag not found", success)
        }
        success = true;
        res.json({ bloghas, success });
    } catch (e) {
        return res.status(200).json({ error: e, success });
    }
}

module.exports.otheruserinfo = async (req, res) => {

    try {
        let Userdata = await User.findById({ _id: req.params.id });
        if (!Userdata) {
            return res.status(404).send({ error: "Your Account is Not Found", success })
        }
        const UDATA = {
            Firstname: Userdata.Firstname,
            surname: Userdata.surname,
            email: Userdata.Email,
            Mobile: Userdata.Mobile,
            Birthdate: Userdata.Birthdate,
            BlogPost: Userdata.BlogPost,
        }

        let HomeUser = await User.findById({ _id: req.user.id });
        let blog = await BlogPost.find({ userid: req.params.id })
        let user = await User.findById(req.user.id);

        success = true;
        return res.status(200).json({ success, UDATA, blog, user });

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

module.exports.deleteblog = async (req, res) => {
    try {
        let blog = await BlogPost.findByIdAndDelete(req.params.id)
        success = true;
        res.json({ success });
    } catch (e) {
        return res.status(200).json({ error: e, success });
    }
}

module.exports.userverify = async (req, res) => {
    try {
        if (req.params.userid == req.user.id) {
            let blog = await BlogPost.findById(req.params.blogid)
            let user = await User.findById(req.user.id)
            if (!user) {
                return res.status(400).send("User not Found", success)
            }
            if (!blog) {
                return res.status(400).send("Blog not Found", success)
            }
            success = true
            return res.json({ blog, user, success })
        } else {
            return res.status(400).send("User not Valid", success)
        }
    } catch (e) {
        return res.status(200).json({ error: e, success });
    }
}

module.exports.editblog = async (req, res) => {
    try {
        let user = await User.findById(req.user.id);
        let blog = await BlogPost.findById(req.params.id);
        if (!blog) { return res.status(404).send("Not Found") }
        if (String(blog.userid) !== String(user.id)) {
            return res.status(401).send("Not Allowed");
        }
        let bc = blog.Blog_content;
        bc[0].blogdata = req.body.blog_info_1
        bc[1].blogdata = req.body.blog_info_2

        bc[0].image = req.files[0].filename
        bc[1].image = req.files[1].filename

        let has = [];
        const array = req.body.hastag.split(",")
        for (let i = 0; i < array.length; i++) {
            has.push(array[i].trim())
        }
        let todayDate = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();

        let blh = {
            Blog_Title: req.body.blog_title,
            Blogs_Description: req.body.Blogs_Description,
            Blog_content: bc,
            Hastag: has,
            Date: todayDate,
        }

        let updateblog = await BlogPost.findByIdAndUpdate(req.params.id, { $set: blh }, { new: true })
        success = true;
        res.json({ success });

    } catch (e) {
        return res.status(200).json({ error: e, success });
    }
}

module.exports.updateblogfirstimag = async (req, res) => {
    try {
        let user = await User.findById(req.user.id);
        let blog = await BlogPost.findById(req.params.id);
        if (!blog) { return res.status(404).send("Not Found") }
        if (String(blog.userid) !== String(user.id)) {
            return res.status(401).send("Not Allowed");
        }
        let bc = blog.Blog_content;
        bc[0].blogdata = req.body.blog_info_1
        bc[1].blogdata = req.body.blog_info_2

        bc[0].image = req.files[0].filename


        let has = [];
        const array = req.body.hastag.split(",")
        for (let i = 0; i < array.length; i++) {
            has.push(array[i].trim())
        }
        let todayDate = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();

        let blh = {
            Blog_Title: req.body.blog_title,
            Blogs_Description: req.body.Blogs_Description,
            Blog_content: bc,
            Hastag: has,
            Date: todayDate,
        }

        let updateblog = await BlogPost.findByIdAndUpdate(req.params.id, { $set: blh }, { new: true })
        success = true;
        res.json({ success });
    } catch (e) {
        return res.status(200).json({ error: e, success });
    }
}

module.exports.updateblogsecondimag = async (req, res) => {
    try {
        let user = await User.findById(req.user.id);
        let blog = await BlogPost.findById(req.params.id);
        if (!blog) { return res.status(404).send("Not Found") }
        if (String(blog.userid) !== String(user.id)) {
            return res.status(401).send("Not Allowed");
        }
        let bc = blog.Blog_content;
        bc[0].blogdata = req.body.blog_info_1
        bc[1].blogdata = req.body.blog_info_2

        bc[1].image = req.files[0].filename

        let has = [];
        const array = req.body.hastag.split(",")
        for (let i = 0; i < array.length; i++) {
            has.push(array[i].trim())
        }
        let todayDate = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();

        let blh = {
            Blog_Title: req.body.blog_title,
            Blogs_Description: req.body.Blogs_Description,
            Blog_content: bc,
            Hastag: has,
            Date: todayDate,
        }

        let updateblog = await BlogPost.findByIdAndUpdate(req.params.id, { $set: blh }, { new: true })
        success = true;
        res.json({ success });
    } catch (e) {
        return res.status(200).json({ error: e, success });
    }
}

module.exports.updateblognoimag = async (req, res) => {
    try {
        let user = await User.findById(req.user.id);
        let blog = await BlogPost.findById(req.params.id);
        if (!blog) { return res.status(404).send("Not Found") }
        if (String(blog.userid) !== String(user.id)) {
            return res.status(401).send("Not Allowed");
        }

        let bc = blog.Blog_content;
        bc[0].blogdata = req.body.blog_info_1
        bc[1].blogdata = req.body.blog_info_2

        let has = [];
        const array = req.body.hastag;
        for (let i = 0; i < array.length; i++) {
            has.push(array[i].trim())
        }
        blog.Blog_Title = req.body.blog_title;
        blog.Blogs_Description = req.body.Blogs_Description;
        blog.Blog_content = bc;
        blog.Hastag = has;
        let newblog = {
            Blog_Title: blog.Blog_Title,
            Blogs_Description: blog.Blogs_Description,
            Blog_content: bc,
            Hastag: has
        }
        let updateblog = await BlogPost.findByIdAndUpdate(req.params.id, { $set: newblog }, { new: true })
        success = true;
        res.json({ success });
    } catch (e) {
        return res.status(200).json({ error: e, success });
    }
}