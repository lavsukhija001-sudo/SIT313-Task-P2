
const express = require("express");
const sgMail = require("@sendgrid/mail");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 3000;

const mailingListFile = path.join(__dirname, "subscribers.json");

app.use(express.json());
app.use(express.static(__dirname));

if (!process.env.SENDGRID_API_KEY) {
    console.error("SENDGRID_API_KEY is missing from .env");
    process.exit(1);
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Read the saved mailing list
function getMailingList() {
    try {
        if (fs.existsSync(mailingListFile)) {
            return JSON.parse(
                fs.readFileSync(mailingListFile, "utf8")
            );
        }
    } catch (error) {
        console.error("Could not read mailing list:", error.message);
    }

    return [];
}

app.post("/subscribe", async (req, res) => {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
        return res.status(400).json({
            message: "Email is required."
        });
    }

    const message = {
        to: email,
        from: "lavsukhija001@gmail.com",
        subject: "Welcome to Lav's Website",
        text: "Thank you for subscribing to my newsletter!"
    };

    try {
        // Send the welcome email through SendGrid
        const [sendGridResponse] = await sgMail.send(message);

        // Keep the subscriber in a saved mailing list
        const mailingList = getMailingList();

        if (!mailingList.includes(email)) {
            mailingList.push(email);

            fs.writeFileSync(
                mailingListFile,
                JSON.stringify(mailingList, null, 2)
            );
        }

        // Display the actual response returned by SendGrid
        console.log("Welcome email sent successfully.");
        console.log(
            "Email API Status:",
            sendGridResponse.statusCode
        );
        console.log("Total subscribers:", mailingList.length);

        return res.status(200).json({
            message: "Successfully subscribed! Welcome email sent."
        });

    } catch (error) {
        console.error(
            "Email error:",
            error.response?.body || error.message
        );

        return res.status(500).json({
            message: "Failed to send welcome email."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
