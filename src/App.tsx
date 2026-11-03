import React, { useState } from 'react';
import { 
  Minus, 
  Square, 
  X, 
  RotateCw, 
  Plus, 
  Settings as SettingsIcon, 
  LogOut, 
  ExternalLink,
  ShieldAlert,
  Key,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Play,
  Search,
  MoreVertical,
  Copy,
  Trash2
} from 'lucide-react';

interface Account {
  id: string;
  initial: string;
  name: string;
  server: string;
  level: number;
  instanceId: string;
  status: 'running' | 'idle';
  licenseKey: string;
  expiryDate: string;
  daysLeft: number;
}

const INITIAL_ACCOUNTS: Account[] = [
  {
    id: '1',
    initial: 'M',
    name: 'Măng Mãng',
    server: 'S627',
    level: 34,
    instanceId: '**** -7E73',
    status: 'running',
    licenseKey: 'LZ-8A19-9B2C-1002-7E73',
    expiryDate: '24/11/2026',
    daysLeft: 21
  },
  {
    id: '2',
    initial: '백',
    name: '백수 farm 6',
    server: 'S627',
    level: 20,
    instanceId: '**** -B45A',
    status: 'idle',
    licenseKey: 'LZ-E5A8-8B3C-4B01-1652-B45A',
    expiryDate: '06/11/2026',
    daysLeft: 3 // Kích hoạt Badge đỏ "Còn 3 ngày" khi hạn key dưới 3 ngày
  },
  {
    id: '3',
    initial: '백',
    name: '백수 farm 4',
    server: 'S627',
    level: 20,
    instanceId: '**** -4DD6',
    status: 'idle',
    licenseKey: 'LZ-7F32-1A09-8812-4DD6',
    expiryDate: '05/11/2026',
    daysLeft: 2 // Kích hoạt Badge đỏ "Còn 2 ngày"
  },
  {
    id: '4',
    initial: '백',
    name: '백수 farm 3',
    server: 'S627',
    level: 27,
    instanceId: '**** -17EA',
    status: 'idle',
    licenseKey: 'LZ-2201-44B9-93C0-17EA',
    expiryDate: '21/11/2026',
    daysLeft: 18
  }
];

