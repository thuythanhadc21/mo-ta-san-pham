// Biến toàn cục lưu trữ mô tả vừa được tạo
let currentDescription = '';
let currentProductInfo = {};

/**
 * Kiểm tra form và bật/tắt nút "Tạo Mô Tả"
 */
function checkFormCompletion() {
    const productName = document.getElementById('productName').value.trim();
    const features = document.getElementById('features').value.trim();
    const benefits = document.getElementById('benefits').value.trim();
    const seoKeywords = document.getElementById('seoKeywords').value.trim();
    const style = document.getElementById('style').value.trim();
    const button = document.getElementById('generateBtn');

    if (productName && features && benefits && seoKeywords && style) {
        button.disabled = false;
    } else {
        button.disabled = true;
    }
}

/**
 * [YÊU CẦU ĐỀ BÀI]: GỌI AI FUNCTION (AI STUDIO / OPENAI)
 * Tạo mô tả sản phẩm 2 phiên bản dựa trên dữ liệu người dùng nhập
 */
async function generateDescription(event) {
    if (event) event.preventDefault();
    const button = document.getElementById('generateBtn');
    button.disabled = true;
    button.classList.add('loading');
    button.innerText = 'Đang tạo bằng AI...';

    try {
        const productName = document.getElementById('productName').value;
        const features = document.getElementById('features').value;
        const benefits = document.getElementById('benefits').value;
        const seoKeywords = document.getElementById('seoKeywords').value;
        const style = document.getElementById('style').value;
        const apiKey = CONFIG.apiKey;


        currentProductInfo = {
            name: productName,
            features: features,
            benefits: benefits,
            seoKeywords: seoKeywords,
            style: style
        };

        const prompt = `Bạn là chuyên gia marketing và viết nội dung E-commerce hàng đầu.

Hãy tạo CHÍNH XÁC 3 phiên bản mô tả sản phẩm hoàn chỉnh.

==============================
THÔNG TIN SẢN PHẨM:
- Tên sản phẩm: ${productName}
- Tính năng: ${features}
- Lợi ích: ${benefits}
- Từ khóa SEO: ${seoKeywords}
- Phong cách: ${style}
==============================

MỖI PHIÊN BẢN PHẢI CÓ:

### Phiên bản 1:
### Phiên bản 2:
### Phiên bản 3:

(Mỗi phiên bản phải đầy đủ:)

1. TIÊU ĐỀ
2. MÔ TẢ NGẮN (3-4 câu)
3. TÍNH NĂNG (bullet -)
4. LỢI ÍCH
5. CTA + HASHTAG

YÊU CẦU:
- BẮT BUỘC đủ 3 phiên bản
- Không được thiếu phiên bản nào
- Không gộp phiên bản
- Mỗi phiên bản khác nhau
- Chuẩn SEO
- Độ dài 500-800 từ

Phong cách: ${style}

Chỉ trả về nội dung.`;

        if (apiKey) {
            const hasVersion1 = /phiên\s*bản\s*1/i.test(currentDescription);
const hasVersion2 = /phiên\s*bản\s*2/i.test(currentDescription);
const hasVersion3 = /phiên\s*bản\s*3/i.test(currentDescription);

if (!hasVersion1 || !hasVersion2 || !hasVersion3) {
    currentDescription += "\n\n⚠️ Nội dung AI chưa đủ 3 phiên bản. Vui lòng bấm tạo lại!";
}
            showGeneratedResult();
        } else {
            setTimeout(() => { fallbackGenerate(productName, features, benefits, seoKeywords, style); }, 1000);
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi: ' + error.message + '\n\nĐang dùng chế độ tạo tự động (Offline)...');
        const productName = document.getElementById('productName').value;
        const features = document.getElementById('features').value;
        const benefits = document.getElementById('benefits').value;
        const seoKeywords = document.getElementById('seoKeywords').value;
        const style = document.getElementById('style').value;
        fallbackGenerate(productName, features, benefits, seoKeywords, style);
    }
}

// Chế độ tạo mô tả mô phỏng (dùng khi không nhập key)
function fallbackGenerate(productName, features, benefits, seoKeywords, style) {
    const featureList = features.split('\n').map(f => `- ${f.trim()}`).join('\n');

    let description = `
==============================
PHIÊN BẢN 1:
==============================
**${productName} - Lựa chọn hoàn hảo!**

Sản phẩm ${productName} mang đến trải nghiệm tuyệt vời cho người dùng.

**Tính năng:**
${featureList}

**Lợi ích:**
${benefits}

👉 Mua ngay hôm nay!
#${seoKeywords.replace(/,/g, ' #')}


==============================
PHIÊN BẢN 2:
==============================
**${productName} - Cao cấp & tiện lợi**

${productName} giúp bạn nâng cao trải nghiệm sử dụng mỗi ngày.

**Tính năng:**
${featureList}

**Lợi ích:**
${benefits}

👉 Đặt hàng ngay!
#${seoKeywords.replace(/,/g, ' #')}


==============================
PHIÊN BẢN 3:
==============================
**${productName} - Giải pháp tối ưu**

Thiết kế thông minh, phù hợp nhiều nhu cầu.

**Tính năng:**
${featureList}

**Lợi ích:**
${benefits}

👉 Sở hữu ngay hôm nay!
#${seoKeywords.replace(/,/g, ' #')}
`;

    currentDescription = description;
    showGeneratedResult();
}

function showGeneratedResult() {
    document.getElementById('descriptionText').innerHTML = currentDescription.replace(/\n/g, '<br>');
    document.getElementById('output').style.display = 'block';
    document.getElementById('evaluation').style.display = 'none';

    const button = document.getElementById('generateBtn');
    button.disabled = false;
    button.classList.remove('loading');
    button.innerText = 'Tạo Mô Tả';
}

/**
 * [YÊU CẦU ĐỀ BÀI]: SAO CHÉP DỄ DÀNG
 */
function copyDescription() {
    navigator.clipboard.writeText(currentDescription).then(() => {
        const btn = document.getElementById('copyBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '✓ Đã sao chép!';
        btn.style.backgroundColor = '#218838';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.backgroundColor = '#28a745';
        }, 2000);
    }).catch(err => {
        alert('Có lỗi xảy ra khi sao chép!');
    });
}

