// تخزين المبيعات والمصروفات
let sales = [];
let expenses = [];

// Global variables
let isLoggedIn = false;
let currentUser = null;

// Show/hide main content based on login status
function updateUIForAuth() {
    const mainContent = document.querySelector('.container');
    const loginSection = document.getElementById('loginSection');
    
    if (isLoggedIn) {
        mainContent.style.display = 'block';
        loginSection.style.display = 'none';
        loadAllData(); // Load data from Google Sheets
    } else {
        mainContent.style.display = 'none';
        loginSection.style.display = 'flex';
    }
}

// معالجة تسجيل الدخول
async function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginError = document.getElementById('loginError');
    
    try {
        loginError.textContent = ''; // مسح أي رسائل خطأ سابقة
        const success = await verifyLogin(username, password);
        
        if (success) {
            document.querySelector('.container').style.display = 'block';
            document.getElementById('loginSection').style.display = 'none';
            updateDashboard(); // تحديث لوحة التحكم
        } else {
            loginError.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة';
        }
    } catch (err) {
        console.error('Login error:', err);
        loginError.textContent = 'حدث خطأ أثناء تسجيل الدخول';
    }
}

// Load all data from Google Sheets
async function loadAllData() {
    const sales = await readFromSheet('Sales!A2:D');
    const expenses = await readFromSheet('Expenses!A2:D');
    
    if (sales) {
        salesData = sales.map(row => ({
            date: new Date(row[0]),
            amount: parseFloat(row[1]),
            description: row[2],
            discount: parseFloat(row[3] || 0)
        }));
    }
    
    if (expenses) {
        expensesData = expenses.map(row => ({
            date: new Date(row[0]),
            amount: parseFloat(row[1]),
            description: row[2],
            category: row[3]
        }));
    }
    
    updateDashboard();
}

// إضافة مبيعة جديدة
async function addSale() {
    const itemName = document.getElementById('itemName').value;
    const salePrice = parseFloat(document.getElementById('salePrice').value);
    const deductionPercentage = parseFloat(document.getElementById('deductionPercentage').value);

    if (!itemName || isNaN(salePrice) || isNaN(deductionPercentage)) {
        alert('الرجاء ملء جميع الحقول بشكل صحيح');
        return;
    }

    const deductionAmount = (salePrice * deductionPercentage) / 100;
    const netAmount = salePrice - deductionAmount;

    const saleData = {
        name: itemName,
        price: salePrice,
        deduction: deductionPercentage,
        netAmount: netAmount
    };

    // Add to Google Sheet
    const result = await addSaleToSheet(saleData);
    if (result) {
        sales.push({
            date: new Date(),
            ...saleData
        });
        updateSalesList();
        updateSummary();
        clearSaleForm();
    } else {
        alert('حدث خطأ في حفظ البيانات');
    }
}

// إضافة مصروف جديد
async function addExpense() {
    const expenseName = document.getElementById('expenseName').value;
    const expenseAmount = parseFloat(document.getElementById('expenseAmount').value);

    if (!expenseName || isNaN(expenseAmount)) {
        alert('الرجاء ملء جميع الحقول بشكل صحيح');
        return;
    }

    const expenseData = {
        name: expenseName,
        amount: expenseAmount
    };

    // Add to Google Sheet
    const result = await addExpenseToSheet(expenseData);
    if (result) {
        expenses.push({
            date: new Date(),
            ...expenseData
        });
        updateExpensesList();
        updateSummary();
        clearExpenseForm();
    } else {
        alert('حدث خطأ في حفظ البيانات');
    }
}

// تحديث قائمة المبيعات
function updateSalesList() {
    const salesList = document.getElementById('salesList');
    salesList.innerHTML = '';

    sales.forEach((sale, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${sale.name} - السعر: ${sale.price} - الخصم: ${sale.deduction}% - الصافي: ${sale.netAmount}
            <button onclick="deleteSale(${index})" style="width: auto; background-color: #ff4444;">حذف</button>
        `;
        salesList.appendChild(li);
    });
}

// تحديث قائمة المصروفات
function updateExpensesList() {
    const expensesList = document.getElementById('expensesList');
    expensesList.innerHTML = '';

    expenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${expense.name} - المبلغ: ${expense.amount}
            <button onclick="deleteExpense(${index})" style="width: auto; background-color: #ff4444;">حذف</button>
        `;
        expensesList.appendChild(li);
    });
}

