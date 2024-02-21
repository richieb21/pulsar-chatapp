import exp from 'constants';
import userSchema from '../model/userModel.js';
import bcrypt from 'bcrypt';

const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await userSchema.findOne({username});

        if (usernameCheck){
            return res.json({ msg: "Username already exists", status: false});
        }

        const emailCheck = await userSchema.findOne({email});

        if (emailCheck){
            return res.json({ msg: "Email already exists", status: false});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userSchema.create({
            email,
            username,
            password: hashedPassword,
        });
        delete user.password;
        return res.json({ status: true, user })
    } catch (error) {
        console.log(error);
        return res.json({ msg: "Internal Server Error", status: false});
    }
};

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await userSchema.findOne({username});

        if (!user){
            return res.json({ msg: "Incorrect Username or Password", status: false});
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword){
            return res.json({ msg: "Incorrect Username or Password", status: false});
        }
        delete user.password;

        return res.json({ status: true, user })
    } catch (error) {
        console.log(error);
        return res.json({ msg: "Internal Server Error", status: false});
    }
};

const setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;

        console.log(userId);
        const avatarImage = req.body.image;
        console.log(avatarImage)
        const userData = await userSchema.findByIdAndUpdate(userId, {
            isAvatarImage: true,
            avatarImage: avatarImage,
        });

        console.log(userData);

        return res.json({ isSet: true,  image: userData.avatarImage })
    } catch (error) {
        console.log(error);
        return res.json({ msg: "Internal Server Error", status: false});
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const users = await userSchema.find({_id:{$ne: req.params.id}}).select([
            "email",
            "username",
            "avatarImage", 
            "_id"
        ]);

        return res.json(users);
    } catch (error) {
        console.log(error);
        return res.json({ msg: "Internal Server Error", status: false});
    }
};

export { register, login, setAvatar, getAllUsers };