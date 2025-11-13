const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
if (req.headers.authorization) {
    // Format is "Bearer TOKEN_STRING", so we split and get the token
    const token = req.headers.authorization.split(" ")[1]; 
    
    // Verify the token
    jwt.verify(token, "fingerprint_customer", (err, decoded) => {
      if (err) {
        // If token is invalid (e.g., expired, wrong signature)
        return res.status(401).json({ message: "Invalid token. Please log in again." });
      } else {
        // If token is valid, add the decoded user info to the request
        // This is what makes "req.user.username" work in your review route!
        req.user = decoded; 
        
        // --- THIS IS THE CRITICAL PART ---
        // Pass control to the next handler (your review route logic)
        next(); 
      }
    });
  } else {
    // If no token is provided at all
    return res.status(401).json({ message: "Not authenticated. Please log in." });
  }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
