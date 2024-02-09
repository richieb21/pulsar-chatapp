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

export default register;