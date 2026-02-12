import { quizData } from './quizData.js';

window.navigate = navigate;
window.switchMaintenanceTab = switchMaintenanceTab;
window.startQuiz = startQuiz;
window.loadQuestion = loadQuestion;
window.selectAnswer = selectAnswer;
window.nextQuestion = nextQuestion;
window.calcLadder = calcLadder;
window.showPPE = showPPE;
window.analyzeImageWithAI = analyzeImageWithAI;
window.analyzeRiskWithAI = analyzeRiskWithAI;
window.generateSafetyReport = generateSafetyReport;
window.generateIncidentReport = generateIncidentReport;
window.sendChatMessage = sendChatMessage;
window.generateCustomQuiz = generateCustomQuiz;
window.toggleSidebar = toggleSidebar;
window.goBack = goBack;

// --- Navigation History ---
let navigationHistory = ['dashboard'];

// --- Sidebar Toggle Logic ---
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Toggle hidden for overlay display
    if (overlay.classList.contains('active')) {
        overlay.classList.remove('hidden');
    } else {
        setTimeout(() => {
            if (!overlay.classList.contains('active')) {
                overlay.classList.add('hidden');
            }
        }, 300);
    }
}

// --- Navigation Logic ---
function navigate(sectionId, isBack = false) {
    // Close sidebar on mobile after navigation
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar && sidebar.classList.contains('active')) {
        toggleSidebar();
    }

    // Update history
    if (!isBack) {
        if (navigationHistory[navigationHistory.length - 1] !== sectionId) {
            navigationHistory.push(sectionId);
        }
    }

    // Toggle Back Button visibility
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        if (navigationHistory.length > 1) {
            backBtn.classList.remove('hidden');
        } else {
            backBtn.classList.add('hidden');
        }
    }

    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
    
    document.querySelectorAll('#sidebar .nav-item').forEach(btn => {
        btn.classList.remove('bg-white', 'shadow-sm', 'text-blue-600', 'text-purple-600', 'text-emerald-600', 'font-bold');
        btn.classList.add('text-slate-600');
    });
    
    // Show custom gen UI if navigating to quiz section
    if (sectionId === 'quiz-section') {
        document.getElementById('quiz-custom-gen')?.classList.remove('hidden');
    }

    // Try to find matching nav item in sidebar
    const navItems = document.querySelectorAll('#sidebar .nav-item');
    navItems.forEach(btn => {
        // Simple heuristic: check if the onclick call contains the sectionId
        const onclickAttr = btn.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`'${sectionId}'`)) {
            btn.classList.remove('text-slate-600');
            btn.classList.add('bg-white', 'shadow-sm', 'font-bold');
            if (sectionId.includes('ai') || sectionId === 'overseer') btn.classList.add('text-purple-600');
            else if (sectionId === 'quiz-section') btn.classList.add('text-emerald-600');
            else btn.classList.add('text-blue-600');
        }
    });
}

function goBack() {
    if (navigationHistory.length > 1) {
        navigationHistory.pop(); // Remove current
        const previousSection = navigationHistory[navigationHistory.length - 1];
        navigate(previousSection, true);
    }
}

function switchMaintenanceTab(tabId) {
    // Hide all tab content
    document.querySelectorAll('.m-tab-content').forEach(el => el.classList.add('hidden'));
    // Show selected tab content
    document.getElementById(tabId).classList.remove('hidden');
    
    // Update tab button styles
    document.querySelectorAll('.m-tab').forEach(btn => {
        btn.classList.remove('text-blue-600', 'border-blue-600', 'border-b-2', 'font-bold');
        btn.classList.add('text-slate-500', 'font-medium');
    });
    
    const activeBtn = event.currentTarget;
    activeBtn.classList.remove('text-slate-500', 'font-medium');
    activeBtn.classList.add('text-blue-600', 'border-blue-600', 'border-b-2', 'font-bold');
}

// --- 20 Question Safety Quiz Logic ---
let currentQuestion = 0;
let score = 0;

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    document.getElementById('quiz-start').classList.add('hidden');
    document.getElementById('quiz-result').classList.add('hidden');
    document.getElementById('quiz-area').classList.remove('hidden');
    loadQuestion();
}