/**
 * [YÊU CẦU ĐỀ BÀI]: ĐỊNH DẠNG LẠI (SANG HTML ĐƠN GIẢN)
 */
function formatToHTML() {
    let htmlFormatted = currentDescription
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); // In đậm Markdown (dấu ** của AI)

    // Chuyển dấu - thành <li> và wrap bằng <ul>
    const lines = htmlFormatted.split('<br>');
    let inList = false;
    let result = '';
    for (let line of lines) {
        if (line.startsWith('- ')) {
            if (!inList) {
                result += '<ul>';
                inList = true;
            }
            result += '<li>' + line.substring(2) + '</li>';
        } else {
            if (inList) {
                result += '</ul>';
                inList = false;
            }
            result += line + '<br>';
        }
    }
    if (inList) result += '</ul>';

    document.getElementById('descriptionText').innerHTML = result;
    currentDescription = result; // Cập nhật biến để khi nhấn Copy sẽ copy luôn mã HTML này
}

/**
 * [YÊU CẦU ĐỀ BÀI]: ĐÁNH GIÁ ĐỘ TIỀM NĂNG MUA HÀNG & LÝ DO
 * Tích hợp lĩnh vực (Sales, CRM)
 */
async function evaluatePotential() {
    const apiKey = CONFIG.apiKey;
    const evalDiv = document.getElementById('evaluation');
    const evalResult = document.getElementById('evaluationResult');

    evalDiv.style.display = 'block';
    evalResult.innerHTML = '<em>Đang dùng AI phân tích tiềm năng theo chuyên ngành Sales/CRM...</em>';

    if (apiKey) {
        try {
            const prompt = `Bạn là chuyên gia Sales/CRM. Đánh giá độ tiềm năng mua hàng của mô tả sản phẩm này trên thang 10. Cung cấp điểm số và lý do ngắn gọn (tại sao thuyết phục hoặc chưa).

Mô tả: ${currentDescription}

Định dạng: "Điểm: X/10. Lý do: [ngắn gọn]."`;

            evalResult.innerHTML = await callAI(prompt, apiKey);
            return;
        } catch (error) {
            console.error("Lỗi AI đánh giá:", error);
            evalResult.innerHTML = `<span style="color: red;">Lỗi: ${error.message}</span>`;
        }
    }

    // Đánh giá fallback offline nếu không có key
    const length = currentDescription.length;
    const keywordCount = (currentDescription.match(/SEO|E-commerce|Sản phẩm|Mua hàng|Giá rẻ/gi) || []).length;
    let score = 7;
    if (length > 250) score += 1;
    if (keywordCount >= 2) score += 1;
    if (currentDescription.includes('Phiên bản 2')) score += 1;
    if (score > 10) score = 10;

    evalResult.innerHTML = `<strong>Điểm: ${score}/10. Lý do:</strong> Mô tả dài (${length} ký tự), chứa ${keywordCount} từ khóa, cấu trúc logic từ tính năng đến lợi ích, thuyết phục khách hàng mua hàng.`;
}