// تحديث الملخص
function updateSummary() {
    const totalSales = sales.reduce((sum, sale) => sum + sale.netAmount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netProfit = totalSales - totalExpenses;

    document.getElementById('totalSales').textContent = totalSales.toFixed(2);
    document.getElementById('totalExpenses').textContent = totalExpenses.toFixed(2);
    document.getElementById('netProfit').textContent = netProfit.toFixed(2);
}

// حذف مبيعة
function deleteSale(index) {
    sales.splice(index, 1);
    updateSalesList();
    updateSummary();
}

// حذف مصروف
function deleteExpense(index) {
    expenses.splice(index, 1);
    updateExpensesList();
    updateSummary();
}

// مسح نموذج المبيعات
function clearSaleForm() {
    document.getElementById('itemName').value = '';
    document.getElementById('salePrice').value = '';
    document.getElementById('deductionPercentage').value = '';
}

// مسح نموذج المصروفات
function clearExpenseForm() {
    document.getElementById('expenseName').value = '';
    document.getElementById('expenseAmount').value = '';
}

// حفظ البيانات في التخزين المحلي
function saveData() {
    localStorage.setItem('sales', JSON.stringify(sales));
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// استرجاع البيانات من التخزين المحلي
function loadData() {
    const savedSales = localStorage.getItem('sales');
    const savedExpenses = localStorage.getItem('expenses');

    if (savedSales) {
        sales = JSON.parse(savedSales);
        updateSalesList();
    }

    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
        updateExpensesList();
    }

    updateSummary();
}

// حفظ البيانات تلقائياً عند إجراء أي تغيير
window.addEventListener('beforeunload', saveData);

// تحميل البيانات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', loadData);

// إظهار وإخفاء التبويبات
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName + '-tab').classList.add('active');
    document.querySelector(`button[onclick="showTab('${tabName}')"]`).classList.add('active');
    
    if (tabName === 'analytics') {
        updateCharts();
    }
}

// تحديث الرسوم البيانية
function updateCharts() {
    updateSalesExpensesChart();
    updateExpensesDistributionChart();
    updateStatistics();
    updatePerformanceIndicators();
}

// رسم بياني للمبيعات والمصروفات
function updateSalesExpensesChart() {
    const ctx = document.getElementById('salesExpensesChart').getContext('2d');
    const monthlyData = getMonthlyData();
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthlyData.months,
            datasets: [{
                label: 'المبيعات',
                data: monthlyData.sales,
                borderColor: '#2196F3',
                fill: false
            }, {
                label: 'المصروفات',
                data: monthlyData.expenses,
                borderColor: '#f44336',
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// رسم بياني لتوزيع المصروفات
function updateExpensesDistributionChart() {
    const ctx = document.getElementById('expensesDistributionChart').getContext('2d');
    const expenseCategories = getExpenseCategories();
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: expenseCategories.labels,
            datasets: [{
                data: expenseCategories.values,
                backgroundColor: [
                    '#2196F3',
                    '#4CAF50',
                    '#FFC107',
                    '#9C27B0',
                    '#FF5722'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// تحديث الإحصائيات
function updateStatistics() {
    const stats = calculateStatistics();
    
    document.getElementById('avgDailySales').textContent = stats.avgDailySales.toFixed(2);
    document.getElementById('highestSale').textContent = stats.highestSale.toFixed(2);
    document.getElementById('profitMargin').textContent = stats.profitMargin.toFixed(2) + '%';
    document.getElementById('totalTransactions').textContent = stats.totalTransactions;
}

// تحديث مؤشرات الأداء
function updatePerformanceIndicators() {
    const performance = calculatePerformance();
    
    updateProgressBar('salesGrowthBar', 'salesGrowthValue', performance.salesGrowth);
    updateProgressBar('costEfficiencyBar', 'costEfficiencyValue', performance.costEfficiency);
    updateProgressBar('profitMarginBar', 'profitMarginValue', performance.profitMargin);
}

// تحديث شريط التقدم
function updateProgressBar(barId, valueId, percentage) {
    document.getElementById(barId).style.width = percentage + '%';
    document.getElementById(valueId).textContent = percentage + '%';
}

// الحصول على البيانات الشهرية
function getMonthlyData() {
    // هنا يمكنك إضافة المنطق لتجميع البيانات حسب الشهر
    return {
        months: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
        sales: [0, 0, 0, 0, 0, 0],
        expenses: [0, 0, 0, 0, 0, 0]
    };
}

// الحصول على فئات المصروفات
function getExpenseCategories() {
    // هنا يمكنك إضافة المنطق لتجميع المصروفات حسب الفئة
    return {
        labels: ['مصروفات تشغيلية', 'رواتب', 'مشتريات', 'إيجارات', 'أخرى'],
        values: [30, 25, 20, 15, 10]
    };
}

// حساب الإحصائيات
function calculateStatistics() {
    return {
        avgDailySales: sales.length > 0 ? sales.reduce((sum, sale) => sum + sale.netAmount, 0) / 30 : 0,
        highestSale: sales.length > 0 ? Math.max(...sales.map(sale => sale.netAmount)) : 0,
        profitMargin: calculateProfitMargin(),
        totalTransactions: sales.length
    };
}

// حساب مؤشرات الأداء
function calculatePerformance() {
    return {
        salesGrowth: 75,
        costEfficiency: 85,
        profitMargin: 65
    };
}

// حساب هامش الربح
function calculateProfitMargin() {
    const totalSales = sales.reduce((sum, sale) => sum + sale.netAmount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    return totalSales > 0 ? ((totalSales - totalExpenses) / totalSales) * 100 : 0;
}

// Add to Google Sheet
async function addSaleToSheet(saleData) {
    // Implement logic to add sale data to Google Sheet
}

// Add to Google Sheet
async function addExpenseToSheet(expenseData) {
    // Implement logic to add expense data to Google Sheet
}

// Read from Google Sheet
async function readFromSheet(range) {
    // Implement logic to read data from Google Sheet
}
