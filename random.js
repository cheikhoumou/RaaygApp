  // قائمة الأسماء الموريتانية مع تحديد الجنس
  const names = [
    // أسماء ذكور
    {name: "محمد", gender: "m"}, {name: "أحمد", gender: "m"}, {name: "سيدي", gender: "m"}, 
    {name: "محمدو", gender: "m"}, {name: "الشيخ", gender: "m"}, {name: "المختار", gender: "m"}, 
    {name: "عبد الله", gender: "m"}, {name: "إبراهيم", gender: "m"}, {name: "عمر", gender: "m"}, 
    {name: "يوسف", gender: "m"}, {name: "مصطفى", gender: "m"}, {name: "سالم", gender: "m"}, 
    {name: "حمد", gender: "m"}, {name: "باب", gender: "m"}, {name: "الطالب", gender: "m"}, 
    {name: "سيد أحمد", gender: "m"}, {name: "محفوظ", gender: "m"}, {name: "عبد الرحمن", gender: "m"}, 
    {name: "إسماعيل", gender: "m"}, {name: "خليل", gender: "m"}, {name: "زين العابدين", gender: "m"}, 
    {name: "المصطفى", gender: "m"}, {name: "عثمان", gender: "m"}, {name: "بلال", gender: "m"}, 
    {name: "حبيب", gender: "m"}, {name: "داوود", gender: "m"}, {name: "سليمان", gender: "m"}, 
    {name: "عبد العزيز", gender: "m"}, {name: "باركل", gender: "m"}, {name: "كمال", gender: "m"},
    {name: "مولاي", gender: "m"}, {name: "لمين", gender: "m"}, {name: "هارون", gender: "m"}, 
    {name: "وليد", gender: "m"}, {name: "محفوظ", gender: "m"}, {name: "عبد القادر", gender: "m"}, 
    {name: "عبد الكريم", gender: "m"}, {name: "عبد المجيد", gender: "m"}, {name: "عبد الواحد", gender: "m"}, 
    {name: "علي", gender: "m"}, {name: "عمار", gender: "m"}, {name: "غالي", gender: "m"}, 
    {name: "فال", gender: "m"}, {name: "محمد الأمين", gender: "m"}, {name: "محمد سالم", gender: "m"},
    {name: "مولود", gender: "m"}, {name: "نافع", gender: "m"}, {name: "هاشم", gender: "m"}, 
    {name: "يعقوب", gender: "m"}, {name: "محمود", gender: "m"},
    // أسماء إناث
    {name: "آمنة", gender: "f"}, {name: "أسماء", gender: "f"}, {name: "خدي", gender: "f"}, 
    {name: "بنت", gender: "f"}, {name: "تسلم", gender: "f"}, {name: "جميلة", gender: "f"}, 
    {name: "حليمة", gender: "f"}, {name: "خديجة", gender: "f"}, {name: "نبقوه", gender: "f"}, 
    {name: "رحمة", gender: "f"}, {name: "زينب", gender: "f"}, {name: "سارة", gender: "f"}, 
    {name: "سعاد", gender: "f"}, {name: "سلمى", gender: "f"}, {name: "صفية", gender: "f"}, 
    {name: "عائشة", gender: "f"}, {name: "عزيزة", gender: "f"}, {name: "فاطمة", gender: "f"}, 
    {name: "فريدة", gender: "f"}, {name: "كلثوم", gender: "f"}, {name: "نفيسه", gender: "f"}, 
    {name: "ليلى", gender: "f"}, {name: "مريم", gender: "f"}, {name: "منى", gender: "f"}, 
    {name: "نادية", gender: "f"}, {name: "نورة", gender: "f"}, {name: "هاجر", gender: "f"}, 
    {name: "هدى", gender: "f"}, {name: "وفاء", gender: "f"}, {name: "ياسمين", gender: "f"},
    {name: "أمامة", gender: "f"}, {name: "بشرى", gender: "f"}, {name: "ثريا", gender: "f"}, 
    {name: "حواء", gender: "f"}, {name: "خولة", gender: "f"}, {name: "رقية", gender: "f"}, 
    {name: "زهراء", gender: "f"}, {name: "سكينة", gender: "f"}, {name: "شيماء", gender: "f"}, 
    {name: "صباح", gender: "f"}, {name: "توتو", gender: "f"}, {name: "تكبر", gender: "f"}, 
    {name: "الغالية", gender: "f"}, {name: "فردوس", gender: "f"}, {name: "فاتو", gender: "f"}, 
    {name: "كوثر", gender: "f"}, {name: "مني", gender: "f"}, {name: "منال", gender: "f"}, 
    {name: "نجاة", gender: "f"}, {name: "هناء", gender: "f"}
];

// قائمة الدورات
const courses = [
    " التجارة الالكترونية",
    " العملات الرقمية",
    " العمل الحر",
    " mathématiques 7D ",
    " الشحن من SHEIN",
    " تحفة الأطفال",
    "المنهجية الفلسفية",
    "اللغة الانجليزية للمبتدئين",
    "احتراف بناء المتاجر",
    " تعلم الفوتوشوب",
    " اساسيات الرياضيات",
    "اللغة الانجليزية LEVEL 2",
    " اعلانات الفيسبوك",
    " Chimie 7D ",
    "اساسيات اللغة الفرنسية",
    "7D العلوم  ",
    "7D الفيزياء   "
];

// أنماط الرسائل
const messageTemplates = [
    {
        male: "يشاهد [name] درساً من دورة [course]",
        female: "تشاهد [name] درساً من دورة [course]"
    },
    {
        male: "يشتري الآن [name] دورة [course]",
        female: "تشتري الآن [name] دورة [course]"
    },
    {
        male: "[name] يتابع الآن درساً من [course]",
        female: "[name] تتابع الآن درساً من [course]"
    }
];

// دالة لاختيار عنصر عشوائي من مصفوفة
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// دالة لإنشاء رسالة عشوائية
function generateRandomMessage() {
    const randomPerson = getRandomItem(names);
    const course = getRandomItem(courses);
    const messageTemplate = getRandomItem(messageTemplates);
    
    // اختيار الصيغة المناسبة حسب جنس الاسم
    const template = randomPerson.gender === 'f' ? messageTemplate.female : messageTemplate.male;
    
    const message = template
        .replace('[name]', `<span class="person-name">${randomPerson.name}</span>`)
        .replace('[course]', `<span class="course-name">${course}</span>`);
        
    return message;
}

// دالة لتحديث الرسالة
function updateMessage() {
    const messageContainer = document.querySelector('.message-container');
    const messageElement = document.getElementById('messageText');
    const oldMessage = messageElement.innerHTML;
    const newMessage = generateRandomMessage();
    
    // إضافة تأثير محو تدريجي قبل تغيير المحتوى
    messageElement.style.opacity = '0';
    messageElement.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        messageElement.innerHTML = newMessage;
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translateY(0)';
    }, 300);

    // إضافة تأثير نبض للصندوق
    messageContainer.style.transform = 'scale(1.02)';
    setTimeout(() => {
        messageContainer.style.transform = 'scale(1)';
    }, 200);
}

// تحديث الرسالة كل 5 ثواني
updateMessage();
setInterval(updateMessage, 8000);
