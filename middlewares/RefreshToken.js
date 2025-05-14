const refreshAccessToken = (req, res) =>{

    const refreshToken = req.cookies.refreshToken; 

    if (!refreshToken) {
        return res.status(401).json({ message: 'Nuk ka refresh token' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Refresh tokeni invalid!' });
        }

        const newAccessToken = jwt.sign(
            { Email: user.Email, role: user.role },
            process.env.SECRET_TOKEN,
            { expiresIn: '1h' }
        );

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 60 * 60 * 1000 
        });

        
        res.json({message:'Tokeni u gjenerua!' });
    });
};

export default refreshAccessToken