function loadQuestion() {
    const qData = quizData[currentQuestion];
    document.getElementById('quiz-progress-text').innerText = `문제 ${currentQuestion + 1} / ${quizData.length}`;
    document.getElementById('quiz-score-text').innerText = `점수: ${score * 5}`;
    document.getElementById('quiz-progress-bar').style.width = `${((currentQuestion) / quizData.length) * 100}%`;
    
    document.getElementById('quiz-question').innerText = qData.q;
    
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    
    qData.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option w-full text-left p-4 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 hover:border-emerald-300 transition-colors text-slate-700 font-medium shadow-sm';
        btn.innerText = `${index + 1}. ${opt}`;
        btn.onclick = () => selectAnswer(index, btn);
        optionsContainer.appendChild(btn);
    });

    document.getElementById('quiz-explanation-box').classList.add('hidden');
}

function selectAnswer(selectedIndex, btnElement) {
    // Disable all buttons
    const allBtns = document.querySelectorAll('.quiz-option');
    allBtns.forEach(b => b.onclick = null);

    const qData = quizData[currentQuestion];
    const isCorrect = selectedIndex === qData.answer;

    if (isCorrect) {
        btnElement.classList.replace('border-stone-200', 'border-emerald-500');
        btnElement.classList.replace('bg-white', 'bg-emerald-50');
        btnElement.classList.add('text-emerald-700');
        score++;
        document.getElementById('quiz-explanation-box').className = 'mt-6 p-4 rounded-lg border text-sm bg-emerald-50 border-emerald-200 fade-in';
        let expHtml = `<span class="text-emerald-700 font-bold">✅ 정답입니다!</span><br><br>`;
        if (qData.img) {
            expHtml += `<img src="${qData.img}" class="w-full h-48 object-cover rounded-lg mb-4 shadow-sm border border-emerald-100" alt="참고 이미지">`;
        }
        expHtml += qData.exp;
        document.getElementById('quiz-explanation-text').innerHTML = expHtml;
    } else {
        btnElement.classList.replace('border-stone-200', 'border-red-500');
        btnElement.classList.replace('bg-white', 'bg-red-50');
        btnElement.classList.add('text-red-700');
        
        // Highlight correct answer
        allBtns[qData.answer].classList.replace('border-stone-200', 'border-emerald-500');
        allBtns[qData.answer].classList.replace('bg-white', 'bg-emerald-50');
        
        document.getElementById('quiz-explanation-box').className = 'mt-6 p-4 rounded-lg border text-sm bg-red-50 border-red-200 fade-in';
        let expHtml = `<span class="text-red-700 font-bold">❌ 오답입니다.</span><br><span class="text-slate-600 mt-1 block mb-3">정답: ${qData.answer + 1}번</span>`;
        if (qData.img) {
            expHtml += `<img src="${qData.img}" class="w-full h-48 object-cover rounded-lg mb-4 shadow-sm border border-red-100" alt="참고 이미지">`;
        }
        expHtml += qData.exp;
        document.getElementById('quiz-explanation-text').innerHTML = expHtml;
    }

    // Update score text immediately
    document.getElementById('quiz-score-text').innerText = `점수: ${score * 5}`;
    document.getElementById('quiz-progress-bar').style.width = `${((currentQuestion + 1) / quizData.length) * 100}%`;

    // Change button text if last question
    if (currentQuestion === quizData.length - 1) {
        document.getElementById('quiz-next-btn').innerText = '결과 보기';
    } else {
        document.getElementById('quiz-next-btn').innerText = '다음 문제';
    }
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showQuizResult();
    }
}

