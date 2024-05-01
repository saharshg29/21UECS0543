const express = require('express');
const axios = require("axios")
// const fetch = require('node-fetch');

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

const fetchNumbers = async (url) => {
    try {
        const config = {
            headers: {
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE0NTQ1NjUxLCJpYXQiOjE3MTQ1NDUzNTEsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjkxYmEzNTVjLTZmM2QtNGY2NS04MjRiLTNlNTAwMjE5NGM4MSIsInN1YiI6InZ0dUBnbWFpbC5jb20ifSwiY29tcGFueU5hbWUiOiJ0ZXN0aWZ5IiwiY2xpZW50SUQiOiI5MWJhMzU1Yy02ZjNkLTRmNjUtODI0Yi0zZTUwMDIxOTRjODEiLCJjbGllbnRTZWNyZXQiOiJSV29KakZTRk1wb3l5UkZJIiwib3duZXJOYW1lIjoidGVzdGlmeSIsIm93bmVyRW1haWwiOiJ2dHVAZ21haWwuY29tIiwicm9sbE5vIjoiMTkxOTUifQ.37bCUmX4Ad83rOcemsACT0Gkc7FdpYTHUcRhlTQpm7I'
            }
        };
        const response = await fetch(url, config);
        const responseData = await response.json();
        console.log(responseData);
        const newNumber = responseData.number;
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
app.get('/numbers/:type', async (req, res) => {
    try {
        const { type } = req.params;
        let url;
        switch (type) {
            case 'p':
                url = 'http://20.244.56.144/test/primes';
                break;
            case 'e':
                url = 'http://20.244.56.144/test/even';
                break;
            case 'f':
                url = 'http://20.244.56.144/test/fibo';
                break;
            case 'r':
                url = 'http://20.244.56.144/test/rand';
                break;
            default:
                res.status(404).json({ error: 'Invalid type' });
                return;
        }
        // Fetch numbers from test server
        await fetchNumbers(url);
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
        console.error('Error processing request:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// // GET /companies/:companyName/categories/:categoryName/products/:productType
app.get('/companies/:companyName/categories/:categoryName/products/:productType', async (req, res) => {
    try {
        const { companyName, categoryName, productType } = req.params;
        const { top, minPrice, maxPrice } = req.query;
        const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE0NTQ1NjUxLCJpYXQiOjE3MTQ1NDUzNTEsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjkxYmEzNTVjLTZmM2QtNGY2NS04MjRiLTNlNTAwMjE5NGM4MSIsInN1YiI6InZ0dUBnbWFpbC5jb20ifSwiY29tcGFueU5hbWUiOiJ0ZXN0aWZ5IiwiY2xpZW50SUQiOiI5MWJhMzU1Yy02ZjNkLTRmNjUtODI0Yi0zZTUwMDIxOTRjODEiLCJjbGllbnRTZWNyZXQiOiJSV29KakZTRk1wb3l5UkZJIiwib3duZXJOYW1lIjoidGVzdGlmeSIsIm93bmVyRW1haWwiOiJ2dHVAZ21haWwuY29tIiwicm9sbE5vIjoiMTkxOTUifQ.37bCUmX4Ad83rOcemsACT0Gkc7FdpYTHUcRhlTQpm7I';

        // Constructing headers with the bearer token
        const headers = {
            'Authorization': `Bearer ${bearerToken}`
        };

        const response = await axios.get(`http://20.244.56.144/test/companies/${companyName}/categories/${categoryName}/products/${productType}`, {
            params: {
                top,
                minPrice,
                maxPrice
            },
            headers: headers
        });

        res.json(response.data.products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
