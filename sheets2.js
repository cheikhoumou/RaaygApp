// Google Sheets Integration
const SHEET_ID = '166k5ehkCDv57d3tqUaInviMt-DFokoSVwCopODV0E48'; // You'll need to add your Google Sheet ID here
const API_KEY = 'AIzaSyDxOJiGvEIYXfa2bHCmHEGhod1rJ2PGo5E'; // You'll need to add your API Key here

let isInitialized = false;

// تهيئة Google Sheets API
async function initializeSheets() {
    try {
        await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        });
        isInitialized = true;
        console.log('Google Sheets API initialized');
    } catch (err) {
        console.error('Error initializing Google Sheets:', err);
        throw err;
    }
}

// قراءة البيانات من Google Sheet
async function readFromSheet(range) {
    if (!isInitialized) {
        await initializeSheets();
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

// التحقق من تسجيل الدخول
async function verifyLogin(username, password) {
    try {
        const users = await readFromSheet('Users!A2:C');
        if (!users) {
            throw new Error('لا يمكن قراءة بيانات المستخدمين');
        }
        
        const user = users.find(user => user[0] === username && user[1] === password);
        if (user) {
            // تخزين معلومات المستخدم في localStorage
            localStorage.setItem('currentUser', JSON.stringify({
                username: user[0],
                name: user[2]
            }));
            return true;
        }
        return false;
    } catch (err) {
        console.error('Error during login:', err);
        alert('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
        return false;
    }
}

// إضافة بيانات جديدة
async function appendToSheet(range, values) {
    if (!isInitialized) {
        await initializeSheets();
    }
    
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
        console.error('Error appending to sheet:', err);
        throw err;
    }
}

// إضافة مبيعات جديدة
async function addSaleToSheet(saleData) {
    const values = [
        new Date().toISOString(),
        saleData.amount,
        saleData.description,
        saleData.discount || 0
    ];
    return appendToSheet('Sales!A2:D', values);
}

// إضافة مصروفات جديدة
async function addExpenseToSheet(expenseData) {
    const values = [
        new Date().toISOString(),
        expenseData.amount,
        expenseData.description,
        expenseData.category
    ];
    return appendToSheet('Expenses!A2:D', values);
}

// تسجيل الخروج
function logout() {
    localStorage.removeItem('currentUser');
    window.location.reload();
}