function showQuizResult() {
    document.getElementById('quiz-area').classList.add('hidden');
    document.getElementById('quiz-result').classList.remove('hidden');
    
    const finalScore = score * 5; // 20 questions, 5 points each = 100
    document.getElementById('quiz-final-score').innerText = finalScore;
    
    const msgEl = document.getElementById('quiz-result-msg');
    const iconEl = document.getElementById('quiz-result-icon');
    
    if (finalScore === 100) {
        iconEl.innerText = '🌟';
        msgEl.innerText = '완벽합니다! 안전에 대한 모든 원칙을 잘 숙지하고 계십니다.';
        msgEl.className = 'text-emerald-600 font-bold mb-8';
    } else if (finalScore >= 80) {
        iconEl.innerText = '👍';
        msgEl.innerText = '훌륭합니다! 현장에서 안전하게 일할 준비가 되셨습니다.';
        msgEl.className = 'text-blue-600 font-bold mb-8';
    } else {
        iconEl.innerText = '📚';
        msgEl.innerText = '아쉽습니다. 현장에 투입되기 전 가이드라인을 다시 한번 꼼꼼히 복습해 주세요.';
        msgEl.className = 'text-amber-600 font-bold mb-8';
    }
}


// --- Gemini API Setup & AI Features ---
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_TEXT_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent";
const GEMINI_TTS_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent";


