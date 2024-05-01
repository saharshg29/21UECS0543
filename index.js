const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const windowSize = 10;
let numbers = [];
let sum = 0;

// Function to calculate average
const calculateAverage = () => {
    if (numbers.length === 0) {
        return 0; // Return 0 if there are no numbers
    }
    console.log({ sum, numbers })
    return sum / numbers.length;
};



const fetchNumbers = async () => {
    try {
        const config = {
            headers: {
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE0NTQ0NDY3LCJpYXQiOjE3MTQ1NDQxNjcsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImE5YjFjYWNhLTViMDEtNDYxOS04ZGMwLTIxOGRkMWNiMDcwYyIsInN1YiI6ImdhbWVyamlndXB0QGdtYWlsLmNvbSJ9LCJjb21wYW55TmFtZSI6Ikd1cHRhIE1lZGljcyIsImNsaWVudElEIjoiYTliMWNhY2EtNWIwMS00NjE5LThkYzAtMjE4ZGQxY2IwNzBjIiwiY2xpZW50U2VjcmV0IjoiZkpQYkpoTE9UTXpxaGpoVSIsIm93bmVyTmFtZSI6IlNhaGFyc2ggR3VwdGEiLCJvd25lckVtYWlsIjoiZ2FtZXJqaWd1cHRAZ21haWwuY29tIiwicm9sbE5vIjoiMTkxMTAifQ.uahErv5lt9f5iZ4lqfo9dDSPqBZ9RpGqW_VPR5Qy8qQ'
            }
        };
        const response = await fetch('http://20.244.56.144/test/even', config);
        const responseData = await response.json();
        console.log(responseData);
        const newNumber = responseData.numbers;
        if (!numbers.includes(newNumber)) {
            // Add new number to the list
            numbers.push(newNumber);
            sum += parseInt(newNumber);
            // If window size is exceeded, remove oldest number
            if (numbers.length > windowSize) {
                const removedNumber = numbers.shift();
                sum -= removedNumber;
            }
        }
    } catch (error) {
        console.error('Error fetching numbers from test server:', error.message);
    }
};


// Middleware to handle requests
app.use('/:numberid', async (req, res) => {
    try {
        const { numberid } = req.params;
        // Fetch numbers from test server
        await fetchNumbers();
        // Calculate average
        const average = calculateAverage();
        // Prepare response
        const response = {
            numbers: numbers,
            previousState: numbers.slice(0, -1),
            currentState: numbers,
            average: average
        };
        res.json(response);
    } catch (error) {
        console.log("Error occured")
        console.error('Error processing request:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});