/**
 * Hàm gọi AI chung hỗ trợ cả Gemini & OpenAI
 */
async function callAI(prompt, apiKey) {
    if (!apiKey.startsWith('sk-')) {
        // --- CHẾ ĐỘ GOOGLE GEMINI ---
        const modelId = "gemini-flash-latest";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`;

        const payload = {
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000,
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': apiKey
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || "Lỗi Gemini API");
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } else {
        // --- CHẾ ĐỘ OPENAI ---
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: 'Bạn là chuyên gia về E-commerce và marketing, am hiểu về SEO và bán hàng trên Shopee.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Lỗi kết nối OpenAI API");
        }
        const data = await response.json();
        return data.choices[0].message.content;
    }
}

/**
 * Hàm dò tìm các model khả dụng cho Key của bạn
 */
async function debugAvailableModels() {
    const apiKey = CONFIG.apiKey;
    if (!apiKey || apiKey.startsWith('sk-')) return;
    try {
        console.log("Đang kiểm tra các model khả dụng cho Key của bạn...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        if (data.models) {
            const names = data.models.map(m => m.name.split('/').pop()).join('\n- ');
            alert("Thông tin quan trọng cho bạn:\n\nCác model khả dụng cho Key của bạn là:\n- " + names + "\n\nHãy chọn một tên trong danh sách này để điền vào mã nguồn.");
            console.log("Danh sách model:", data.models.map(m => m.name));
        } else {
            alert("Không tìm thấy model nào. Có thể Key này chưa được kích hoạt cho Generative AI.");
        }
    } catch (e) {
        console.error("Lỗi liệt kê model:", e);
    }
}


// --- CÁC HÀM PHỤ TRỢ (UI, Upload Ảnh, Counters) ---
function previewImage() {
    const file = document.getElementById('productImageFile').files[0] || document.getElementById('cameraFile').files[0];
    if (file) {
        const img = document.getElementById('imagePreview');
        img.src = URL.createObjectURL(file);
        img.style.display = 'block';
    }
}

function describeFromImage() { alert('Tích hợp AI Vision (Cần API)...'); }
function toggleFaqAnswer(button) { const answer = button.nextElementSibling; if (answer) answer.style.display = answer.style.display === 'block' ? 'none' : 'block'; }
function toggleUploadOptions() { const options = document.getElementById('uploadOptions'); options.style.display = options.style.display === 'none' ? 'block' : 'none'; }
function selectFromLibrary() { document.getElementById('productImageFile').click(); document.getElementById('uploadOptions').style.display = 'none'; }
function takePhoto() { document.getElementById('cameraFile').click(); document.getElementById('uploadOptions').style.display = 'none'; }
function selectFile() { document.getElementById('productImageFile').click(); document.getElementById('uploadOptions').style.display = 'none'; }

function animateCounters() {
    const counters = document.querySelectorAll('.counter-number');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        let current = 0; const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) { current = target; clearInterval(timer); }
            counter.innerText = target === 90 ? Math.floor(current) + '%' : Math.floor(current).toLocaleString();
        }, 20);
    });
}

window.addEventListener('load', function () {
    debugAvailableModels(); // Chạy dò tìm model ngay khi mở trang
    checkLoginStatus();
    animateCounters();
    checkFormCompletion();
    document.getElementById('generateBtn').addEventListener('click', generateDescription);
});

// --- LOGIN SYSTEM ---
function checkLoginStatus() {
    const user = sessionStorage.getItem('user');
    if (user) {
        document.getElementById('homepage').style.display = 'none';
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
    } else {
        document.getElementById('homepage').style.display = 'block';
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('mainContent').style.display = 'none';
    }
}

function showLoginFromHome() {
    document.getElementById('homepage').style.display = 'none';
    document.getElementById('loginSection').style.display = 'flex';
    document.getElementById('mainContent').style.display = 'none';
}

function showLogin() {
    document.querySelector('.signup-form').style.display = 'none';
    document.querySelector('.login-form').style.display = 'block';
}

function backToHome() {
    document.getElementById('homepage').style.display = 'block';
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('mainContent').style.display = 'none';
}

function showSignup() {
    document.querySelector('.login-form').style.display = 'none';
    document.querySelector('.signup-form').style.display = 'block';
}

function logout() {
    sessionStorage.removeItem('user');
    checkLoginStatus();
}

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Giả lập đăng nhập (thực tế cần backend)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        sessionStorage.setItem('user', JSON.stringify(user));
        checkLoginStatus();
    } else {
        alert('Email hoặc mật khẩu không đúng!');
    }
});

document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    // Giả lập đăng ký
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
        alert('Email đã tồn tại!');
        return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    sessionStorage.setItem('user', JSON.stringify(newUser));
    checkLoginStatus();
});

// --- PRODUCT MODAL ---
function openProductModal(title, description) {
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalDescription').innerText = description;
    document.getElementById('productModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

// --- ARROW KEY NAVIGATION ---
function setupArrowNavigation() {
    // Login form fields
    const loginFields = ['loginEmail', 'loginPassword'];

    // Signup form fields
    const signupFields = ['signupName', 'signupEmail', 'signupPassword'];

    // Product form fields
    const productFields = ['productName', 'features', 'benefits', 'seoKeywords', 'style'];

    // Function to handle arrow key navigation
    function handleArrowNavigation(event, fieldArray) {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            const currentIndex = fieldArray.indexOf(event.target.id);
            let nextIndex;

            if (event.key === 'ArrowDown') {
                nextIndex = (currentIndex + 1) % fieldArray.length;
            } else {
                nextIndex = (currentIndex - 1 + fieldArray.length) % fieldArray.length;
            }

            const nextField = document.getElementById(fieldArray[nextIndex]);
            if (nextField) {
                nextField.focus();
                // For select elements, we might want to open the dropdown
                if (nextField.tagName === 'SELECT') {
                    nextField.click();
                }
            }
        }
    }

    // Add event listeners to login fields
    loginFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('keydown', (event) => handleArrowNavigation(event, loginFields));
        }
    });

    // Add event listeners to signup fields
    signupFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('keydown', (event) => handleArrowNavigation(event, signupFields));
        }
    });

    // Add event listeners to product form fields
    productFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('keydown', (event) => handleArrowNavigation(event, productFields));
        }
    });
}

// Initialize arrow navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', setupArrowNavigation);
