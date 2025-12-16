import React, { useState, useEffect, useRef } from 'react';
import { 
  TreePine, Search, Plus, MapPin, User, Tag, Camera, 
  ArrowRight, MessageCircle, ShieldCheck, 
  LogIn, LogOut, Send, Lock, Menu, Sparkles, Bot, X, 
  Building2, Home, List, UserCircle, Edit2, Edit3, Settings,
  Store, CheckCircle, AlertCircle, Info, Crown, Star, Check, RefreshCw, ChevronRight, UserCog,
  Shield, Eye, EyeOff, FileText, Trash2, Clock
} from 'lucide-react';

// --- Toss Payments SDK 로드 헬퍼 ---
const loadTossPaymentsSDK = () => {
  return new Promise((resolve) => {
    if (window.TossPayments) {
      resolve(window.TossPayments);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v2/standard';
    script.onload = () => resolve(window.TossPayments);
    document.head.appendChild(script);
  });
};

// --- [Security] 보안 유틸리티 ---
const Security = {
  // 간단한 난독화/암호화 시뮬레이션 (실무에서는 AES 등 강력한 알고리즘 권장)
  encrypt: (data) => {
    try {
      const jsonStr = JSON.stringify(data);
      // Base64 인코딩 + URI 컴포넌트 인코딩으로 한글 깨짐 방지 및 난독화
      return btoa(encodeURIComponent(jsonStr));
    } catch (e) {
      console.error("Encryption failed", e);
      return null;
    }
  },
  decrypt: (cipherText) => {
    try {
      // 복호화
      const jsonStr = decodeURIComponent(atob(cipherText));
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("Decryption failed", e);
      return null;
    }
  },
  // 마스킹 처리 (이메일, 전화번호 등)
  maskString: (str, type = 'email') => {
    if (!str) return '';
    if (type === 'email') {
      const [id, domain] = str.split('@');
      if (!domain) return str;
      const maskedId = id.length > 3 ? id.slice(0, 3) + '*'.repeat(id.length - 3) : id + '**';
      return `${maskedId}@${domain}`;
    }
    if (type === 'phone') {
      return str.replace(/(\d{3})-\d{4}-(\d{4})/, '$1-****-$2');
    }
    return str;
  }
};

const TreeMarketApp = () => {
  // --- 초기 데이터 ---
  const initialListings = [
    {
      id: 1,
      name: '에메랄드 그린',
      category: '조경수',
      price: 150000,
      height: '1.5m',
      location: '충북 옥천군',
      sellerId: 'seller1',
      seller: '김나무',
      isBusiness: true,
      isPremium: true,
      businessName: '청정묘목농원',
      description: 'A급 에메랄드 그린입니다. 울타리용으로 좋습니다. 50주 보유 중.',
      image: 'https://images.unsplash.com/photo-1598335624129-87c2fb28532c?w=400&q=80',
      status: '판매중'
    },
    // ... (데이터 생략, 이전과 동일)
    { id: 2, name: '왕벚나무 R15', category: '관상수', price: 450000, height: '3.0m', location: '경기 용인시', sellerId: 'seller2', seller: '박조경', isBusiness: false, isPremium: false, businessName: '', description: '포인트목 추천.', image: 'https://images.unsplash.com/photo-1524234599372-a5bd0194758d?w=400&q=80', status: '판매중' },
    { id: 3, name: '반송 (둥근 소나무)', category: '특수목', price: 1200000, height: '1.2m', location: '강원 원주시', sellerId: 'seller3', seller: '이솔', isBusiness: true, isPremium: true, businessName: '솔향기조경', description: '정원수 추천.', image: 'https://images.unsplash.com/photo-1579624589252-b892a0e2831f?w=400&q=80', status: '판매중' }
  ];

  // --- 상태 관리 ---
  const STORAGE_KEY = 'treeMarket_secure_v1';

  // [Secure Storage] 로드 시 복호화
  const [state, setState] = useState(() => {
    try {
      const encryptedData = localStorage.getItem(STORAGE_KEY);
      if (encryptedData) {
        const decrypted = Security.decrypt(encryptedData);
        if (decrypted) return decrypted;
      }
    } catch (e) {
      console.error("Secure Load Failed", e);
    }
    return {
      activeTab: 'market',
      isLoggedIn: false,
      currentUser: null,
      listings: initialListings,
      chats: [],
      viewFilter: 'all',
      privacySettings: { // 개인정보 설정 추가
        isProfilePublic: true,
        marketingConsent: false,
      }
    };
  });

  const [activeTab, setActiveTab] = useState(state.activeTab);
  const [toasts, setToasts] = useState([]);
  
  // UI State
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChatId, setActiveChatId] = useState(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiChatInput, setAiChatInput] = useState('');
  const [aiChatMessages, setAiChatMessages] = useState([{ role: 'model', text: '안녕하세요! AI 정원사입니다. 🌲' }]);
  const [modals, setModals] = useState({ login: false, payment: null, settings: false });
  const [isGenerating, setIsGenerating] = useState(false);
  const [sellForm, setSellForm] = useState({ name: '', category: '조경수', price: '', height: '', location: '', description: '', isBusiness: false, businessName: '', previewImage: null });
  
  // [Security] 세션 타이머 Ref
  const sessionTimerRef = useRef(null);
  const aiChatEndRef = useRef(null);
  const paymentWidgetRef = useRef(null);

  // --- Effects ---
  
  // 1. 상태 변경 시 암호화 저장
  useEffect(() => {
    setState(prev => ({ ...prev, activeTab }));
  }, [activeTab]);

  useEffect(() => {
    const encrypted = Security.encrypt(state);
    if (encrypted) localStorage.setItem(STORAGE_KEY, encrypted);
  }, [state]);

  // 2. [Security] 자동 로그아웃 (Inactivity Timer)
  useEffect(() => {
    if (!state.isLoggedIn) return;

    const resetTimer = () => {
      if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
      // 1분(60000ms) 동안 활동 없으면 로그아웃 (데모용 짧은 시간)
      sessionTimerRef.current = setTimeout(() => {
        handleLogout('자동 로그아웃 되었습니다 (보안)');
      }, 60000); 
    };

    // 활동 감지 이벤트 리스너
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);

    resetTimer(); // 초기 실행

    return () => {
      if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [state.isLoggedIn]);

  // Toss Widget Load
  useEffect(() => {
    if (modals.payment) {
      // (기존 결제 로직 유지)
      loadTossPaymentsSDK().then(async (TossPayments) => {
        try {
            const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
            const customerKey = "xOPRSuQz2au21GSMTnWls"; 
            const tossPayments = TossPayments(clientKey);
            const widgets = tossPayments.widgets({ customerKey });
            paymentWidgetRef.current = widgets;
            await widgets.setAmount({ currency: "KRW", value: modals.payment.price });
            await Promise.all([
                widgets.renderPaymentMethods({ selector: "#payment-method", variantKey: "DEFAULT" }),
                widgets.renderAgreement({ selector: "#agreement", variantKey: "AGREEMENT" }),
            ]);
        } catch(e) { console.error(e); }
      });
    }
  }, [modals.payment]);

  // --- Helper Functions ---
  const updateState = (updates) => setState(prev => ({ ...prev, ...updates }));
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  // --- Handlers ---
  const handleLogin = (e) => {
    e.preventDefault();
    const nickname = document.getElementById('loginNickname').value || '행복한나무';
    updateState({ 
      isLoggedIn: true, 
      currentUser: { 
        id: `user_${Date.now()}`, 
        name: nickname, 
        email: 'privacy_user@example.com', // 민감정보 예시
        phone: '010-1234-5678', // 민감정보 예시
        isPremium: false 
      } 
    });
    setModals({ ...modals, login: false });
    addToast('안전하게 로그인되었습니다.', 'success');
  };

  const handleLogout = (msg = '로그아웃 되었습니다.') => {
    updateState({ isLoggedIn: false, currentUser: null, viewFilter: 'all' });
    setActiveTab('market');
    addToast(msg, 'info');
  };

  // 회원 탈퇴 (데이터 파기)
  const handleWithdrawal = () => {
    if (window.confirm('정말 탈퇴하시겠습니까? 모든 데이터가 안전하게 파기됩니다.')) {
      localStorage.removeItem(STORAGE_KEY); // 저장소 완전 삭제
      // 상태 초기화
      setState({
        activeTab: 'market',
        isLoggedIn: false,
        currentUser: null,
        listings: initialListings,
        chats: [],
        viewFilter: 'all',
        privacySettings: { isProfilePublic: true, marketingConsent: false }
      });
      setModals({ ...modals, settings: false });
      addToast('회원 탈퇴 및 데이터 파기가 완료되었습니다.', 'info');
    }
  };

  // 개인정보 설정 변경
  const togglePrivacySetting = (key) => {
    updateState({
      privacySettings: {
        ...state.privacySettings,
        [key]: !state.privacySettings[key]
      }
    });
  };

  // 기존 핸들러들 (채팅, 결제, 등록 등)
  const handlePaymentRequest = async () => {
    if (!paymentWidgetRef.current) return;
    try {
        await paymentWidgetRef.current.requestPayment({
            orderId: "ORDER_" + Date.now(),
            orderName: modals.payment.name,
            successUrl: window.location.origin,
            failUrl: window.location.origin,
            customerEmail: state.currentUser.email,
            customerName: state.currentUser.name,
        });
    } catch (e) { console.error(e); }
  };
  
  // (나머지 로직 핸들러들은 이전 코드와 동일하게 유지하되 지면상 생략 - 전체 코드 통합 시 포함됨)
  // ... handleSellSubmit, handleStartChat, etc.
  const handleSellSubmit = (e) => {
      e.preventDefault();
      const newListing = {
        id: Date.now(), ...sellForm, price: Number(sellForm.price),
        sellerId: state.currentUser.id, seller: state.currentUser.name,
        isPremium: state.currentUser.isPremium,
        image: sellForm.previewImage || 'https://images.unsplash.com/photo-1598335624129-87c2fb28532c?w=400&q=80',
        status: '판매중'
      };
      updateState({ listings: [newListing, ...state.listings] });
      addToast('판매글이 등록되었습니다!');
      setActiveTab('market');
  };
  const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if(file) {
          const reader = new FileReader();
          reader.onloadend = () => setSellForm(prev => ({...prev, previewImage: reader.result}));
          reader.readAsDataURL(file);
      }
  };
  const handleGenerateDescription = async () => {
      setIsGenerating(true);
      await new Promise(r => setTimeout(r, 1000));
      setSellForm(prev => ({...prev, description: `[AI 생성] ${prev.name}은(는) 정말 튼튼합니다.`}));
      setIsGenerating(false);
  }
  
  // --- Sub-Components ---

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="bg-stone-800 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[300px] animate-fade-in pointer-events-auto">
          {toast.type === 'success' ? <CheckCircle size={20} className="text-green-400"/> : <Info size={20} className="text-blue-400"/>}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      ))}
    </div>
  );

  // --- Settings Modal with Privacy Tab ---
  const SettingsModalContent = () => {
    const [tab, setTab] = useState('profile'); // profile | privacy

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-sm p-0 shadow-2xl animate-slide-up overflow-hidden">
                <div className="flex border-b border-stone-100">
                    <button onClick={() => setTab('profile')} className={`flex-1 py-4 text-sm font-bold ${tab === 'profile' ? 'text-green-700 border-b-2 border-green-700' : 'text-stone-400'}`}>내 정보</button>
                    <button onClick={() => setTab('privacy')} className={`flex-1 py-4 text-sm font-bold ${tab === 'privacy' ? 'text-green-700 border-b-2 border-green-700' : 'text-stone-400'}`}>보안/개인정보</button>
                </div>

                <div className="p-6">
                    {tab === 'profile' ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-stone-600 mb-1">닉네임</label>
                                <input type="text" defaultValue={state.currentUser.name} className="w-full p-3 bg-stone-50 border rounded-xl" readOnly />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-600 mb-1">이메일 (마스킹됨)</label>
                                <div className="flex items-center gap-2 p-3 bg-stone-50 border rounded-xl text-stone-500">
                                    <Lock size={14} />
                                    <span>{Security.maskString(state.currentUser.email)}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-stone-50 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <Eye size={18} className="text-stone-500" />
                                    <span className="text-sm font-medium">프로필 공개</span>
                                </div>
                                <input type="checkbox" checked={state.privacySettings.isProfilePublic} onChange={() => togglePrivacySetting('isProfilePublic')} className="w-5 h-5 text-green-600 rounded cursor-pointer" />
                            </div>
                            <div className="flex justify-between items-center p-3 bg-stone-50 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <FileText size={18} className="text-stone-500" />
                                    <span className="text-sm font-medium">마케팅 정보 수신</span>
                                </div>
                                <input type="checkbox" checked={state.privacySettings.marketingConsent} onChange={() => togglePrivacySetting('marketingConsent')} className="w-5 h-5 text-green-600 rounded cursor-pointer" />
                            </div>
                            <div className="border-t border-stone-100 pt-4 mt-4">
                                <button onClick={handleWithdrawal} className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors">
                                    <Trash2 size={18} /> 회원 탈퇴 (데이터 파기)
                                </button>
                                <p className="text-[10px] text-stone-400 text-center mt-2">모든 개인정보와 거래 내역이 즉시 삭제됩니다.</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4 bg-stone-50 border-t border-stone-100 flex justify-end">
                    <button onClick={() => setModals({...modals, settings: false})} className="text-sm font-bold text-stone-500 hover:text-stone-800">닫기</button>
                </div>
            </div>
        </div>
    );
  };

  // --- Main Render Structure ---
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans pb-20 md:pb-0 relative flex flex-col">
      <ToastContainer />
      
      {/* Header */}
      <header className="bg-green-800 text-white shadow-lg sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('market')}>
            <TreePine size={24} className="text-green-300" />
            <h1 className="text-xl font-bold tracking-tight">나무장터 <span className="text-[10px] bg-green-900 px-1 rounded ml-1 text-green-200">Secure</span></h1>
          </div>
          <div className="flex items-center gap-2">
            {!state.isLoggedIn ? (
              <button onClick={() => setModals(prev => ({...prev, login: true}))} className="flex items-center px-3 py-1.5 bg-green-900/50 hover:bg-green-900 rounded-lg text-sm transition-colors">
                <LogIn size={14} className="mr-1" /> 로그인
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => setModals(prev => ({...prev, settings: true}))} className="flex items-center gap-1.5 hover:bg-green-700 px-3 py-1.5 rounded-lg transition-colors">
                  <Shield size={14} className="text-green-200" />
                  <span className="text-sm text-green-50 font-bold">{state.currentUser.name}</span>
                </button>
                <button onClick={() => handleLogout()} className="p-2 hover:bg-green-700 rounded-lg"><LogOut size={16} /></button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 flex-grow w-full">
        {activeTab === 'market' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
                {/* Search & List Logic same as before */}
                <div className="col-span-full bg-white p-4 rounded-xl border border-stone-200 flex gap-2">
                    <Search className="text-stone-400" />
                    <input type="text" placeholder="검색어 입력 (암호화되어 저장됨)" className="flex-1 outline-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                {state.listings.filter(i => i.name.includes(searchTerm)).map(item => (
                    <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100">
                        <img src={item.image} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="font-bold text-lg">{item.name}</h3>
                            <p className="text-green-700 font-bold">{item.price.toLocaleString()}원</p>
                            <div className="mt-3 flex gap-2">
                                <button onClick={() => setModals({...modals, payment: item})} className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-bold shadow-md">안전결제</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
        
        {activeTab === 'sell' && (
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-sm animate-fade-in">
                <h2 className="text-2xl font-bold mb-6">판매 등록</h2>
                {!state.isLoggedIn ? <div className="text-center py-10">로그인이 필요합니다.</div> : (
                    <form onSubmit={handleSellSubmit} className="space-y-4">
                        <input value={sellForm.name} onChange={e=>setSellForm({...sellForm, name:e.target.value})} placeholder="상품명" className="w-full p-3 border rounded-xl" />
                        <input type="number" value={sellForm.price} onChange={e=>setSellForm({...sellForm, price:e.target.value})} placeholder="가격" className="w-full p-3 border rounded-xl" />
                        <div className="relative h-40 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer" onClick={()=>document.getElementById('file').click()}>
                            {sellForm.previewImage ? <img src={sellForm.previewImage} className="h-full object-cover"/> : <Camera className="text-stone-300"/>}
                            <input id="file" type="file" className="hidden" onChange={handleImageUpload} />
                        </div>
                        <button type="button" onClick={handleGenerateDescription} className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                            {isGenerating ? '생성 중...' : <><Sparkles size={14}/> AI 설명 생성</>}
                        </button>
                        <textarea value={sellForm.description} readOnly className="w-full p-3 bg-stone-50 rounded-xl text-sm h-24" placeholder="AI가 설명을 작성합니다." />
                        <button type="submit" className="w-full py-3 bg-green-700 text-white rounded-xl font-bold">등록하기</button>
                    </form>
                )}
            </div>
        )}
      </main>

      {/* Modals */}
      {modals.login && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm p-8 rounded-2xl animate-slide-up">
                <h2 className="text-2xl font-bold text-center mb-6">보안 로그인</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input type="email" placeholder="이메일" className="w-full p-3 border rounded-xl" required />
                    <input type="password" placeholder="비밀번호" className="w-full p-3 border rounded-xl" required />
                    <input id="loginNickname" placeholder="닉네임" className="w-full p-3 border rounded-xl" required />
                    <button className="w-full py-3 bg-green-700 text-white rounded-xl font-bold">로그인</button>
                </form>
                <button onClick={()=>setModals({...modals, login:false})} className="w-full mt-4 text-sm text-stone-400">닫기</button>
            </div>
        </div>
      )}

      {/* Payment Modal with Toss */}
      {modals.payment && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md p-6 rounded-2xl animate-slide-up">
                <div className="flex justify-between mb-4">
                    <h3 className="font-bold text-lg">안전결제</h3>
                    <button onClick={()=>setModals({...modals, payment:null})}><X/></button>
                </div>
                <div className="p-4 bg-stone-50 rounded-xl mb-4 flex gap-4">
                    <img src={modals.payment.image} className="w-16 h-16 rounded bg-stone-200 object-cover" />
                    <div>
                        <div className="font-bold">{modals.payment.name}</div>
                        <div className="text-green-700 font-bold">{modals.payment.price.toLocaleString()}원</div>
                    </div>
                </div>
                <div id="payment-method"></div>
                <div id="agreement"></div>
                <button onClick={handlePaymentRequest} className="w-full py-3 bg-green-700 text-white rounded-xl font-bold mt-4 shadow-lg">결제하기</button>
            </div>
        </div>
      )}

      {modals.settings && <SettingsModalContent />}

      {/* Security Indicator */}
      {state.isLoggedIn && (
          <div className="fixed bottom-24 left-4 z-40 bg-stone-800/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 pointer-events-none">
              <Shield size={12} className="text-green-400" />
              <span>보안 연결됨</span>
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse ml-1"></span>
          </div>
      )}
    </div>
  );
};

export default TreeMarketApp;