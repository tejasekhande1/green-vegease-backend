const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

exports.signUp = async (req, res) => {
    try {
        const {firstname, lastname, username, mobileNumber, email, password, confirmedPassword} = req.body;

        if (!firstname || !lastname || !username || !mobileNumber || !email || !password || !confirmedPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        if (password !== confirmedPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match, please try again',
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: {email},
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                first_name: firstname,
                last_name: lastname,
                username,
                mobile_number: mobileNumber,
                email,
                password: hashedPassword,
                profile_picture: `https://api.dicebear.com/7.x/initials/svg?seed=${firstname} ${lastname}`,
            },
        });

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                mobile_number: user.mobile_number,
                profile_picture: user.profile_picture,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error while registering user',
            error: error.message,
        });
    }
};
