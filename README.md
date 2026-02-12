# 👷 신권 안전 가이드 (Theocratic Safety Guide)

DC-82 및 S-283 표준을 기반으로 한 신권 건축 및 유지보수 작업을 위한 종합 안전 관리 웹 애플리케이션입니다. AI 기술(Gemini)을 활용하여 현장 위험 분석, 위험성 평가, 사고 보고서 생성을 지원하며 퀴즈를 통해 안전 지식을 점검할 수 있습니다.

## 🚀 주요 기능

### 1. 📊 대시보드 (Dashboard)
- **안전 사고 예방 핵심 요소**: 차트를 통해 안전 의식, 계획, 훈련, 장비의 중요도 시각화
- **위험성 감소 대책 (Hierarchy of Controls)**: 피라미드 형태의 대화형 UI로 위험 제거부터 PPE까지의 단계적 조치 학습

### 2. 🛡️ 기본 안전 표준 (Basic Safety)
- **대화형 PPE 선택기**: 부위별(머리, 눈, 귀, 손, 발) 필수 보호구 착용 지침 확인
- **개인 건강 및 위생**: 현장 투입 전 필수적인 건강 수칙 및 복장 가이드라인 제공

### 3. ⚠️ 고위험 작업 (High Risk)
- **사다리 4:1 법칙 계산기**: 사다리 높이에 따른 안전한 하단 거리 자동 계산
- **전기 안전 및 LOTO**: 에너지 차단 및 잠금 절차(Lock-Out Tag-Out) 지침 안내
- **고소 작업**: 1.8m 이상 작업 시 필수 추락 방지 수칙

### 4. 🏢 시설 유지보수 (Maintenance)
- **왕국회관 관리 지침**: S-283 문서를 기반으로 한 일반/야외, 청소/화학물질, 화재/전기 탭별 상세 지침

### 5. 📋 감독자 도구 (Overseer Tools) - *Gemini AI 기반*
- **📷 현장 위험 사진 분석**: 업로드한 사진에서 불안전 요소 식별 및 개선 권고 (Vision AI)
- **📝 스마트 위험성 평가**: 작업 설명을 입력하면 잠재적 위험과 대책 자동 제안
- **🎙️ TBM 오디오 브리핑**: 위험성 평가 결과를 바탕으로 현장 툴박스 미팅용 음성 스크립트 생성
- **📄 AI 사고 보고서 작성기**: 키워드 입력으로 S-283 형식의 공식 보고서 초안 자동 생성
- **✅ 계약 체크리스트**: 외부 업체 계약 시 필수 확인 사항 관리

### 6. 📝 안전 지식 퀴즈 (Safety Quiz)
- **20문항 정기 퀴즈**: DC-82 표준 기반의 고정 문항 퀴즈 (상세 해설 포함)
- **✨ AI 맞춤형 퀴즈**: 사용자가 입력한 특정 주제(예: '비계', '용접')로 새로운 퀴즈 5문항 즉석 생성

### 7. 💬 AI 안전 비서 (AI Assistant)
- 안전 가이드라인에 대한 궁금한 점을 대화형으로 질문하고 실시간 답변 수신

---

## 🛠️ 기술 스택
- **Frontend**: HTML5, Tailwind CSS, JavaScript (Vanilla JS/ES Module)
- **Libraries**: 
  - [Chart.js](https://www.chartjs.org/) (데이터 시각화)
  - [Tailwind CSS](https://tailwindcss.com/) (스타일링)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **AI Engine**: [Google Gemini API](https://ai.google.dev/) (2.0 Flash)

---

## 📦 설치 및 실행 방법

### 1. 프로젝트 클론
```bash
git clone [repository-url]
cd safety-quiz
```

### 2. 의존성 설치
```bash
npm install
```

### 3. API 키 설정
`js/app.js` 파일 내의 `apiKey` 변수에 본인의 Google AI Studio API 키를 입력합니다.
```javascript
const apiKey = "YOUR_GEMINI_API_KEY";
```

### 4. 개발 서버 실행
```bash
npm run dev
```

### 5. 빌드
```bash
npm run build
```

---

## 📂 프로젝트 구조
- `index.html`: 메인 애플리케이션 구조 및 UI 레이아웃
- `css/style.css`: 사용자 정의 스타일 및 애니메이션
- `js/app.js`: 애플리케이션 로직, 내비게이션, AI 연동, 퀴즈 엔진
- `js/quizData.js`: 20문항 기본 안전 퀴즈 데이터 및 해설
- `vite.config.js`: Vite 빌드 설정

---

## ⚖️ 면책 조항
이 도구는 신권 활동의 안전을 돕기 위한 보조 도구입니다. 모든 작업은 반드시 지역 지침 및 법적 규정을 준수해야 하며, 최종 결정은 자격 있는 감독자가 내려야 합니다.
