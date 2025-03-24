document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("file-input");
    const predictButton = document.getElementById("predict-button");
    const uploadedImage = document.getElementById("uploaded-image");
    const processingText = document.getElementById("processing");
    const predictionResult = document.getElementById("prediction-result");

    // 📌 Preview the uploaded image
    fileInput.addEventListener("change", function (event) {
        let file = event.target.files[0];

        if (file) {
            let reader = new FileReader();
            reader.onload = function (e) {
                uploadedImage.src = e.target.result;
                uploadedImage.style.display = "block"; // Show image
            };
            reader.readAsDataURL(file);
        }
    });

    // 📌 Handle prediction request
    predictButton.addEventListener("click", function () {
        let file = fileInput.files[0];

        if (!file) {
            alert(" Please upload an image first.");
            return;
        }

        let formData = new FormData();
        formData.append("file", file);

        // Show processing message
        processingText.style.display = "block";
        predictionResult.innerHTML = ""; // Clear previous result

        fetch("/predict", {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                processingText.style.display = "none"; // Hide processing

                // Show prediction result
                predictionResult.innerHTML = `
                    <strong>Prediction:</strong> ${data.prediction} <br>
                    <strong>Confidence:</strong> ${(data.confidence * 100).toFixed(2)}%
                `;
            })
            .catch(error => {
                processingText.style.display = "none"; // Hide processing
                console.error("Error:", error);
                alert("Error making prediction. Check the console for details.");
            });
    });
});