export default function App() {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('2');
  const [inputKey, setInputKey] = useState<string>('LZ-E5A8-8B3C-4B01-1652-B45A');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showBuyKeyModal, setShowBuyKeyModal] = useState(false);
  const [showDeleteAutoModal, setShowDeleteAutoModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // New account form state
  const [newAccName, setNewAccName] = useState('');
  const [newAccServer, setNewAccServer] = useState('S627');
  const [newAccLevel, setNewAccLevel] = useState(20);
  const [newAccId, setNewAccId] = useState('**** -9B1C');
  const [newAccLicenseKey, setNewAccLicenseKey] = useState('LZ-9B1C-3A4D-7E88-9B1C');
  const [newAccDaysLeft, setNewAccDaysLeft] = useState(30);

  // License data exactly matching original
  const [userEmail, setUserEmail] = useState('hacklanhuc150@gmail.com');
  const [expiryDate, setExpiryDate] = useState('24/11/2026 15:50');

  // Automation settings state (exact match to image_a031f484.png)
  const [autoRestartEnabled, setAutoRestartEnabled] = useState(true);
  const [autoRestartTime, setAutoRestartTime] = useState('09:00');
  const [scheduleStartTime, setScheduleStartTime] = useState('00:00');
  const [scheduleEndTime, setScheduleEndTime] = useState('23:59');

  // Modal editing buffer
  const [modalRestartEnabled, setModalRestartEnabled] = useState(true);
  const [modalRestartTime, setModalRestartTime] = useState('09:00');
  const [modalScheduleStart, setModalScheduleStart] = useState('00:00');
  const [modalScheduleEnd, setModalScheduleEnd] = useState('23:59');

  const openSettingsModal = () => {
    setModalRestartEnabled(autoRestartEnabled);
    setModalRestartTime(autoRestartTime);
    setModalScheduleStart(scheduleStartTime);
    setModalScheduleEnd(scheduleEndTime);
    setShowSettingsModal(true);
  };

  const handleSaveSettings = () => {
    setAutoRestartEnabled(modalRestartEnabled);
    setAutoRestartTime(modalRestartTime);
    setScheduleStartTime(modalScheduleStart);
    setScheduleEndTime(modalScheduleEnd);
    setShowSettingsModal(false);
    triggerToast('Đã lưu cài đặt!');
  };

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const currentAccount = accounts.find(a => a.id === selectedAccountId) || accounts[0];
  const isSelectedAccountRunning = currentAccount?.status === 'running';

  const selectAccount = (acc: Account) => {
    setSelectedAccountId(acc.id);
    if (acc.licenseKey) {
      setInputKey(acc.licenseKey);
    }
    if (acc.expiryDate) {
      setExpiryDate(`${acc.expiryDate} 15:50`);
    }
  };

  const handlePasteKey = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim().length > 0) {
        setInputKey(text.trim());
        triggerToast('Đã dán key từ clipboard!');
        return;
      }
    } catch {
      // Fallback
    }
    const defaultKey = currentAccount?.licenseKey || 'LZ-E5A8-8B3C-4B01-1652-B45A';
    setInputKey(defaultKey);
    triggerToast('Đã dán key!');
  };

  const handleLogin = () => {
    if (!currentAccount) return;
    if (!inputKey.trim()) {
      triggerToast('Vui lòng nhập Key bản quyền!');
      return;
    }
    triggerToast(`Đang xác thực key & mở [${currentAccount.name}]...`);
    setTimeout(() => {
      setAccounts(prev => prev.map(a => a.id === currentAccount.id ? { ...a, status: 'running', licenseKey: inputKey.trim() } : a));
      triggerToast(`Đăng nhập thành công! [${currentAccount.name}] đang chạy.`);
    }, 400);
  };

  const handleLogout = () => {
    if (!currentAccount) return;
    setAccounts(prev => prev.map(a => a.id === currentAccount.id ? { ...a, status: 'idle' } : a));
    triggerToast(`Đã đăng xuất [${currentAccount.name}]. Game đã đóng.`);
  };

  const runningCount = accounts.filter(a => a.status === 'running').length;

  const handleStartAll = () => {
    setAccounts(prev => prev.map(a => ({ ...a, status: 'running' })));
    triggerToast('Đã mở tất cả tài khoản!');
  };

  const handleStopAll = () => {
    setAccounts(prev => prev.map(a => ({ ...a, status: 'idle' })));
    triggerToast('Đã đóng tất cả tài khoản.');
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
    setActiveMenuId(null);
    triggerToast('Đã xóa tài khoản khỏi danh sách.');
  };

  const toggleAccountStatus = (id: string) => {
    setSelectedAccountId(id);
    const target = accounts.find(a => a.id === id);
    if (target?.licenseKey) {
      setInputKey(target.licenseKey);
    }
    setAccounts(prev => prev.map(acc => {
      if (acc.id === id) {
        const next = acc.status === 'running' ? 'idle' : 'running';
        triggerToast(`${next === 'running' ? 'Đã mở' : 'Đã tắt'} [${acc.name}]`);
        return { ...acc, status: next };
      }
      return acc;
    }));
  };

  const restartAccount = (id: string) => {
    setSelectedAccountId(id);
    const acc = accounts.find(a => a.id === id);
    if (!acc) return;
    triggerToast(`Đang khởi động lại [${acc.name}]...`);
    setTimeout(() => {
      setAccounts(prev => prev.map(a => a.id === id ? { ...a, status: 'running' } : a));
      triggerToast(`[${acc.name}] đã khởi động lại xong.`);
    }, 800);
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName.trim()) return;
    const days = Math.max(1, Number(newAccDaysLeft) || 30);
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + days);
    const formattedExp = `${String(expDate.getDate()).padStart(2, '0')}/${String(expDate.getMonth() + 1).padStart(2, '0')}/${expDate.getFullYear()}`;

    const newAcc: Account = {
      id: Date.now().toString(),
      initial: newAccName.trim().charAt(0),
      name: newAccName.trim(),
      server: newAccServer.trim().toUpperCase(),
      level: Number(newAccLevel) || 1,
      instanceId: newAccId.trim(),
      status: 'idle',
      licenseKey: newAccLicenseKey.trim() || ('LZ-E5A8-8B3C-4B01-1652-' + (newAccId.split('-')[1]?.trim() || '9B1C')),
      expiryDate: formattedExp,
      daysLeft: days
    };
    setAccounts(prev => [...prev, newAcc]);
    setShowAddAccountModal(false);
    setNewAccName('');
    triggerToast(`Đã thêm tài khoản [${newAcc.name}] thành công!`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#070a0f] p-2 sm:p-4 text-slate-100 font-sans select-none overflow-hidden">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-rose-500/60 text-slate-100 text-xs px-4 py-2 rounded-lg shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Desktop Application Window Container (Matching the exact client in the image) */}
      <div className="w-full max-w-[1080px] h-[680px] bg-[#0c1017] rounded-xl border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden relative">
        
        {/* ================= 1. WINDOW TITLE BAR ================= */}
        <header className="h-10 bg-[#090d14] border-b border-slate-800/80 px-4 flex items-center justify-between shrink-0">
          {/* Left: App Logo, Name, Version & Online Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {/* Redrawn 3D Mini Logo Icon */}
              <img
                src="/assets/mini_3d_logo.png"
                alt="Last Z Tool Icon"
                className="w-5 h-5 object-contain select-none"
              />
              <span className="text-xs font-bold text-slate-200 tracking-wide">
                Last Z Tool
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                v1.0.6*
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                ONLINE
              </span>
            </div>

            {/* "Cập nhật" Button */}
            <button
              onClick={() => {
                setIsUpdating(true);
                setTimeout(() => {
                  setIsUpdating(false);
                  triggerToast('Bạn đang ở phiên bản mới nhất v1.0.6');
                }, 800);
              }}
              disabled={isUpdating}
              className="ml-3 px-3 py-1 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/70 rounded transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RotateCw className={`w-3 h-3 text-cyan-400 ${isUpdating ? 'animate-spin' : ''}`} />
              <span>{isUpdating ? 'Đang check...' : 'Cập nhật'}</span>
            </button>
          </div>

          {/* Right: Version text & Window Controls */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500 font-mono">
              Phiên bản v1.0.6
            </span>

            {/* Window Controls: Minimize, Maximize, Close */}
            <div className="flex items-center gap-1 text-slate-400">
              <button 
                onClick={() => triggerToast('Đã thu nhỏ ứng dụng xuống khay hệ thống.')}
                className="w-7 h-7 flex items-center justify-center hover:bg-slate-800 hover:text-slate-200 rounded transition-colors cursor-pointer"
                title="Thu nhỏ"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => triggerToast('Chuyển đổi kích thước cửa sổ.')}
                className="w-7 h-7 flex items-center justify-center hover:bg-slate-800 hover:text-slate-200 rounded transition-colors cursor-pointer"
                title="Phóng to"
              >
                <Square className="w-3 h-3" />
              </button>
              <button 
                onClick={() => triggerToast('Nhấn đóng cửa sổ')}
                className="w-7 h-7 flex items-center justify-center hover:bg-rose-600 hover:text-white rounded transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* ================= 2. MAIN CLIENT BODY ================= */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* ----------- LEFT COLUMN: TÀI KHOẢN (Sleek Gaming Sidebar) ----------- */}
          <aside className="w-[310px] shrink-0 bg-[#090d15] border-r border-slate-800/90 flex flex-col justify-between select-none">
            
            {/* 1. Sidebar Header with Batch Actions & Search */}
            <div className="p-3.5 border-b border-slate-800/80 space-y-2.5 bg-[#080c13]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold tracking-wider uppercase text-slate-200">
                    TÀI KHOẢN
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#111927] text-slate-300 border border-slate-700/60 flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${runningCount > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                    <span>{runningCount}/{accounts.length}</span>
                  </span>
                </div>

                {/* Batch Start / Stop All Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleStartAll}
                    className="px-2 py-1 text-[10px] font-bold text-emerald-300 hover:text-white bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-600/40 rounded transition-colors cursor-pointer"
                    title="Mở tất cả tài khoản"
                  >
                    Mở tất cả
                  </button>
                  <button
                    onClick={handleStopAll}
                    className="px-2 py-1 text-[10px] font-bold text-rose-300 hover:text-white bg-rose-950/50 hover:bg-rose-900/60 border border-rose-600/40 rounded transition-colors cursor-pointer"
                    title="Đóng tất cả tài khoản"
                  >
                    Đóng tất cả
                  </button>
                </div>
              </div>

              {/* Compact Search Filter Bar */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm tài khoản, server..."
                  className="w-full bg-[#0d131f] text-xs text-slate-200 placeholder-slate-500 pl-8 pr-3 py-1.5 rounded-md border border-slate-800 focus:outline-none focus:border-rose-500/60 transition-colors"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-2 text-[10px] text-slate-400 hover:text-slate-200"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* 2. Account Cards List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {accounts
                .filter(acc => 
                  acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  acc.server.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  acc.instanceId.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((account) => {
                  const isRunning = account.status === 'running';
                  const isSelected = account.id === selectedAccountId;

                  return (
                    <div
                      key={account.id}
                      onClick={() => selectAccount(account)}
                      className={`relative rounded-xl p-3 transition-all cursor-pointer border ${
                        isSelected
                          ? 'border-[#2563eb] ring-1 ring-[#2563eb]/60 bg-[#0e1626] shadow-lg shadow-blue-950/40'
                          : isRunning
                            ? 'bg-gradient-to-r from-emerald-950/30 via-[#0e1625] to-[#0a101a] border-emerald-500/50 shadow-md shadow-emerald-950/20'
                            : 'bg-[#0c121d]/90 hover:bg-[#0f1725] border-slate-800/90 hover:border-slate-700/80'
                      }`}
                    >
                      {/* Active Accent Border on Left */}
                      {isRunning && (
                        <div className="absolute left-0 top-2.5 bottom-2.5 w-1 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-r shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
                      )}

                      {/* Top Row: Avatar, Name, Badges & 3-dots Menu */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Avatar Container */}
                          <div className={`w-9 h-9 rounded-lg shrink-0 flex items-center justify-center font-bold text-sm border shadow-inner ${
                            isRunning
                              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                              : 'bg-slate-800/90 border-slate-700 text-slate-300'
                          }`}>
                            {account.initial}
                          </div>

                          {/* Character Name & Server/Level Tags */}
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-slate-100 truncate block">
                              {account.name}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                                {account.server}
                              </span>
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-950/80 text-amber-400 border border-amber-800/60">
                                Lv.{account.level}
                              </span>
                              {account.daysLeft <= 3 && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-rose-950/90 text-rose-300 border border-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.45)] flex items-center gap-1 animate-pulse">
                                  <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
                                  <span>Còn {account.daysLeft} ngày</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Options Menu Button (3 dots) */}
                        <div className="relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === account.id ? null : account.id);
                            }}
                            className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors"
                            title="Tùy chọn tài khoản"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>

                          {/* Dropdown Menu */}
                          {activeMenuId === account.id && (
                            <div 
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 top-7 z-50 w-36 bg-[#0f1726] border border-slate-700 rounded-lg shadow-2xl py-1 text-xs text-slate-200"
                            >
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(account.instanceId);
                                  setActiveMenuId(null);
                                  triggerToast(`Đã sao chép ID: ${account.instanceId}`);
                                }}
                                className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-slate-800 hover:text-white"
                              >
                                <Copy className="w-3.5 h-3.5 text-slate-400" />
                                <span>Sao chép ID</span>
                              </button>
                              <div className="border-t border-slate-800 my-1" />
                              <button
                                onClick={() => handleDeleteAccount(account.id)}
                                className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-rose-950/60 hover:text-rose-300 text-rose-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Xóa tài khoản</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Hiển thị Key (Thay thế LDPlayer) */}
                      <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono px-2 py-1.5 rounded-md bg-[#070c14]/90 border border-slate-800/80">
                        <div className="flex items-center gap-1.5 min-w-0 text-slate-300">
                          <Key className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="text-slate-400 text-[10px] font-medium">Key:</span>
                          <span className="text-cyan-200 font-semibold truncate text-[11px] font-mono tracking-tight" title={account.licenseKey}>
                            {account.licenseKey}
                          </span>
                        </div>

                        <span className="text-slate-500 text-[10px] font-mono shrink-0 ml-1.5 font-medium">
                          {account.instanceId}
                        </span>
                      </div>

                      {/* Hạn dùng (License Expiry) & Trạng thái chạy */}
                      <div className="mt-2 flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/50">
                        {/* Hạn dùng */}
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-slate-500 text-[10px] font-medium">Hạn dùng:</span>
                          {account.daysLeft <= 3 ? (
                            <span 
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-950/90 text-rose-200 border border-rose-500/80 shadow-[0_0_10px_rgba(244,63,94,0.4)] animate-pulse"
                              title={`Hạn key dưới 3 ngày: còn ${account.daysLeft} ngày (HSD: ${account.expiryDate})`}
                            >
                              <AlertTriangle className="w-2.5 h-2.5 text-rose-400 shrink-0" />
                              <span>Còn {account.daysLeft} ngày</span>
                            </span>
                          ) : (
                            <span 
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40"
                              title={`Hạn dùng: còn ${account.daysLeft} ngày (HSD: ${account.expiryDate})`}
                            >
                              <Key className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                              <span>Còn {account.daysLeft} ngày</span>
                            </span>
                          )}
                        </div>

                        {/* Game Status */}
                        <span className={`font-semibold flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${
                          isRunning 
                            ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-700/50' 
                            : 'text-slate-400 bg-slate-800/60 border border-slate-700/40'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                          <span>{isRunning ? 'Đang chạy' : 'Chưa mở'}</span>
                        </span>
                      </div>

                      {/* Action Buttons: [Tắt / Mở] & [Khởi động lại] */}
                      <div className="mt-2.5 grid grid-cols-2 gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAccountStatus(account.id);
                          }}
                          className={`py-1.5 px-2 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
                            isRunning
                              ? 'bg-gradient-to-r from-rose-950 to-red-900 hover:from-rose-900 hover:to-red-800 text-rose-200 border border-rose-700/60 shadow-rose-950/40'
                              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border border-blue-400/50 shadow-blue-950/40'
                          }`}
                        >
                          {isRunning ? (
                            <>
                              <Square className="w-3 h-3 fill-rose-300 text-rose-300" />
                              <span>Tắt</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 fill-white text-white" />
                              <span>Mở</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            restartAccount(account.id);
                          }}
                          className="py-1.5 px-2 rounded-md text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/70 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <RotateCw className="w-3 h-3 text-slate-400" />
                          <span>Khởi động lại</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* 3. Sidebar Bottom Controls: + Thêm tài khoản & Cài đặt */}
            <div className="p-3 border-t border-slate-800/80 bg-[#080c13] space-y-2.5">
              <button
                onClick={() => setShowAddAccountModal(true)}
                className="w-full py-2 px-3 text-xs font-bold text-slate-100 hover:text-white bg-gradient-to-r from-[#141d2d] to-[#0f1724] hover:from-[#1b263b] hover:to-[#141f30] border border-slate-700/80 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Plus className="w-3.5 h-3.5 text-rose-400" />
                <span>Thêm tài khoản mới</span>
              </button>

              <div className="pt-0.5 flex items-center justify-between text-xs text-slate-400 px-1">
                <button
                  onClick={openSettingsModal}
                  className="hover:text-slate-200 transition-colors cursor-pointer flex items-center gap-1.5 text-[11px]"
                >
                  <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>Cài đặt</span>
                </button>

                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Client v1.0.6</span>
                </div>
              </div>
            </div>
          </aside>

          {/* ----------- RIGHT MAIN WORKSPACE (Reconstructed Full-Bleed Cyber Background) ----------- */}
          <main className="flex-1 bg-[#090d14] relative flex flex-col justify-between p-6 overflow-hidden select-none">
            
            {/* 1. Deep Atmospheric Radial Red Core Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_32%,rgba(225,29,72,0.2)_0%,rgba(9,13,20,0.95)_72%)] pointer-events-none" />

            {/* 2. FULL-BLEED RECONSTRUCTED CYBER HUD & CIRCUIT VECTOR GRAPHIC (Spans 100% of the Parent Block) */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none z-0" 
              viewBox="0 0 780 620" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Concentric Glowing HUD Rings around Center (cx=390, cy=185) */}
              <circle cx="390" cy="185" r="76" stroke="#e11d48" strokeWidth="1.5" opacity="0.45" />
              <circle cx="390" cy="185" r="98" stroke="#be123c" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.4" />
              <circle cx="390" cy="185" r="134" stroke="#9f1239" strokeWidth="1.2" opacity="0.3" />
              <circle cx="390" cy="185" r="168" stroke="#881337" strokeWidth="1" opacity="0.2" />

              {/* Glowing Cardinal Nodes on the HUD ring */}
              <circle cx="390" cy="51" r="3.5" fill="#ef4444" />
              <circle cx="390" cy="319" r="3.5" fill="#ef4444" />
              <circle cx="256" cy="185" r="3.5" fill="#ef4444" />
              <circle cx="524" cy="185" r="3.5" fill="#ef4444" />
              <circle cx="295" cy="90" r="2.5" fill="#f43f5e" opacity="0.8" />
              <circle cx="485" cy="90" r="2.5" fill="#f43f5e" opacity="0.8" />

              {/* Semi-circular dial ticks */}
              <path d="M 270 260 A 140 140 0 0 0 510 260" stroke="#be123c" strokeWidth="1" strokeDasharray="2 6" opacity="0.35" />

              {/* ===== LEFT CIRCUIT TRACES (Extending edge-to-edge) ===== */}
              <g stroke="#9f1239" strokeWidth="1.5" opacity="0.4">
                <path d="M 256 185 H 200 L 165 150 H 90 L 60 180 H 0" />
                <path d="M 292 245 L 245 292 H 160 L 125 327 H 40 L 20 347 H 0" />
                <path d="M 210 150 L 180 120 H 110 L 80 90 H 0" />
                <path d="M 160 292 V 370 H 80 L 50 400 H 0" />
              </g>

              {/* Left Solder Nodes */}
              <circle cx="200" cy="185" r="3" fill="#ef4444" />
              <circle cx="160" cy="292" r="3" fill="#ef4444" />
              <circle cx="110" cy="120" r="2.5" fill="#f43f5e" />
              <circle cx="245" cy="292" r="3" fill="#ef4444" />
              <circle cx="90" cy="150" r="2.5" fill="#f43f5e" />

              {/* Left Interlocking Mechanical Gears (Recreated) */}
              <g stroke="#9f1239" strokeWidth="1.2" fill="none" opacity="0.35">
                {/* Gear 1 */}
                <circle cx="180" cy="235" r="18" />
                <circle cx="180" cy="235" r="7" />
                <path d="M 180 213 V 217 M 180 253 V 257 M 158 235 H 162 M 198 235 H 202 M 164 219 L 167 222 M 193 248 L 196 251 M 164 251 L 167 248 M 193 222 L 196 219" strokeWidth="2.5" strokeLinecap="round" />
                
                {/* Gear 2 */}
                <circle cx="218" cy="205" r="13" />
                <circle cx="218" cy="205" r="5" />
                <path d="M 218 189 V 192 M 218 218 V 221 M 202 205 H 205 M 231 205 H 234 M 207 194 L 209 196 M 227 214 L 229 216" strokeWidth="2" strokeLinecap="round" />
              </g>

              {/* Left Cloud & Circuit Node (Recreated) */}
              <g stroke="#9f1239" strokeWidth="1.2" fill="none" opacity="0.35">
                <path d="M 105 385 C 100 375 88 375 82 380 C 76 376 68 380 67 386 C 62 388 60 395 65 400 H 115 C 120 395 118 388 112 386 C 111 382 108 380 105 385 Z" />
                <path d="M 80 400 V 425 H 40" />
                <path d="M 100 400 V 435 H 130" />
                <circle cx="40" cy="425" r="2.5" fill="#ef4444" />
                <circle cx="130" cy="435" r="2.5" fill="#ef4444" />
              </g>

              {/* ===== RIGHT CIRCUIT TRACES (Extending edge-to-edge) ===== */}
              <g stroke="#9f1239" strokeWidth="1.5" opacity="0.4">
                <path d="M 524 185 H 580 L 615 150 H 690 L 720 180 H 780" />
                <path d="M 488 245 L 535 292 H 620 L 655 327 H 740 L 760 347 H 780" />
                <path d="M 570 150 L 600 120 H 670 L 700 90 H 780" />
                <path d="M 620 292 V 370 H 700 L 730 400 H 780" />
              </g>

              {/* Right Solder Nodes */}
              <circle cx="580" cy="185" r="3" fill="#ef4444" />
              <circle cx="620" cy="292" r="3" fill="#ef4444" />
              <circle cx="670" cy="120" r="2.5" fill="#f43f5e" />
              <circle cx="535" cy="292" r="3" fill="#ef4444" />
              <circle cx="690" cy="150" r="2.5" fill="#f43f5e" />

              {/* Right Cloud Server Node (Recreated) */}
              <g stroke="#9f1239" strokeWidth="1.2" fill="none" opacity="0.35">
                <path d="M 670 185 C 665 175 653 175 647 180 C 641 176 633 180 632 186 C 627 188 625 195 630 200 H 680 C 685 195 683 188 677 186 C 676 182 673 180 670 185 Z" />
                <path d="M 645 200 V 225 H 615" />
                <path d="M 665 200 V 235 H 695" />
                <circle cx="615" cy="225" r="2.5" fill="#ef4444" />
                <circle cx="695" cy="235" r="2.5" fill="#ef4444" />
              </g>

              {/* Right Gamepad Controller Outline (Recreated) */}
              <g stroke="#9f1239" strokeWidth="1.3" fill="none" opacity="0.32">
                <rect x="660" y="390" width="70" height="42" rx="14" />
                {/* D-Pad on left */}
                <path d="M 677 404 V 418 M 670 411 H 684" strokeWidth="2" strokeLinecap="round" />
                {/* 4 Action buttons on right */}
                <circle cx="712" cy="406" r="1.8" fill="#f43f5e" />
                <circle cx="707" cy="411" r="1.8" fill="#f43f5e" />
                <circle cx="717" cy="411" r="1.8" fill="#f43f5e" />
                <circle cx="712" cy="416" r="1.8" fill="#f43f5e" />
              </g>
            </svg>

            {/* 3. CENTER EMBLEM & TITLE (Positioned seamlessly as the upper focal point) */}
            <div className="relative z-10 flex flex-col items-center justify-start pt-6 text-center select-none">
              {/* Central Glowing Redrawn 3D Logo Emblem */}
              <div className="relative flex items-center justify-center">
                {/* Ambient Red Glow Halo */}
                <div className="absolute w-52 h-52 rounded-full bg-rose-600/30 blur-3xl pointer-events-none" />
                
                {/* High Fidelity Redrawn 3D Neon & Chrome Logo (100% Transparent) */}
                <img
                  src="/assets/lastzauto_v2_3d_logo_transparent.png"
                  alt="LASTZAUTO V2 3D Logo"
                  className="relative w-44 h-44 object-contain drop-shadow-[0_0_35px_rgba(225,29,72,0.65)] select-none pointer-events-none"
                />
              </div>

              {/* Recreated LASTZAUTO Title */}
              <div className="mt-3">
                <h1 className="text-3xl font-black tracking-[0.2em] uppercase bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                  LASTZAUTO
                </h1>
                
                {/* Recreated — V 2 — Red Accent Bars */}
                <div className="flex items-center justify-center gap-3 mt-0.5">
                  <div className="h-[1.5px] w-9 bg-gradient-to-r from-transparent via-rose-600 to-rose-500" />
                  <span className="text-xs font-black tracking-widest text-rose-500 uppercase">
                    V 2
                  </span>
                  <div className="h-[1.5px] w-9 bg-gradient-to-l from-transparent via-rose-600 to-rose-500" />
                </div>
              </div>
            </div>

            {/* 4. FOREGROUND INTERACTIVE CONTROLS (Floating cleanly over the lower background) */}
            <div className="relative z-10 max-w-[580px] mx-auto w-full pb-2 space-y-3">
              
              {!isSelectedAccountRunning ? (
                /* === TRẠNG THÁI: TÀI KHOẢN CHƯA MỞ (Khớp chính xác image_56fde5ea.png) === */
                <div className="space-y-3 text-left">
                  {/* Account & Key Info Bar */}
                  <div className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-[#0a101b]/90 border border-slate-800/90 text-slate-300">
                    <div className="flex items-center gap-2">
                      <Key className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="font-bold text-slate-100">{currentAccount.name}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400 text-[11px]">Key:</span>
                      <span className="font-mono text-cyan-300 text-[11px] font-semibold">{currentAccount.licenseKey}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400 text-[11px]">Sẵn sàng</span>
                    </div>

                    <div>
                      {currentAccount.daysLeft <= 3 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950/90 text-rose-300 border border-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.4)] animate-pulse">
                          <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
                          Còn {currentAccount.daysLeft} ngày
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40">
                          <Key className="w-2.5 h-2.5 text-emerald-400" />
                          Còn {currentAccount.daysLeft} ngày
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 1. Input Key Row with Dán Button */}
                  <div>
                    <div className="text-xs text-slate-200 font-medium mb-1.5">
                      Input Key:
                    </div>
                    <div className="flex items-stretch w-full bg-[#070b13] border border-slate-700/90 focus-within:border-blue-500 rounded overflow-hidden shadow-inner">
                      <input
                        type="text"
                        value={inputKey}
                        onChange={(e) => setInputKey(e.target.value)}
                        placeholder="LZ-E5A8-8B3C-4B01-1652-B45A"
                        className="flex-1 bg-transparent px-3.5 py-2.5 text-xs text-slate-100 font-mono tracking-widest outline-none"
                      />
                      <button
                        type="button"
                        onClick={handlePasteKey}
                        className="px-5 py-2.5 bg-[#172030] hover:bg-[#202d44] active:bg-[#293955] text-slate-300 hover:text-white border-l border-slate-700/80 text-xs font-semibold cursor-pointer transition-colors shrink-0"
                      >
                        Dán
                      </button>
                    </div>
                  </div>

                  {/* 2. Action Buttons: [ Xóa Auto ] and [ Mua key ] */}
                  <div className="grid grid-cols-2 gap-3.5 w-full">
                    <button
                      type="button"
                      onClick={() => setShowDeleteAutoModal(true)}
                      className="py-2.5 px-4 rounded-md text-xs font-bold text-slate-200 hover:text-white bg-gradient-to-b from-[#1c3358] to-[#13233c] hover:from-[#24416f] hover:to-[#192c4c] border border-blue-500/40 hover:border-blue-400/60 transition-all shadow-lg shadow-black/50 cursor-pointer text-center active:scale-[0.99]"
                    >
                      Xóa Auto
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowBuyKeyModal(true)}
                      className="py-2.5 px-4 rounded-md text-xs font-bold text-slate-200 hover:text-white bg-gradient-to-b from-[#1c3358] to-[#13233c] hover:from-[#24416f] hover:to-[#192c4c] border border-blue-500/40 hover:border-blue-400/60 transition-all shadow-lg shadow-black/50 cursor-pointer text-center active:scale-[0.99]"
                    >
                      Mua key
                    </button>
                  </div>

                  {/* 3. Primary Action Button: [ ĐĂNG NHẬP ] */}
                  <button
                    type="button"
                    onClick={handleLogin}
                    className="w-full py-2.5 px-4 rounded-md bg-[#1d4ed8] hover:bg-[#2563eb] active:scale-[0.99] text-white text-xs font-bold tracking-widest uppercase shadow-lg shadow-blue-800/40 transition-all cursor-pointer text-center"
                  >
                    ĐĂNG NHẬP
                  </button>
                </div>
              ) : (
                /* === TRẠNG THÁI: TÀI KHOẢN ĐANG CHẠY === */
                <div className="space-y-3">
                  {/* 1. User & License Card: Translucent Glass sitting over the background */}
                  <div className="w-full bg-[#0c1322]/80 backdrop-blur-md border border-slate-800/90 rounded-lg p-3.5 shadow-2xl shadow-black/80 text-left relative overflow-hidden">
                    {/* Subtle top edge highlight */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-rose-500/40 to-transparent" />

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-xs text-slate-200 flex items-center gap-1.5 flex-wrap">
                          <span>Chào mừng: </span>
                          <b className="text-slate-100 font-mono tracking-wide">{userEmail}</b>
                          <span> đã trở lại</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-cyan-300 font-mono text-[11px] font-semibold">{currentAccount.name}</span>
                        </div>
                        
                        <div className="text-xs mt-1 flex items-center gap-2 flex-wrap">
                          <span className="text-slate-400">Hết hạn: </span>
                          <b className="text-emerald-400 font-mono font-bold tracking-wide">{currentAccount.expiryDate || expiryDate} 15:50</b>
                          {currentAccount.daysLeft <= 3 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950/90 text-rose-300 border border-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.4)] animate-pulse">
                              <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
                              Còn {currentAccount.daysLeft} ngày
                            </span>
                          ) : (
                            <span className="text-[11px] font-mono text-slate-400">
                              (Còn {currentAccount.daysLeft} ngày)
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-400 mt-1">
                          Khi hết hạn, tool sẽ tự đóng game.
                        </div>
                      </div>

                      {/* "Đăng xuất" button */}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="shrink-0 px-4 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-gradient-to-b from-[#1b345b] to-[#12233e] hover:from-[#244373] hover:to-[#172c4e] border border-blue-500/40 hover:border-blue-400/60 rounded transition-all shadow-md cursor-pointer"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>

                  {/* 2. Action Buttons: [ Xóa Auto ] and [ Mua key ] */}
                  <div className="grid grid-cols-2 gap-3.5 w-full">
                    <button
                      type="button"
                      onClick={() => setShowDeleteAutoModal(true)}
                      className="py-2.5 px-4 rounded-md text-xs font-bold text-slate-200 hover:text-white bg-gradient-to-b from-[#1c3358] to-[#13233c] hover:from-[#24416f] hover:to-[#192c4c] border border-blue-500/40 hover:border-blue-400/60 transition-all shadow-lg shadow-black/50 cursor-pointer text-center active:scale-[0.99]"
                    >
                      Xóa Auto
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowBuyKeyModal(true)}
                      className="py-2.5 px-4 rounded-md text-xs font-bold text-slate-200 hover:text-white bg-gradient-to-b from-[#1c3358] to-[#13233c] hover:from-[#24416f] hover:to-[#192c4c] border border-blue-500/40 hover:border-blue-400/60 transition-all shadow-lg shadow-black/50 cursor-pointer text-center active:scale-[0.99]"
                    >
                      Mua key
                    </button>
                  </div>

                  {/* 3. Main Status Bar: [ GAME ĐANG CHẠY ] */}
                  <div className="w-full">
                    <div className="w-full py-2.5 px-4 rounded-md bg-gradient-to-r from-[#0d1421] via-[#111a2b] to-[#0d1421] border border-slate-800/90 text-xs font-extrabold tracking-widest uppercase text-slate-300 text-center flex items-center justify-center gap-2 shadow-inner">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                      <span>GAME ĐANG CHẠY</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* ================= 3. FOOTER (Exact copy from original) ================= */}
            <footer className="relative z-10 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
              <div className="text-[11px] truncate">
                Đã mở game — client vẫn ở đây để xem hạn key.
              </div>
              <div className="text-[11px] shrink-0 text-slate-400">
                autolastz.xyz © 2026
              </div>
            </footer>

          </main>
        </div>

      </div>

      {/* ================= MODAL: Cài đặt (Settings - Matching image_a031f484.png) ================= */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-[440px] bg-[#0c121e] border border-slate-700/80 rounded-xl p-6 shadow-2xl shadow-black/90">
            {/* Header */}
            <div className="flex items-center justify-between pb-3">
              <h3 className="text-base font-bold text-white tracking-wide">
                Cài đặt
              </h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-2 space-y-4 text-xs">
              {/* Setting 1: Tự động khởi động lại game lúc */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">
                    Tự động khởi động lại game lúc:
                  </span>
                  <div className="flex items-center gap-2.5">
                    <span className={`text-xs font-semibold ${modalRestartEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {modalRestartEnabled ? 'Bật' : 'Tắt'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setModalRestartEnabled(!modalRestartEnabled)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
                        modalRestartEnabled ? 'bg-[#2563eb]' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                          modalRestartEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={modalRestartTime}
                    onChange={(e) => setModalRestartTime(e.target.value)}
                    placeholder="09:00"
                    className="w-24 bg-[#05080f] border border-slate-700/90 focus:border-blue-500 rounded px-3 py-1.5 text-xs text-white font-mono tracking-wider outline-none"
                  />
                  <span className="text-xs text-slate-400 font-mono">
                    24h, ví dụ 05:00
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Đúng giờ đó, mọi tab đang chạy sẽ được đóng rồi mở lại.
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-800/90 my-2" />

              {/* Setting 2: Hẹn giờ hoạt động (kho báu và lì xì) */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-200">
                  Hẹn giờ hoạt động (kho báu và lì xì):
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="text"
                    value={modalScheduleStart}
                    onChange={(e) => setModalScheduleStart(e.target.value)}
                    placeholder="00:00"
                    className="w-20 bg-[#05080f] border border-slate-700/90 focus:border-blue-500 rounded px-2.5 py-1.5 text-xs text-white font-mono text-center tracking-wider outline-none"
                  />
                  <span className="text-slate-400 font-mono text-xs">-</span>
                  <input
                    type="text"
                    value={modalScheduleEnd}
                    onChange={(e) => setModalScheduleEnd(e.target.value)}
                    placeholder="23:59"
                    className="w-20 bg-[#05080f] border border-slate-700/90 focus:border-blue-500 rounded px-2.5 py-1.5 text-xs text-white font-mono text-center tracking-wider outline-none"
                  />
                  <span className="text-xs text-slate-400 font-mono ml-1">
                    24h. Mặc định 00:00 - 23:59
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Ngoài khoảng này, hai chức năng tạm dừng. Qua đêm: 22:00 - 06:00.
                </p>
              </div>
            </div>

            {/* Bottom Actions: Đóng (left) & Lưu (right) */}
            <div className="flex items-center justify-between pt-5 mt-2 border-t border-slate-800/60">
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="w-28 py-2 rounded-md bg-[#111827] hover:bg-[#1a2234] text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors cursor-pointer text-center"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                className="w-32 py-2 rounded-md bg-[#1d4ed8] hover:bg-[#2563eb] active:scale-[0.98] text-white text-xs font-semibold shadow-md shadow-blue-800/30 transition-all cursor-pointer text-center"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: Thêm tài khoản (+ Thêm tài khoản) ================= */}
      {showAddAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#0f1522] border border-slate-700 rounded-xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Thêm tài khoản mới</h3>
              <button onClick={() => setShowAddAccountModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddAccount} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Tên nhân vật:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: 백수 farm 2"
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  className="w-full bg-[#0a0e16] border border-slate-700 px-3 py-1.5 rounded text-xs text-slate-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Server:</label>
                  <input
                    type="text"
                    value={newAccServer}
                    onChange={(e) => setNewAccServer(e.target.value)}
                    className="w-full bg-[#0a0e16] border border-slate-700 px-3 py-1.5 rounded text-xs text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Cấp độ (Level):</label>
                  <input
                    type="number"
                    value={newAccLevel}
                    onChange={(e) => setNewAccLevel(Number(e.target.value))}
                    className="w-full bg-[#0a0e16] border border-slate-700 px-3 py-1.5 rounded text-xs text-slate-100 font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Mã instance:</label>
                  <input
                    type="text"
                    value={newAccId}
                    onChange={(e) => setNewAccId(e.target.value)}
                    className="w-full bg-[#0a0e16] border border-slate-700 px-3 py-1.5 rounded text-xs text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Key bản quyền:</label>
                  <input
                    type="text"
                    placeholder="LZ-9B1C-3A4D-7E88-9B1C"
                    value={newAccLicenseKey}
                    onChange={(e) => setNewAccLicenseKey(e.target.value)}
                    className="w-full bg-[#0a0e16] border border-slate-700 px-3 py-1.5 rounded text-xs text-slate-100 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">
                  Hạn key (số ngày còn lại - nhập ≤ 3 sẽ hiện badge đỏ):
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={newAccDaysLeft}
                  onChange={(e) => setNewAccDaysLeft(Number(e.target.value))}
                  className="w-full bg-[#0a0e16] border border-slate-700 px-3 py-1.5 rounded text-xs text-slate-100 font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddAccountModal(false)}
                  className="px-4 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: Mua key ================= */}
      {showBuyKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#0f1522] border border-slate-700 rounded-xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Gia hạn Bản quyền & Mua Key</span>
              </h3>
              <button onClick={() => setShowBuyKeyModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs text-slate-300">
              <p>
                Tài khoản: <b className="text-white">{userEmail}</b>
              </p>
              <p>
                Hạn hiện tại: <b className="text-emerald-400 font-mono">{expiryDate}</b>
              </p>
              <div className="p-3 bg-[#0a0e16] rounded-lg border border-slate-800 space-y-2">
                <div className="font-semibold text-slate-200">Bảng giá key gia hạn:</div>
                <div className="flex justify-between text-slate-400">
                  <span>· Gói 30 Ngày (4 Acc)</span>
                  <span className="font-mono text-rose-400">100.000 đ</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>· Gói 90 Ngày (8 Acc)</span>
                  <span className="font-mono text-rose-400">250.000 đ</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>· Gói 1 Năm (Không giới hạn)</span>
                  <span className="font-mono text-rose-400">850.000 đ</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400">
                Để mua key nhanh, truy cập website chính thức <b className="text-slate-200">autolastz.xyz</b> hoặc liên hệ Admin qua Zalo/Telegram.
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowBuyKeyModal(false)}
                className="px-4 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setExpiryDate('24/12/2026 15:50');
                  setShowBuyKeyModal(false);
                  triggerToast('Gia hạn thêm 30 ngày thành công!');
                }}
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded"
              >
                Kích hoạt thử nghiệm (+30 ngày)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: Xóa Auto ================= */}
      {showDeleteAutoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#0f1522] border border-slate-700 rounded-xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Xác nhận Xóa Auto</span>
              </h3>
              <button onClick={() => setShowDeleteAutoModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4 text-xs text-slate-300 space-y-2">
              <p>Bạn có chắc chắn muốn xóa toàn bộ dữ liệu Auto, cache tạm của game và thiết lập lại kết nối ADB?</p>
              <p className="text-slate-400 text-[11px]">Hành động này sẽ đóng tất cả các tiến trình game đang chạy.</p>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowDeleteAutoModal(false)}
                className="px-4 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setAccounts(prev => prev.map(a => ({ ...a, status: 'idle' })));
                  setShowDeleteAutoModal(false);
                  triggerToast('Đã xóa sạch Auto và đưa tất cả tài khoản về trạng thái Chưa mở.');
                }}
                className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded"
              >
                Xác nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
