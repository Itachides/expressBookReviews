const axios = require('axios');

const getBooks = async () => {
    try {
        const response = await axios.get("http://localhost:5000/");
        return response.data;
    } catch (error) {
        return ("Error fetching books:", error);
    }
}


const getBookByID = async () => {
    const isbn = 1;
    try {
        const response = await axios.get(`http://localhost:5000/${isbn}`);
        return response.data;
    } catch (error) {
        return ("Error fetching books:", error);
    }
}

const getBookByAuthor = async () => {
    const Author = "Jane%20Austen";
    try {
        const response = await axios.get(`http://localhost:5000/${Author}`);
        return response.data;
    } catch (error) {
        return ("Error fetching books:", error);
    }
}

const getBookByTitle = async () => {
    const Title = "Fairy%20tales";
    try {
        const response = await axios.get(`http://localhost:5000/${Title}`);
        return response.data;
    } catch (error) {
        return ("Error fetching books:", error);
    }
}