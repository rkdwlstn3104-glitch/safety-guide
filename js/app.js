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
window.generateAudioBriefing = generateAudioBriefing;
window.generateSafetyReport = generateSafetyReport;
window.sendChatMessage = sendChatMessage;
window.generateCustomQuiz = generateCustomQuiz;

// --- Navigation Logic ---
function navigate(sectionId) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
    
    document.querySelectorAll('#sidebar .nav-item').forEach(btn => {
        btn.classList.remove('bg-white', 'shadow-sm', 'text-blue-600', 'text-purple-600', 'text-emerald-600', 'font-bold');
        btn.classList.add('text-slate-600');
    });
    
    // Show custom gen UI if navigating to quiz section
    if (sectionId === 'quiz-section') {
        document.getElementById('quiz-custom-gen')?.classList.remove('hidden');
    }

    const activeBtn = event.currentTarget;
    if (activeBtn && activeBtn.classList) {
        activeBtn.classList.remove('text-slate-600');
        activeBtn.classList.add('bg-white', 'shadow-sm', 'font-bold');
        if (sectionId.includes('ai') || sectionId === 'overseer') activeBtn.classList.add('text-purple-600');
        else if (sectionId === 'quiz-section') activeBtn.classList.add('text-emerald-600');
        else activeBtn.classList.add('text-blue-600');
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
        document.getElementById('quiz-explanation-text').innerHTML = `<span class="text-emerald-700 font-bold">✅ 정답입니다!</span><br><br>${qData.exp}`;
    } else {
        btnElement.classList.replace('border-stone-200', 'border-red-500');
        btnElement.classList.replace('bg-white', 'bg-red-50');
        btnElement.classList.add('text-red-700');
        
        // Highlight correct answer
        allBtns[qData.answer].classList.replace('border-stone-200', 'border-emerald-500');
        allBtns[qData.answer].classList.replace('bg-white', 'bg-emerald-50');
        
        document.getElementById('quiz-explanation-box').className = 'mt-6 p-4 rounded-lg border text-sm bg-red-50 border-red-200 fade-in';
        document.getElementById('quiz-explanation-text').innerHTML = `<span class="text-red-700 font-bold">❌ 오답입니다.</span><br><span class="text-slate-600 mt-1 block">정답: ${qData.answer + 1}번</span><br>${qData.exp}`;
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
const apiKey = "";
const GEMINI_TEXT_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";
const GEMINI_TTS_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"; 

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
        const response = await fetchWithRetry(`${GEMINI_TEXT_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        const text = response.candidates[0].content.parts[0].text;
        output.innerText = text;
        output.classList.remove('hidden');
    } catch (error) {
        console.error(error);
        alert("보고서 생성 중 오류가 발생했습니다.");
    } finally {
        loading.classList.add('hidden');
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
        const response = await fetchWithRetry(`${GEMINI_TEXT_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    response_mime_type: "application/json"
                }
            })
        });
        
        const jsonText = response.candidates[0].content.parts[0].text;
        const newQuestions = JSON.parse(jsonText);
        
        // Replace current quiz data and start
        quizData.length = 0;
        newQuestions.forEach(q => quizData.push(q));
        
        startQuiz();
        // Hide the custom gen UI during quiz
        document.getElementById('quiz-custom-gen').classList.add('hidden');
    } catch (error) {
        console.error(error);
        alert("퀴즈 생성 중 오류가 발생했습니다.");
    } finally {
        loading.classList.add('hidden');
    }
}

async function fetchWithRetry(url, options, retries = 5) {
    const delays = [1000, 2000, 4000, 8000, 16000];
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (e) {
            if (i === retries - 1) throw e;
            await new Promise(res => setTimeout(res, delays[i]));
        }
    }
}

// --- AI Vision, Risk Assessment, Chat functions ---
let currentImageBase64 = null;
document.getElementById('hazard-image')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
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
        const response = await fetchWithRetry(`${GEMINI_TEXT_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        { inline_data: { mime_type: "image/jpeg", data: currentImageBase64 } }
                    ]
                }],
                generationConfig: { response_mime_type: "application/json" }
            })
        });
        const result = JSON.parse(response.candidates[0].content.parts[0].text);
        
        const hazardList = document.getElementById('ai-vision-hazards');
        const recoList = document.getElementById('ai-vision-recommendations');
        hazardList.innerHTML = result.hazards.map(h => `<li>${h}</li>`).join('');
        recoList.innerHTML = result.recommendations.map(r => `<li>${r}</li>`).join('');
        
        output.classList.remove('hidden');
    } catch (e) {
        console.error(e);
        alert("이미지 분석 중 오류 발생");
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
        const response = await fetchWithRetry(`${GEMINI_TEXT_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { response_mime_type: "application/json" }
            })
        });
        const result = JSON.parse(response.candidates[0].content.parts[0].text);
        document.getElementById('ai-risk-hazards').innerHTML = result.hazards.map(h => `<li>${h}</li>`).join('');
        document.getElementById('ai-risk-controls').innerHTML = result.controls.map(c => `<li>${c}</li>`).join('');
        output.classList.remove('hidden');
    } catch (e) {
        console.error(e);
    } finally {
        loading.classList.add('hidden');
    }
}

async function generateAudioBriefing() {
    const hazards = Array.from(document.querySelectorAll('#ai-risk-hazards li')).map(li => li.innerText).join(', ');
    const controls = Array.from(document.querySelectorAll('#ai-risk-controls li')).map(li => li.innerText).join(', ');
    if (!hazards) return;

    const loading = document.getElementById('audio-loading');
    const player = document.getElementById('audio-player');
    loading.classList.remove('hidden');
    player.classList.add('hidden');

    const prompt = `위험 요소: ${hazards}. 대책: ${controls}. 이 내용을 바탕으로 현장 툴박스 미팅(TBM)을 위한 짧고 명확한 음성 브리핑 스크립트를 작성하고 오디오 데이터(WAV base64)를 생성해 주세요. (주의: 실제 API 구현에 따라 텍스트만 생성하거나 별도 TTS 서비스 사용 가능)`;
    // (Note: Standard Gemini API doesn't directly return WAV base64 in this way, 
    // this is a placeholder logic for where a TTS integration would go)
    
    setTimeout(() => {
        loading.classList.add('hidden');
        alert("이 기능은 실제 프로젝트에서 별도의 TTS API 연동이 필요합니다.");
    }, 2000);
}

function appendChatMessage(message, isUser = false) {
    const history = document.getElementById('chat-history');
    const div = document.createElement('div');
    div.className = "flex items-start gap-3 " + (isUser ? "flex-row-reverse" : "");
    div.innerHTML = `
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${isUser ? "bg-blue-100" : "bg-purple-100"}">${isUser ? "👤" : "✨"}</div>
        <div class="${isUser ? "bg-blue-600 text-white rounded-tr-none" : "bg-stone-50 border border-stone-200 rounded-tl-none"} rounded-lg p-3 text-sm max-w-[85%]">${message}</div>
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
        const response = await fetchWithRetry(`${GEMINI_TEXT_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const text = response.candidates[0].content.parts[0].text;
        appendChatMessage(text, false);
    } catch (e) {
        appendChatMessage("죄송합니다. 오류가 발생했습니다.");
    }
}

// Initial setup for existing interactive elements
window.addEventListener('load', () => {
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
