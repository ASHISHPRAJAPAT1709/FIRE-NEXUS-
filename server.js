const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
const propertyId = 'PROPERTY_ID'; // Replace with the actual property ID
const url = `https://apisetu.gov.in/API_ENDPOINT?propertyId=${propertyId}`;

fetch(url, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
})
.then(response => response.json())
.then(data => {
  if (data.nocStatus === 'approved') {
    console.log('NOC certification is valid.');
    // Handle valid NOC status (e.g., update UI)
  } else {
    console.log('NOC certification is not valid.');
    // Handle invalid NOC status (e.g., notify the user)
  }
})
.catch(error => {
  console.error('Error fetching NOC certification status:', error);
  // Handle errors (e.g., network issues)
});
