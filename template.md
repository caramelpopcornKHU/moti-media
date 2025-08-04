import React, { useState } from 'react';
import { ChevronRight, Code, Palette, Dumbbell, Target, Calendar, Users, MessageCircle, Heart, CheckCircle, Edit3 } from 'lucide-react';

const ProjectTemplateFlow = () => {
  const [step, setStep] = useState(1);
  const [selectedProfession, setSelectedProfession] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [projectData, setProjectData] = useState({
    title: '',
    duration: '',
    goals: [],
    checklist: []
  });

  // 직업군별 데이터
  const professions = {
    developer: {
      name: '개발자',
      icon: Code,
      color: 'blue',
      categories: [
        { id: 'app', name: '앱 개발', desc: '모바일 앱 프로젝트' },
        { id: 'web', name: '웹 서비스 개발', desc: '웹사이트/서비스 구축' },
        { id: 'opensource', name: '오픈소스 기여', desc: 'GitHub 프로젝트 참여' },
        { id: 'algorithm', name: '알고리즘 공부', desc: 'PS/코테 준비' },
        { id: 'sideproject', name: '사이드 프로젝트', desc: '팀 협업 프로젝트' },
        { id: 'portfolio', name: '포트폴리오 제작', desc: '개발자 포트폴리오' },
        { id: 'ai', name: 'AI/머신러닝', desc: 'AI 모델 개발' },
        { id: 'backend', name: '백엔드 개선', desc: '서버/DB 최적화' }
      ]
    },
    designer: {
      name: '디자이너',
      icon: Palette,
      color: 'purple',
      categories: [
        { id: 'brand', name: '브랜드 아이덴티티', desc: '로고/브랜딩 작업' },
        { id: 'ui', name: '앱/웹 UI 디자인', desc: 'UI/UX 디자인' },
        { id: 'portfolio', name: '포트폴리오 리디자인', desc: '개인 포트폴리o 갱신' },
        { id: 'exhibition', name: '전시/아트워크', desc: '작품 전시 준비' },
        { id: 'client', name: '클라이언트 프로젝트', desc: '의뢰 작업 관리' },
        { id: 'research', name: 'UX 리서치', desc: '사용자 조사/분석' }
      ]
    },
    athlete: {
      name: '운동선수',
      icon: Dumbbell,
      color: 'green',
      categories: [
        { id: 'competition', name: '대회 준비', desc: '경기/시합 대비' },
        { id: 'routine', name: '루틴 형성', desc: '체력/훈련 관리' },
        { id: 'diet', name: '다이어트 기록', desc: '체중/식단 관리' },
        { id: 'recovery', name: '재활 프로그램', desc: '부상 회복/예방' },
        { id: 'nutrition', name: '식단/영양', desc: '영양 관리 계획' },
        { id: 'team', name: '팀 훈련 관리', desc: '단체 훈련 기록' }
      ]
    }
  };

  // 템플릿 데이터
  const templates = {
    'developer-app': {
      title: '앱 개발 프로젝트',
      goals: [
        '기획 및 요구사항 정의 완료',
        '디자인 시안 확보',
        '프론트엔드 MVP 구현',
        '백엔드 API 연동 및 DB 설계',
        '첫 사용자 테스트 진행 및 피드백 반영'
      ],
      checklist: [
        'Notion으로 요구사항 정리 완료',
        'Figma 시안 확정',
        '로그인/회원가입 기능 구현',
        'Axios 기반 API 연결',
        'Supabase로 DB 설계',
        'Flutter 빌드 오류 수정',
        '구글 플레이 배포 준비',
        '베타 피드백 회고 작성'
      ]
    },
    'designer-brand': {
      title: '브랜드 아이덴티티 제작',
      goals: [
        '타겟/경쟁사 리서치',
        '컨셉보드 및 무드보드 완성',
        '로고 디자인 & 타이포 실험',
        '컬러 시스템 & 패턴 구성',
        '최종 시안 및 모의 적용 완료'
      ],
      checklist: [
        '3개 브랜드 리서치',
        'Adobe XD / Figma에 무드보드 정리',
        '로고 1차안 리뷰받기',
        '브랜드 가이드라인 PDF 제작',
        'Mockup 이미지로 프리젠테이션 시트 제작'
      ]
    },
    'athlete-competition': {
      title: '대회 준비 프로젝트',
      goals: [
        '루틴 설계 및 주간 플랜 수립',
        '기초 체력 테스트 기록',
        '기술 훈련 집중 기간 설정',
        '식단/수면/회복 모니터링',
        '사전 모의 대회 결과 분석'
      ],
      checklist: [
        '오전 웨이트 루틴 확정',
        '탄수 중심 식단 1주간 유지',
        '잠 7시간 이상 목표',
        '경기 영상 분석 3건',
        '일일 피로도 자가점검 완료'
      ]
    }
  };

  const handleProfessionSelect = (professionKey) => {
    setSelectedProfession(professionKey);
    setStep(2);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    const templateKey = `${selectedProfession}-${categoryId}`;
    const template = templates[templateKey];
    if (template) {
      setProjectData({
        title: template.title,
        duration: '4주',
        goals: template.goals,
        checklist: template.checklist
      });
    }
    setStep(3);
  };

  const currentProfession = professions[selectedProfession];
  const currentCategory = currentProfession?.categories.find(c => c.id === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">새 프로젝트 만들기</h1>
        <div className="flex items-center text-sm text-gray-500">
          <span className={`px-2 py-1 rounded ${step >= 1 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}>
            1. 직업군 선택
          </span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className={`px-2 py-1 rounded ${step >= 2 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}>
            2. 카테고리 선택
          </span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className={`px-2 py-1 rounded ${step >= 3 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}>
            3. 템플릿 설정
          </span>
        </div>
      </div>

      {/* Step 1: 직업군 선택 */}
      {step === 1 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">당신은 어떤 사람인가요?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(professions).map(([key, profession]) => {
              const IconComponent = profession.icon;
              return (
                <button
                  key={key}
                  onClick={() => handleProfessionSelect(key)}
                  className={`p-6 border-2 rounded-lg hover:border-${profession.color}-500 hover:bg-${profession.color}-50 transition-all`}
                >
                  <IconComponent className={`w-12 h-12 text-${profession.color}-500 mx-auto mb-3`} />
                  <h3 className="font-semibold text-lg">{profession.name}</h3>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2: 카테고리 선택 */}
      {step === 2 && currentProfession && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => setStep(1)}
              className="text-blue-600 hover:text-blue-800 mr-4"
            >
              ← 뒤로
            </button>
            <h2 className="text-xl font-semibold">
              {currentProfession.name} 프로젝트 유형을 선택하세요
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentProfession.categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left transition-all"
              >
                <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm">{category.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: 템플릿 설정 */}
      {step === 3 && projectData.title && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <button 
                onClick={() => setStep(2)}
                className="text-blue-600 hover:text-blue-800 mr-4"
              >
                ← 뒤로
              </button>
              <h2 className="text-xl font-semibold">
                {projectData.title} 프로젝트를 시작하시겠어요?
              </h2>
            </div>

            {/* 프로젝트 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">프로젝트 제목</label>
                <input
                  type="text"
                  value={projectData.title}
                  onChange={(e) => setProjectData({...projectData, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">예상 기간</label>
                <select
                  value={projectData.duration}
                  onChange={(e) => setProjectData({...projectData, duration: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="2주">2주</option>
                  <option value="4주">4주</option>
                  <option value="8주">8주</option>
                  <option value="3개월">3개월</option>
                  <option value="6개월">6개월</option>
                </select>
              </div>
            </div>

            {/* 목표 템플릿 */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <Target className="w-5 h-5 text-blue-500 mr-2" />
                <h3 className="font-semibold">추천 목표 (수정 가능)</h3>
                <Edit3 className="w-4 h-4 text-gray-400 ml-2" />
              </div>
              <div className="space-y-2">
                {projectData.goals.map((goal, index) => (
                  <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => {
                        const newGoals = [...projectData.goals];
                        newGoals[index] = e.target.value;
                        setProjectData({...projectData, goals: newGoals});
                      }}
                      className="flex-1 bg-transparent border-none outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 체크리스트 템플릿 */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">세부 체크리스트</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {projectData.checklist.map((item, index) => (
                  <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 생성 버튼 */}
            <div className="flex justify-end">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                프로젝트 시작하기
              </button>
            </div>
          </div>

          {/* 완성 예시 미리보기 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-4">완성된 프로젝트 페이지 미리보기</h3>
            <ProjectPreview 
              profession={selectedProfession}
              category={selectedCategory}
              title={projectData.title}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// 완성된 프로젝트 미리보기 컴포넌트
const ProjectPreview = ({ profession, category, title }) => {
  const examples = {
    'developer-app': {
      title: '습관 추적기 앱 개발',
      period: '2025.08.01 ~ 2025.08.28',
      goal: 'MVP 완성 및 베타 사용자 10명 확보',
      progress: '6 / 8 (75%)',
      records: 12,
      likes: 24,
      comments: 5,
      tools: ['Vue', 'Supabase', 'Figma']
    },
    'designer-brand': {
      title: 'MOOD.SPACE 브랜드 리디자인',
      period: '2025.07.15 ~ 2025.08.15',
      goal: '신규 로고 및 브랜드 가이드라인 완성',
      progress: '5 / 6 (83%)',
      records: 9,
      likes: 31,
      comments: 7,
      tools: ['Figma', 'Adobe Illustrator']
    },
    'athlete-competition': {
      title: '전국체전 준비 - 레슬링 65kg급',
      period: '2025.06.01 ~ 2025.10.01',
      goal: '경기 전 루틴 & 멘탈관리 완료',
      progress: '7 / 10 (70%)',
      records: 28,
      likes: 57,
      comments: 12,
      tools: ['루틴 앱', '수면 기록기', '인바디 체크']
    }
  };

  const example = examples[`${profession}-${category}`] || examples['developer-app'];

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="font-bold text-lg mb-2">📌 {example.title}</h4>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <strong>기간:</strong> {example.period}
            </div>
            <div>
              <strong>목표:</strong> {example.goal}
            </div>
            <div>
              <strong>진행률:</strong> <span className="text-blue-600 font-semibold">{example.progress}</span>
            </div>
            <div>
              <strong>기록 수:</strong> {example.records}개
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between border-t pt-3">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Heart className="w-4 h-4 mr-1" />
            {example.likes}
          </div>
          <div className="flex items-center">
            <MessageCircle className="w-4 h-4 mr-1" />
            {example.comments}
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {example.tools.map((tool, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
              {tool}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectTemplateFlow;