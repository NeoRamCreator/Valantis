import CryptoJS from 'crypto-js';


const ApiUrl = 'http://api.valantis.store:40000/';


const xAuth = async () => {
    try {
        const password = 'Valantis';
        const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const xAuthValue = `${password}_${currentDate}`;
        console.log('xAuthValue', xAuthValue)

        const hash = CryptoJS.MD5(xAuthValue).toString();
        console.log('hash', hash)

        return hash;
    } catch (error) {
        console.error('Error generating X-Auth hash:', error);
        throw error;
    }
}

export const fetchData = async (data) => {
    const hash = await xAuth();
    // console.log(data)
    try {
        const response = await fetch(ApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth': hash
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
            return;
        }

        const resData = await response.json();
        return resData;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }

};


