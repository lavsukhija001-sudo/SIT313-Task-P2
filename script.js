document.getElementById("signup-form").addEventListener("submit", async function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const message = document.getElementById("message");

    try {

        const response = await fetch("/subscribe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email
            })
        });

        const data = await response.json();

        message.textContent = data.message;

    } catch (error) {

        message.textContent = "Something went wrong.";

    }

});