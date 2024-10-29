const hostLoginAuth = (req, res, next) => {
    console.log("Authenticating User...");
    console.log("Session data: ", req.session);
    console.log("User object: ", req.user);
    
    if (req.isAuthenticated()) {
        return next();
    }
    console.log("User not authenticated");
    res.redirect("/host/hostlogin?error");
};

export { 
    hostLoginAuth
};








// import jwt from "jsonwebtoken";
// import env from "dotenv";

// env.config();

// const verifyToken = (req, res, next) => {
//     const token = req.headers["authorization"];

//     if(!token) {
//         return res.status(403).json({ message: "Token is required" });
//     };

//     const actualToken = token.spilt(" ")[1];

//     try {
//         const decoded = jwt.verify(actualToken, process.env.JWT_ACCESS_SECRET);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         return res.status(401).json({ message: "Invalid or expired token" });
//     }
// }


// export { verifyToken }