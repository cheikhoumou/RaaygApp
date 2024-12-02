// Google Sheets Integration
const SHEET_ID = '166k5ehkCDv57d3tqUaInviMt-DFokoSVwCopODV0E48'; // You'll need to add your Google Sheet ID here
const CLIENT_ID = '78355848390-bqi04aefk0sl4nshepumblgv745f8nfm.apps.googleusercontent.com'; // You'll need to add your Google Client ID here
const API_KEY = 'AIzaSyDxOJiGvEIYXfa2bHCmHEGhod1rJ2PGo5E'; // You'll need to add your API Key here
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let tokenClient;
let gapiInited = false;
let gisInited = false;

function gapiLoaded() {
    gapi.load('client', async () => {
        await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        });
        gapiInited = true;
        maybeEnableButtons();
    });
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('authorize_button').style.visibility = 'visible';
    }
}

// Function to verify API is ready
function isApiReady() {
    return gapiInited && gisInited && gapi.client.getToken() !== null;
}

async function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        await listMajors();
        document.getElementById('signout_button').style.visibility = 'visible';
        document.getElementById('authorize_button').innerText = 'Refresh';
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        tokenClient.requestAccessToken({prompt: ''});
    }
}

function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        document.getElementById('content').innerText = '';
        document.getElementById('authorize_button').innerText = 'Authorize';
        document.getElementById('signout_button').style.visibility = 'hidden';
    }
}

// Function to append data to Google Sheet
async function appendToSheet(range, values) {
    try {
        const response = await gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: range,
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [values]
            }
        });
        return response.result;
    } catch (err) {
        console.error(err);
        return null;
    }
}

// Function to read data from Google Sheet
async function readFromSheet(range) {
    if (!isApiReady()) {
        throw new Error('يرجى تسجيل الدخول أولاً');
    }
    
    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: range,
        });
        return response.result.values;
    } catch (err) {
        console.error('Error reading from sheet:', err);
        throw err;
    }
}

// Function to verify login
async function verifyLogin(username, password) {
    try {
        if (!isApiReady()) {
            await new Promise((resolve) => {
                tokenClient.callback = async (resp) => {
                    if (resp.error !== undefined) {
                        throw resp;
                    }
                    resolve();
                };
                if (gapi.client.getToken() === null) {
                    tokenClient.requestAccessToken({ prompt: 'consent' });
                } else {
                    tokenClient.requestAccessToken({ prompt: '' });
                }
            });
        }

        const users = await readFromSheet('Users!A2:C');
        if (!users) return false;
        
        return users.some(user => 
            user[0] === username && 
            user[1] === password
        );
    } catch (err) {
        console.error('Error during login:', err);
        alert('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
        return false;
    }
}

// Function to add new sale
async function addSaleToSheet(saleData) {
    const values = [
        new Date().toISOString(),
        saleData.amount,
        saleData.description,
        saleData.discount || 0
    ];
    return appendToSheet('Sales!A2:D', values);
}

// Function to add new expense
async function addExpenseToSheet(expenseData) {
    const values = [
        new Date().toISOString(),
        expenseData.amount,
        expenseData.description,
        expenseData.category
    ];
    return appendToSheet('Expenses!A2:D', values);
}

// Function to register new user
async function registerUser(userData) {
    const values = [
        userData.username,
        userData.password,
        userData.name
    ];
    return appendToSheet('Users!A2:C', values);
}
