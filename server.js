const express = require("express");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post("/subscribe", async (req, res) => {

    const email = req.body.email;

    if (!email) {
        return res.status(400).json({
            message: "Email is required"
        });
    }

    const message = {
        to: email,
        from: "lavsukhija001@gmail.com",
        subject: "Welcome to Lav's Website",
        text: "Thank you for subscribing to my newsletter!"
    };

    try {

        await sgMail.send(message);

        console.log("Welcome email sent successfully");
        console.log("Email API Status: 202");

        res.status(200).json({
            message: "Successfully subscribed! Welcome email sent."
        });

    } catch (error) {

        console.error("Email error:", error.response?.body || error);

        res.status(500).json({
            message: "Failed to send welcome email."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});