// --- AI Report Generator Logic ---
async function generateSafetyReport() {
    const keywords = document.getElementById('ai-report-keywords').value;
    if (!keywords) return alert("키워드를 입력해 주세요.");

    const loading = document.getElementById('ai-report-loading');
    const output = document.getElementById('ai-report-output');
    
    loading.classList.remove('hidden');
    output.classList.add('hidden');

    const prompt = `당신은 안전 관리 감독자입니다. 다음 키워드를 바탕으로 S-283 지침에 부합하는 공식적인 '사고/아차사고 보고서' 초안을 작성해 주세요.
    키워드: ${keywords}
    
    보고서 형식:
    1. 발생 개요 (일시, 장소, 사건 종류)
    2. 상세 내용 (어떤 일이 발생했는지 서술)
    3. 원인 분석 (직접적 원인 및 근본 원인)
    4. 예방 대책 (재발 방지를 위한 구체적 조치)
    
    전문적이고 격식 있는 한국어 문체로 작성해 주세요.`;

    try {
        if (!apiKey) throw new Error("API 키가 설정되지 않았습니다. .env 파일에 VITE_GEMINI_API_KEY를 설정해 주세요.");
        const response = await fetchWithRetry(`${GEMINI_TEXT_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        const text = response.candidates[0].content.parts[0].text;
        output.innerHTML = `<div class="prose prose-sm max-w-none">${marked.parse(text)}</div>`;
        output.classList.remove('hidden');
    } catch (error) {
        console.error("Report Generation Error:", error);
        alert(`보고서 생성 중 오류가 발생했습니다: ${error.message}`);
    } finally {
        loading.classList.add('hidden');
    }
}

// --- 4. Incident Report Generator (Updated for TO-5i) ---
async function generateIncidentReport() {
    const notes = document.getElementById('ai-incident-notes').value.trim();
    if (!notes) return alert("발생한 상황을 입력해주세요.");

    document.getElementById('ai-incident-loading').classList.remove('hidden');
    document.getElementById('ai-incident-output').classList.add('hidden');

    const prompt = `당신은 능숙한 현장 안전 관리자입니다. 아래 사용자가 입력한 상황 메모를 바탕으로 'TO-5i 위험 및 사고 보고서 지침'에 따라 보고서를 작성해 주세요.

[지침 핵심 사항]
1. '아차 사고(Near-Miss)'인 경우, TO-5i 11항에 따라 잠재적 피해 심각도를 '보통($5,000 이하)', '심각', '대형', '매우 중대' 중 하나로 평가하십시오.
2. '근본 원인' 분석 시, 단순히 '미끄러짐' 같은 초기 원인뿐 아니라 '바닥 물기 방치', '안전 교육 부족' 등 선행 사건을 포함하세요 (TO-5i 13항).
3. '예방 조처'는 구체적이고 실현 가능해야 합니다 (TO-5i 15항).

[보고서 양식]
1. 사고 개요 (일시, 장소, 유형: 부상/자산피해/아차사고)
2. 상세 내용 (6하 원칙에 의거한 상세 서술)
3. 아차 사고 심각도 평가 (해당 시)
4. 근본 원인 분석 (Root Cause)
5. 향후 예방 대책 (Safety Factor)
6. 조치 사항 (응급 처치, 보고 여부 등)

사용자 메모: ${notes}

전문적이고 명확한 한국어 보고서체로 작성해 주세요.`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3 }
    };

    try {
        if (!apiKey) throw new Error("API 키가 설정되지 않았습니다.");
        const result = await fetchWithRetry(`${GEMINI_TEXT_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const report = result.candidates[0].content.parts[0].text;
        // Simple formatting for bold text and parsing markdown
        const outputElement = document.getElementById('ai-incident-output');
        outputElement.innerHTML = marked.parse(report);
        
        document.getElementById('ai-incident-loading').classList.add('hidden');
        document.getElementById('ai-incident-output').classList.remove('hidden');
    } catch(e) {
        console.error(e);
        document.getElementById('ai-incident-loading').classList.add('hidden');
        alert("보고서 생성 중 오류가 발생했습니다.");
    }
}

// --- AI Customized Quiz Logic ---
async function generateCustomQuiz() {
    const topic = document.getElementById('quiz-topic-input').value;
    if (!topic) return alert("주제를 입력해 주세요.");

    const loading = document.getElementById('quiz-gen-loading');
    loading.classList.remove('hidden');

    const prompt = `안전 교육 전문가로서 "${topic}" 주제에 대한 4지 선다형 퀴즈 5문항을 생성해 주세요.
    결과는 반드시 아래의 JSON 배열 형식으로만 응답하세요. 다른 설명은 포함하지 마세요.
    
    형식:
    [
      {
        "q": "질문 내용",
        "options": ["보기1", "보기2", "보기3", "보기4"],
        "answer": 0,
        "exp": "정답에 대한 상세 설명 및 S-283/DC-82 관련 근거"
      }
    ]`;

    try {
        if (!apiKey) throw new Error("API 키가 설정되지 않았습니다. .env 파일에 VITE_GEMINI_API_KEY를 설정해 주세요.");
        const response = await fetchWithRetry(`${GEMINI_TEXT_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        
        let jsonText = response.candidates[0].content.parts[0].text;
        // Clean up markdown code blocks if the AI included them despite the config
        jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
        const newQuestions = JSON.parse(jsonText);
        
        // Replace current quiz data and start
        quizData.length = 0;
        newQuestions.forEach(q => quizData.push(q));
        
        startQuiz();
        // Hide the custom gen UI during quiz
        document.getElementById('quiz-custom-gen').classList.add('hidden');
    } catch (error) {
        console.error("Quiz Generation Error:", error);
        alert(`퀴즈 생성 중 오류가 발생했습니다: ${error.message}`);
    } finally {
        loading.classList.add('hidden');
    }
}

async function fetchWithRetry(url, options, retries = 5) {
    const delays = [1000, 2000, 4000, 8000, 16000];
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            
            if (!response.ok) {
                const errorMsg = data.error?.message || `HTTP error! status: ${response.status}`;
                throw new Error(errorMsg);
            }
            return data;
        } catch (e) {
            // 400 errors (like invalid API key) shouldn't be retried
            if (e.message.includes('400') || e.message.toLowerCase().includes('api key')) {
                throw e;
            }
            if (i === retries - 1) throw e;
            await new Promise(res => setTimeout(res, delays[i]));
        }
    }
}

// --- AI Vision, Risk Assessment, Chat functions ---
let currentImageBase64 = null;
document.getElementById('hazard-image')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    const labelText = document.getElementById('file-label-text');
    if (file) {
        if (labelText) labelText.innerText = "사진이 촬영(선택)되었습니다";
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = document.getElementById('image-preview');
            img.src = event.target.result;
            img.classList.remove('hidden');
            currentImageBase64 = event.target.result.split(',')[1];
            document.getElementById('btn-analyze-img').classList.remove('hidden');
            document.getElementById('ai-vision-output').classList.add('hidden');
        }
        reader.readAsDataURL(file);
    } else {
        if (labelText) labelText.innerText = "현장 사진 촬영 또는 선택";
    }
});

async function analyzeImageWithAI() { 
    if (!currentImageBase64) return;
    const loading = document.getElementById('ai-vision-loading');
    const output = document.getElementById('ai-vision-output');
    loading.classList.remove('hidden');
    output.classList.add('hidden');

    const prompt = "이 현장 사진에서 안전 위반 사항이나 위험 요소를 식별하고 권고 사항을 알려주세요. JSON 형식으로 'hazards'와 'recommendations' 배열을 응답하세요.";

    try {
        if (!apiKey) throw new Error("API 키가 설정되지 않았습니다. .env 파일에 VITE_GEMINI_API_KEY를 설정해 주세요.");
        const response = await fetchWithRetry(`${GEMINI_TEXT_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        { inline_data: { mime_type: "image/jpeg", data: currentImageBase64 } }
                    ]
                }]
            })
        });
        let jsonText = response.candidates[0].content.parts[0].text;
        jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(jsonText);
        
        const hazardList = document.getElementById('ai-vision-hazards');
        const recoList = document.getElementById('ai-vision-recommendations');
        hazardList.innerHTML = result.hazards.map(h => `<li>${h}</li>`).join('');
        recoList.innerHTML = result.recommendations.map(r => `<li>${r}</li>`).join('');
        
        output.classList.remove('hidden');
    } catch (e) {
        console.error("Image Analysis Error:", e);
        alert(`이미지 분석 중 오류 발생: ${e.message}`);
    } finally {
        loading.classList.add('hidden');
    }
}

