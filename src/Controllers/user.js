const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CreateModel = require("../module/user");
const RoleUser = require("../module/Role");

const CommunityModel = require("../module/Community");


//===================== [ Create User ] =====================/

const createUser = async function (req, res) {
    try {
        let data = req.body;
        let { name, email, password, } = data;

        if (await CreateModel.findOne({ email: email }))
            return res
                .status(400)
                .send({ status: false, message: "Email already exist" });

        const encryptedPassword = bcrypt.hashSync(password, 12);
        req.body["password"] = encryptedPassword;

        var token = jwt.sign(
            {
                userId: CreateModel._id,
            },
            "project"
        );
        data.token = token;

        let savedData = await CreateModel.create(data);
        res.status(201).send({
            status: true,
            msg: "User Register successfull",
            data: {
                name: savedData.name,
                email: savedData.email,
                password: savedData.password,
                token: savedData.token,

            },
        });
    } catch (err) {
        res.status(500).send({ status: false, error: err.message });
    }
};


//===================== [ User Login ] =====================/

const userLogin = async function (req, res) {
    try {
        let data = req.body;
        let { email, password } = data;

        let userExists = await CreateModel.findOne({ email: email });

        if (!userExists) {
            return res.status(400).send({
                status: false,
                msg: "Email and Password is Invalid",
            });
        }

        let compared = await bcrypt.compare(password, userExists.password);
        if (!compared) {
            return res.status(400).send({
                status: false,
                message: "Your password is invalid",
            });
        }
        var token = jwt.sign(
            {
                userId: userExists._id,
            },
            "project"
        );

        let updateToken = await CreateModel.findByIdAndUpdate(
            { _id: userExists._id },
            { token },
            { new: true }
        );
        userExists.token = updateToken.token;

        return res.status(200).send({
            status: true,
            msg: "User Login Successfully",
            data: userExists,
        });
    } catch (error) {
        return res.status(500).send({
            status: false,
            msg: error.message,
        });
    }
};


//=====================[ Get the user ]=====================/

const getMe = async function (req, res) {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'project');

        const user = await CreateModel.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(404).send({ status: false, message: 'User not found' });
        }

        res.status(200).send({
            status: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ status: false, error: 'Internal server error' });
    }
};

//======================[ Role ]==========================/
const Roleuser = async function (req, res) {
    try {
        const { name } = req.body;

        const role = new RoleUser({ name });

        await role.save();

        res.status(201).json(role);
    } catch (error) {
        console.error('Error creating role:', error);
        res.status(500).json({ error: 'Could not create role' });
    }
};


//=====================[ Get Role ]======================/
const getRoleuser = async function (req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;

        const totalRoles = await RoleUser.countDocuments();
        const totalPages = Math.ceil(totalRoles / perPage);

        const roles = await RoleUser.find()
            .skip((page - 1) * perPage)
            .limit(perPage);

        const response = {
            status: true,
            content: {
                meta: {
                    total: totalRoles,
                    pages: totalPages,
                    page: page
                },
                data: roles
            }
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error retrieving roles:', error);
        res.status(500).json({ error: 'Could not retrieve roles' });
    }
};


//=====================[ create Community ]==================/
const generateUniqueId = require('../module/user');
const { name } = require("ejs");

const communities = [];

const createCommunity = async function (req, res) {
    try {
        const userId = req.params.userId;
        console.log(userId)
        const { name } = req.body;

        const slug = name.toLowerCase().replace(/\s+/g, '-');

        const community = {
            name,
            slug,
            owner: userId,
        };

        const New_Community = await CommunityModel.create(community);
       
        res.status(201).json({ status: true, content: { data: New_Community } });
    } catch (error) {
        console.error('Error creating community:', error);
        res.status(400).json({ status: false, error: 'Community not Found' });
    }
};


//======================[ Get All ]========================/
const GetCommunity = async function (req, res) {
    try {
        const userId = req.params.userId;
        const { page = 1, perPage = 10 } = req.query;
        const skip = (page - 1) * perPage;

        const total = await CommunityModel.countDocuments();

        const communities = await CommunityModel.find({ owner: userId })
            .skip(skip)
            .limit(perPage)
            .lean();

        // const comm = await CreateModel.findOne({ _id: userId, name: name });
        // console.log(comm)

        const meta = {
            total,
            pages: Math.ceil(total / perPage),
            page: parseInt(page),
        };

        res.status(200).json({ status: true, content: { data: communities, meta } });
    } catch (error) {
        console.error('Error fetching communities:', error);
        res.status(400).json({ status: false, error: 'Community Not Get For this User' });
    }
};

//======================[ Get my Owned Community ]==========/
const GetmyOwnedCommunity = async function (req, res) {
    try {
        const userId = req.params.userId;
        const { page = 1, perPage = 10 } = req.query;
        const skip = (page - 1) * perPage;

        const total = await CommunityModel.countDocuments();

        const communities = await CommunityModel.findOne({ owner: userId })
            .skip(skip)
            .limit(perPage)
            .lean();

        const meta = {
            total,
            pages: Math.ceil(total / perPage),
            page: parseInt(page),
        };

        res.status(200).json({ status: true, content: { data: communities, meta } });
    } catch (error) {
        console.error('Error fetching communities:', error);
        res.status(400).json({ status: false, error: 'Community Not Get For this User' });
    }
};

//======================[ Get All Member ]==================/
// const GetallMember = async function (req, res) {
//     const userId = req.params.userId;
//     console.log(userId)
//     const community = CommunityModel.find(item => item.community === userId);
  
//     if (!community) {
//       return res.status(404).json({ status: false, error: 'Community not found' });
//     }
  
//     const filteredData = CommunityModel.content.data.map(item => ({
//       id: item.id,
//       community: item.community,
//       user: {
//         id: item.user.id,
//         name: item.user.name
//       },
//       role: {
//         id: item.role.id,
//         name: item.role.name
//       },
//       created_at: item.created_at
//     }));
  
//     res.status(200).json({ status: true, content: { ...CommunityModel.content, data: filteredData } });
//   };

//======================[ Post Member ]==========================/
const PostMember = async function (req, res) {
    try {

        const communityMembers = [
            {
                userId: responseData.content.data.user,
                role: responseData.content.data.role,
                createdAt: responseData.content.data.created_at,
            },

        ];
        const newUser = req.body.newUser;

        res.json({ status: true, message: 'User added as a member', communityMembers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Failed to add user as a member' });
    }
};


module.exports = {
    createUser,
    userLogin,
    getMe,
    Roleuser,
    getRoleuser,
    createCommunity,
    GetCommunity,
    GetmyOwnedCommunity,
    // GetallMember,
    PostMember,
};