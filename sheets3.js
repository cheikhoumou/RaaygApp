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
        throw new Error('فشل في تهيئة Google Sheets: ' + err.message);
    }
}

// قراءة البيانات من Google Sheet
async function readFromSheet(range) {
    console.log('Attempting to read from sheet:', range);
    
    if (!isInitialized) {
        console.log('Initializing sheets before reading...');
        await initializeSheets();
    }
    
    try {
        console.log('Making API request...');
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: range,
            valueRenderOption: 'UNFORMATTED_VALUE',
            dateTimeRenderOption: 'FORMATTED_STRING'
        });
        
        console.log('Response received:', response);
        
        if (!response.result || !response.result.values) {
            console.error('No values found in response:', response);
            throw new Error('لم يتم العثور على بيانات في الجدول');
        }
        
        return response.result.values;
    } catch (err) {
        console.error('Error reading from sheet:', err);
        if (err.status === 403) {
            throw new Error('تم رفض الوصول إلى الجدول. تأكد من أن الملف مشارك بشكل صحيح.');
        } else if (err.status === 404) {
            throw new Error('لم يتم العثور على الجدول. تأكد من معرف الملف.');
        }
        throw new Error('حدث خطأ في قراءة البيانات: ' + err.message);
    }
}

// التحقق من تسجيل الدخول
async function verifyLogin(username, password) {
    try {
        console.log('Verifying login for username:', username);
        const users = await readFromSheet('Users!A2:C');
        
        if (!Array.isArray(users) || users.length === 0) {
            console.error('No users found in sheet');
            throw new Error('لم يتم العثور على بيانات المستخدمين');
        }
        
        console.log('Found users:', users.length);
        const user = users.find(user => 
            user[0]?.toString() === username && 
            user[1]?.toString() === password
        );
        
        if (user) {
            console.log('Login successful');
            localStorage.setItem('currentUser', JSON.stringify({
                username: user[0],
                name: user[2] || user[0]
            }));
            return true;
        }
        
        console.log('Login failed: invalid credentials');
        return false;
    } catch (err) {
        console.error('Login verification error:', err);
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
        throw new Error('فشل في إضافة البيانات: ' + err.message);
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
