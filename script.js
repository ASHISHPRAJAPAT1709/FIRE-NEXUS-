document.getElementById("uploadForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let files = document.getElementById("fileInput").files;
    if (files.length > 4) {
        document.getElementById("uploadMessage").innerText = "You can only upload up to 4 files.";
        return;
    }
    document.getElementById("uploadMessage").innerText = "Files uploaded successfully!";
});

function checkNOCStatus() {
    let nocID = document.getElementById("nocID").value;
    if (!nocID) {
        document.getElementById("nocStatusMessage").innerText = "Please enter a valid NOC ID.";
        return;
    }
    document.getElementById("nocStatusMessage").innerText = "Your NOC is under review. Expected approval in 2 days.";
}

// Example API integration
const SoloServer = require('solo-server-js');

const solo = new SoloServer({ apiKey: 'YOUR_API_KEY' });

async function getDocuments() {
    try {
        const documents = await solo.documents.list();
        console.log(documents);
    } catch (error) {
        console.error("Error fetching documents:", error);
    }
}

getDocuments();


 const slides = document.querySelectorAll('.slide');
            const dots = document.querySelectorAll('.dot');
            const prevButton = document.querySelector('.prev');
            const nextButton = document.querySelector('.next');
            let currentSlide = 0;
    
            function showSlide(index) {
                slides.forEach(slide => slide.classList.remove('active'));
                dots.forEach(dot => dot.classList.remove('active'));
                slides[index].classList.add('active');
                dots[index].classList.add('active');
            }
    
            function nextSlide() {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            }
    
            function prevSlide() {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                showSlide(currentSlide);
            }
    
            // Auto advance slides
            setInterval(nextSlide, 3000);
    
            // Event listeners
            prevButton.addEventListener('click', prevSlide);
            nextButton.addEventListener('click', nextSlide);
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    currentSlide = index;
                    showSlide(currentSlide);
                });
            });
    
            // Show first slide initially
            showSlide(0);

            let currentIndex = 0;
            const slides = document.querySelectorAll("#carousel img");
            const totalSlides = slides.length;
            const carousel = document.getElementById("carousel");
    
            function updateCarousel() {
                carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            }
    
            function nextSlide() {
                currentIndex = (currentIndex + 1) % totalSlides;
                updateCarousel();
            }
    
            function prevSlide() {
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                updateCarousel();
            }
            setInterval(nextSlide, 3000); // Auto-slide every 3 seconds    


            let qrScanner = null;

function startQRScanner() {
    document.getElementById("qrScannerContainer").style.display = "flex";

    if (!qrScanner) {
        qrScanner = new Html5QrcodeScanner(
            "qrScanner",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        );
    }

    qrScanner.render(
        (decodedText) => {
            alert("Scanned: " + decodedText); // Handle the scanned result
            stopQRScanner();
        },
        (errorMessage) => {
            console.log(errorMessage); // Log errors
        }
    );
}

function stopQRScanner() {
    if (qrScanner) {
        qrScanner.clear().then(() => {
            document.getElementById("qrScannerContainer").style.display = "none";
        }).catch((error) => console.log(error));
    }
}
// Ensure the Regula Document Reader JavaScript client is included in your project
// You can find the client and usage instructions in the Regula Document Reader Web API documentation

document.getElementById('documentInput').addEventListener('change', async function(event) {
    const file = event.target.files[0];
    if (!file) {
      console.error('No file selected.');
      return;
    }
  
    // Initialize the Regula Document Reader client
    const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
    const client = new DocumentReaderApiClient({ apiKey });
  
    try {
      // Read the file as an ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
  
      // Convert ArrayBuffer to Base64
      const base64String = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
  
      // Prepare the request payload
      const requestPayload = {
        processParams: {
          scenario: 'fullProcess',
        },
        images: [
          {
            data: base64String,
            imageType: 0, // 0 corresponds to the default image type
          },
        ],
      };
  
      // Send the document for processing
      const response = await client.process(requestPayload);
  
      // Check the verification status
      if (response.status === 'ok') {
        console.log('Document is valid.');
        // Handle successful verification (e.g., display results to the user)
      } else {
        console.log('Document verification failed.');
        // Handle verification failure (e.g., notify the user)
      }
    } catch (error) {
      console.error('Error during document verification:', error);
    }
  });
  