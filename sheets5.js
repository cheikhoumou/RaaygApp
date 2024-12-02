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
        console.log('Google Sheets API initialized successfully');
    } catch (err) {
        console.error('Error initializing Google Sheets:', err);
        throw new Error('فشل في تهيئة Google Sheets: ' + err.message);
    }
}

// قراءة البيانات من Google Sheet
async function readFromSheet(range) {
    try {
        console.log('Reading from sheet:', range);
        
        if (!isInitialized) {
            console.log('API not initialized, initializing now...');
            await initializeSheets();
        }

        console.log('Making API request to spreadsheet:', SHEET_ID);
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: range,
            valueRenderOption: 'UNFORMATTED_VALUE',
            dateTimeRenderOption: 'FORMATTED_STRING'
        });
        
        console.log('Raw API response:', response);
        
        if (!response || !response.result) {
            console.error('Invalid response:', response);
            throw new Error('استجابة غير صالحة من Google Sheets');
        }
        
        if (!response.result.values) {
            console.error('No values in response:', response.result);
            throw new Error('لا توجد بيانات في الجدول');
        }
        
        console.log('Successfully read data:', response.result.values);
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
        console.log('Starting login verification for username:', username);
        // تغيير النطاق ليشمل الصف الأول أيضاً للتحقق من وجود البيانات
        const users = await readFromSheet('Users!A1:C');
        
        console.log('Retrieved users data:', users);
        
        if (!Array.isArray(users)) {
            console.error('Users data is not an array:', users);
            throw new Error('بيانات المستخدمين غير صالحة');
        }
        
        if (users.length <= 1) {
            console.error('No user data found (only headers):', users);
            throw new Error('لم يتم العثور على بيانات المستخدمين');
        }
        
        // تخطي الصف الأول (العناوين) والبحث في باقي الصفوف
        const userRows = users.slice(1);
        console.log('User rows (excluding headers):', userRows);
        
        const user = userRows.find(user => {
            console.log('Checking user row:', user);
            return user[0]?.toString() === username && 
                   user[1]?.toString() === password;
        });
        
        if (user) {
            console.log('Login successful for user:', user);
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
        throw err;
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