async function analyzeRiskWithAI() {
    const task = document.getElementById('ai-risk-task').value;
    if (!task) return;
    const loading = document.getElementById('ai-risk-loading');
    const output = document.getElementById('ai-risk-output');
    loading.classList.remove('hidden');
    output.classList.add('hidden');

    const prompt = `작업: "${task}". 이 작업의 잠재적 위험 요소와 안전 대책을 한국어로 제안해 주세요. JSON 형식: { "hazards": [], "controls": [] }`;

    try {
        if (!apiKey) throw new Error("API 키가 설정되지 않았습니다. .env 파일에 VITE_GEMINI_API_KEY를 설정해 주세요.");
        const response = await fetchWithRetry(`${GEMINI_TEXT_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        let jsonText = response.candidates[0].content.parts[0].text;
        jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(jsonText);
        document.getElementById('ai-risk-hazards').innerHTML = result.hazards.map(h => `<li>${h}</li>`).join('');
        document.getElementById('ai-risk-controls').innerHTML = result.controls.map(c => `<li>${c}</li>`).join('');
        output.classList.remove('hidden');
    } catch (e) {
        console.error("Risk Assessment Error:", e);
        alert(`위험성 평가 중 오류 발생: ${e.message}`);
    } finally {
        loading.classList.add('hidden');
    }
}

function appendChatMessage(message, isUser = false) {
    const history = document.getElementById('chat-history');
    const div = document.createElement('div');
    div.className = "flex items-start gap-3 " + (isUser ? "flex-row-reverse" : "");
    div.innerHTML = `
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${isUser ? "bg-blue-100" : "bg-purple-100"}">${isUser ? "👤" : "✨"}</div>
        <div class="${isUser ? "bg-blue-600 text-white rounded-tr-none" : "bg-stone-50 border border-stone-200 rounded-tl-none"} rounded-lg p-3 text-sm max-w-[85%] ${isUser ? "" : "prose prose-sm max-w-none"}">${message}</div>
    `;
    history.appendChild(div);
    history.scrollTop = history.scrollHeight;
}

async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value;
    if (!msg) return;
    
    appendChatMessage(msg, true);
    input.value = "";

    const prompt = `당신은 '신권 안전 비서'입니다. DC-82 및 S-283 가이드라인을 바탕으로 다음 질문에 친절하고 전문적으로 답변해 주세요: ${msg}`;

    try {
        if (!apiKey) throw new Error("API 키가 설정되지 않았습니다. .env 파일에 VITE_GEMINI_API_KEY를 설정해 주세요.");
        const response = await fetchWithRetry(`${GEMINI_TEXT_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const text = response.candidates[0].content.parts[0].text;
        appendChatMessage(marked.parse(text), false);
    } catch (e) {
        console.error("Chat Error:", e);
        appendChatMessage(`죄송합니다. 오류가 발생했습니다: ${e.message}`);
    }
}

// Initial setup for existing interactive elements
window.addEventListener('load', () => {
    // Mobile Menu Button Event
    const menuBtn = document.getElementById('mobile-menu-btn');
    if (menuBtn) {
        menuBtn.onclick = toggleSidebar;
    }

    // Overlay click to close sidebar
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) {
        overlay.onclick = toggleSidebar;
    }

    const ctxCulture = document.getElementById('safetyCultureChart');
    if(ctxCulture) {
        new Chart(ctxCulture.getContext('2d'), {
            type: 'doughnut',
            data: { labels: ['안전 의식', '계획', '훈련', '장비 (PPE)'], datasets: [{ data: [40, 25, 20, 15], backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#6366f1'], borderWidth: 0 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 15 } } } }
        });
    }
    const pData = [{ level: '제거', color: '#1e3a8a', desc: '위험 요소를 물리적으로 제거 (최고 효과)' }, { level: '대체', color: '#1d4ed8', desc: '위험 요소를 덜 위험한 것으로 변경' }, { level: '공학적 대책', color: '#3b82f6', desc: '작업자를 위험 요소에서 물리적으로 분리' }, { level: '관리적 대책', color: '#60a5fa', desc: '작업 방식 변경, 교육 실시' }, { level: 'PPE', color: '#93c5fd', desc: '개인 보호구 착용 (최후의 수단)' }];
    const container = document.getElementById('risk-pyramid');
    if(container) {
        pData.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'pyramid-level w-full rounded shadow-sm text-xs sm:text-sm p-2 text-center';
            div.style.backgroundColor = item.color;
            div.style.width = (100 - (index * 15)) + '%';
            div.innerText = item.level;
            div.onclick = () => { document.getElementById('risk-detail-title').innerText = item.level; document.getElementById('risk-detail-desc').innerText = item.desc; document.getElementById('risk-detail').classList.remove('hidden'); document.getElementById('risk-detail').classList.add('fade-in'); };
            container.appendChild(div);
        });
    }
});

function calcLadder() { const h = parseFloat(document.getElementById('ladder-height').value); document.getElementById('ladder-result').innerText = h > 0 ? (h / 4).toFixed(2) + " m" : "0 m"; }

function showPPE(part) {
    const content = document.getElementById('ppe-content');
    const ppeData = {
        'head': { title: '머리 보호 (안전모)', desc: '낙하물, 충격, 전기 위험으로부터 머리를 보호합니다. 턱끈을 반드시 조이고, 균열이나 유효기간을 확인하십시오.' },
        'eye': { title: '눈 보호 (보안경)', desc: '파편, 먼지, 화학 물질로부터 눈을 보호합니다. 필요시 안면 가리개를 병행 사용하십시오.' },
        'ear': { title: '청력 보호 (귀마개/귀덮개)', desc: '지속적인 소음이나 큰 충격음으로부터 청력을 보호합니다. 올바른 착용법을 익히십시오.' },
        'hand': { title: '손 보호 (장갑)', desc: '작업 종류에 맞는 장갑(가죽, 고무, 절단 방지 등)을 선택하십시오. 회전 기계 작업 시에는 주의하십시오.' },
        'foot': { title: '발 보호 (안전화)', desc: '발가락 보호 캡이 있는 안전화를 착용하십시오. 미끄럼 방지 기능과 바닥 뚫림 방지 기능이 필수입니다.' }
    };
    
    if (ppeData[part]) {
        content.innerHTML = `
            <h4 class="text-xl font-bold text-slate-800 mb-2">${ppeData[part].title}</h4>
            <p class="text-slate-600">${ppeData[part].desc}</p>
            <button onclick="resetPPE()" class="mt-4 text-sm text-blue-600 font-bold hover:underline">← 뒤로 가기</button>
        `;
    }
}

function resetPPE() {
    document.getElementById('ppe-content').innerHTML = `
        <h4 class="text-xl font-bold text-slate-800 mb-2">보호 장비 선택</h4>
        <p class="text-slate-600">왼쪽의 인체 모형에서 부위를 선택하여 DC-82 표준에 따른 보호 장비 착용법을 확인하십시오.</p>
        <ul class="mt-4 space-y-2 list-disc list-inside text-slate-600">
            <li>장비는 항상 상태가 좋고 잘 맞아야 합니다.</li>
            <li>작업 위험 분석에 명시된 장비를 착용하십시오.</li>
        </ul>
    `;
}
