import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiMessageCircle, FiMinus, FiX, FiSend, FiZap, FiSearch, FiGrid } from 'react-icons/fi';
import { addDays, format, isBefore, startOfDay } from 'date-fns';

import { useAuth } from '../context/AuthContext';
import { roomAPI } from '../services/api';

import './ChatWidget.css';

const BOT_NAME = 'Trợ lý đặt phòng';

const uid = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

function formatMoneyVND(n) {
  if (typeof n !== 'number' || Number.isNaN(n)) return '';
  return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
}

function safeLower(s) {
  return (s || '').toString().toLowerCase();
}

function normalizeSpaces(s) {
  return (s || '').replace(/\s+/g, ' ').trim();
}

function parseMoneyToNumber(text) {
  const t = safeLower(text);
  // 1tr2, 1tr200, 1.5tr
  const trCompact = t.match(/(\d+(?:[\.,]\d+)?)\s*(?:tr|triệu)\s*(\d+)?/i);
  if (trCompact) {
    const base = Number(trCompact[1].replace(',', '.'));
    const suffix = trCompact[2];
    let value = Math.round(base * 1_000_000);
    if (suffix) {
      const sufNum = parseInt(suffix, 10);
      if (!Number.isNaN(sufNum)) {
        const mul = suffix.length === 1 ? 100_000 : suffix.length === 2 ? 10_000 : suffix.length === 3 ? 1_000 : 1;
        value = Math.round(Math.floor(base) * 1_000_000 + sufNum * mul);
      }
    }
    return value;
  }

  // 600k, 600 nghìn
  const k = t.match(/(\d+(?:[\.,]\d+)?)\s*(k|nghìn|ngan)/i);
  if (k) return Math.round(Number(k[1].replace(',', '.')) * 1000);

  // 600000 or 600.000
  const digits = t.match(/(\d[\d\.,]{2,})/);
  if (digits) {
    const cleaned = digits[1].replace(/\./g, '').replace(/,/g, '');
    const v = parseInt(cleaned, 10);
    if (!Number.isNaN(v)) return v;
  }

  return null;
}

function parseDateLoose(raw) {
  const s = normalizeSpaces(raw).replace(/[.,]/g, '');
  const today = startOfDay(new Date());

  // yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const d = new Date(s);
    if (!Number.isNaN(d.getTime())) return d;
  }

  // dd/mm(/yyyy) or dd-mm(-yyyy)
  const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{4}))?$/);
  if (m) {
    const day = parseInt(m[1], 10);
    const month = parseInt(m[2], 10);
    let year = m[3] ? parseInt(m[3], 10) : new Date().getFullYear();

    let d = new Date(year, month - 1, day);
    // Nếu không nhập năm và ngày đã qua -> auto +1 năm
    if (!m[3] && isBefore(startOfDay(d), today)) {
      year += 1;
      d = new Date(year, month - 1, day);
    }
    if (!Number.isNaN(d.getTime())) return d;
  }

  return null;
}

function extractSearchIntent(message) {
  const m = safeLower(message);

  const wantsMenu = /\b(menu|help|h\u01b0\u1edbng d\u1eabn|b\u1ea1n l\u00e0m \u0111\u01b0\u1ee3c g\u00ec)\b/i.test(m);
  const wantsRoomTypes = /(lo\u1ea1i ph\u00f2ng|h\u1ea1ng ph\u00f2ng|room\s*types?)/i.test(m);
  const wantsFeatured = /(ph\u00f2ng g\u1ee3i \u00fd|ph\u00f2ng n\u1ed5i b\u1eadt|g\u1ee3i \u00fd ph\u00f2ng)/i.test(m);
  let wantsSearch = /(t\u00ecm ph\u00f2ng|ph\u00f2ng tr\u1ed1ng|c\u00f2n ph\u00f2ng|available|search)/i.test(m);

  // guests
  let guests = null;
  const g = m.match(/(\d{1,2})\s*(ng\u01b0\u1eddi|kh\u00e1ch|pax|persons?)/i);
  if (g) guests = Math.max(1, parseInt(g[1], 10));

  // max price
  let maxPrice = null;
  const pricePart = m.match(/(?:d\u01b0\u1edbi|t\u1ed1i\s*\u0111a|max|<=|<)\s*([^\n]+)/i);
  if (pricePart) maxPrice = parseMoneyToNumber(pricePart[1]);
  if (maxPrice == null) {
    // fallback: "600k" anywhere
    const any = m.match(/(\d+(?:[\.,]\d+)?\s*(?:k|ngh\u00ecn|tr|tri\u1ec7u)|\d[\d\.,]{2,})/i);
    if (any && /(d\u01b0\u1edbi|t\u1ed1i\s*\u0111a|max|<=|<)/i.test(m)) {
      maxPrice = parseMoneyToNumber(any[1]);
    }
  }

  // date range: "từ X đến Y" or "X - Y"
  let checkIn = null;
  let checkOut = null;
  const range1 = m.match(/t\u1eeb\s*(\d{1,4}[\/\-]\d{1,2}(?:[\/\-]\d{1,4})?)\s*(?:\u0111\u1ebfn|t\u1edbi|to|\-|\u2013)\s*(\d{1,4}[\/\-]\d{1,2}(?:[\/\-]\d{1,4})?)/i);
  const range2 = m.match(/(\d{1,4}[\/\-]\d{1,2}(?:[\/\-]\d{1,4})?)\s*(?:\-|\u2013)\s*(\d{1,4}[\/\-]\d{1,2}(?:[\/\-]\d{1,4})?)/i);
  const picked = range1 || range2;
  if (picked) {
    const d1 = parseDateLoose(picked[1]);
    const d2 = parseDateLoose(picked[2]);
    if (d1) checkIn = d1;
    if (d2) checkOut = d2;
  }

  // single date + nights: "5/2 2 đêm"
  if (!checkIn) {
    const single = m.match(/(\d{1,4}[\/\-]\d{1,2}(?:[\/\-]\d{1,4})?)/);
    if (single) {
      const d = parseDateLoose(single[1]);
      if (d) checkIn = d;
    }
  }
  if (checkIn && !checkOut) {
    const nights = m.match(/(\d{1,2})\s*\u0111\u00eam/);
    if (nights) {
      const n = parseInt(nights[1], 10);
      if (!Number.isNaN(n) && n > 0) checkOut = addDays(checkIn, n);
    }
  }

  // Nếu user chỉ gõ “5/2-7/2 2 người dưới 600k” thì vẫn hiểu là tìm phòng.
  if (!wantsSearch && checkIn && checkOut && guests) wantsSearch = true;

  return {
    wantsMenu,
    wantsRoomTypes,
    wantsFeatured,
    wantsSearch,
    guests,
    maxPrice,
    checkIn,
    checkOut,
  };
}

function buildMenuText() {
  return (
    'Mình có thể giúp bạn nhanh gọn:\n' +
    '• Tìm phòng trống theo ngày + số khách (+ lọc giá)\n' +
    '• Xem các loại phòng\n' +
    '• Gợi ý phòng nổi bật\n\n' +
    'Ví dụ bạn gõ:\n' +
    '• "Tìm phòng 2 người từ 5/2 đến 7/2 dưới 600k"\n' +
    '• "Loại phòng"\n' +
    '• "Phòng gợi ý"'
  );
}

export default function ChatWidget() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/admin/login';
  const hidden = isAdminRoute || isAuthRoute || user?.role === 'ADMIN';

  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [roomTypes, setRoomTypes] = useState([]);
  const [messages, setMessages] = useState(() => {
    // light persistence
    try {
      const saved = localStorage.getItem('hb_chat_messages');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: uid(),
        role: 'assistant',
        type: 'welcome',
        text: 'Chào bạn 👋 Mình có thể giúp bạn tìm phòng trống, xem loại phòng, hoặc gợi ý phòng nổi bật.',
        ts: Date.now(),
      },
    ];
  });

  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('hb_chat_messages', JSON.stringify(messages.slice(-30)));
    } catch {
      // ignore
    }
  }, [messages]);

  useEffect(() => {
    if (!open || minimized) return;
    // fetch room types once
    if (roomTypes.length === 0) {
      roomAPI
        .getRoomTypes()
        .then((res) => setRoomTypes(Array.isArray(res.data) ? res.data : []))
        .catch(() => setRoomTypes([]));
    }
  }, [open, minimized, roomTypes.length]);

  useEffect(() => {
    if (!open || minimized) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, open, minimized, isTyping]);

  const quickActions = useMemo(
    () => [
      { label: 'Menu', icon: <FiZap />, text: 'menu' },
      { label: 'Tìm phòng', icon: <FiSearch />, text: 'tìm phòng' },
      { label: 'Loại phòng', icon: <FiGrid />, text: 'loại phòng' },
      { label: 'Phòng gợi ý', icon: <FiZap />, text: 'phòng gợi ý' },
    ],
    []
  );

  const hasUserMessage = useMemo(() => messages.some((m) => m.role === 'user'), [messages]);

  if (hidden) return null;

  const pushAssistant = (payload) => {
    setMessages((prev) => [
      ...prev,
      {
        id: uid(),
        role: 'assistant',
        ts: Date.now(),
        ...payload,
      },
    ]);
  };

  const pushUser = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: uid(),
        role: 'user',
        type: 'text',
        text,
        ts: Date.now(),
      },
    ]);
  };

  const handleOpen = () => {
    setOpen(true);
    setMinimized(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleClose = () => {
    setOpen(false);
    setMinimized(false);
  };

  const handleMinimize = () => {
    setMinimized((v) => !v);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const resolveRoomTypeId = (msg) => {
    const t = safeLower(msg);
    const found = roomTypes.find((rt) => t.includes(safeLower(rt.name)));
    if (found) return found.id;
    // common aliases
    const alias = [
      { key: 'standard', name: 'standard' },
      { key: 'superior', name: 'superior' },
      { key: 'deluxe', name: 'deluxe' },
      { key: 'suite', name: 'suite' },
    ].find((a) => t.includes(a.key));
    if (alias) {
      const f2 = roomTypes.find((rt) => safeLower(rt.name).includes(alias.name));
      if (f2) return f2.id;
    }
    return undefined;
  };

  const doSearchRooms = async (intent) => {
    const roomTypeId = resolveRoomTypeId(intent.rawMessage);

    if (!intent.checkIn || !intent.checkOut || !intent.guests) {
      const missing = [];
      if (!intent.checkIn || !intent.checkOut) missing.push('ngày nhận/trả phòng');
      if (!intent.guests) missing.push('số khách');
      pushAssistant({
        type: 'text',
        text:
          `Bạn cho mình thêm ${missing.join(' và ')} nhé.\n` +
          `Ví dụ: "Tìm phòng 2 người từ 5/2 đến 7/2 dưới 600k"`,
      });
      return;
    }

    const params = {
      checkIn: format(intent.checkIn, 'yyyy-MM-dd'),
      checkOut: format(intent.checkOut, 'yyyy-MM-dd'),
      guests: intent.guests,
      roomTypeId,
    };

    setIsTyping(true);
    try {
      const res = await roomAPI.search(params);
      let rooms = Array.isArray(res.data) ? res.data : [];
      if (intent.maxPrice != null) {
        rooms = rooms.filter((r) => typeof r.price === 'number' && r.price <= intent.maxPrice);
      }
      rooms.sort((a, b) => (a.price || 0) - (b.price || 0));

      const header = `Mình tìm được ${rooms.length} phòng phù hợp` +
        (intent.maxPrice != null ? ` (<= ${formatMoneyVND(intent.maxPrice)}/đêm)` : '') +
        `.`;

      pushAssistant({ type: 'text', text: header });

      if (rooms.length === 0) {
        pushAssistant({
          type: 'text',
          text: 'Bạn thử đổi ngày hoặc tăng ngân sách/giảm số khách nha 🙂',
        });
        return;
      }

      pushAssistant({
        type: 'rooms',
        rooms: rooms.slice(0, 6),
        meta: {
          checkIn: params.checkIn,
          checkOut: params.checkOut,
          guests: intent.guests,
        },
      });
    } catch (e) {
      pushAssistant({
        type: 'error',
        text: 'Mình gặp lỗi khi tìm phòng. Bạn kiểm tra backend đang chạy đúng host/port nhé.',
      });
    } finally {
      setIsTyping(false);
    }
  };

  const doRoomTypes = async () => {
    setIsTyping(true);
    try {
      const res = await roomAPI.getRoomTypes();
      const types = Array.isArray(res.data) ? res.data : [];
      setRoomTypes(types);
      if (types.length === 0) {
        pushAssistant({ type: 'text', text: 'Hiện chưa có loại phòng nào.' });
        return;
      }
      pushAssistant({ type: 'roomTypes', roomTypes: types });
    } catch {
      pushAssistant({ type: 'error', text: 'Không tải được danh sách loại phòng.' });
    } finally {
      setIsTyping(false);
    }
  };

  const doFeatured = async () => {
    setIsTyping(true);
    try {
      const res = await roomAPI.getAll();
      let rooms = Array.isArray(res.data) ? res.data : [];
      rooms = rooms.filter((r) => (r.status || '').toString().toUpperCase() !== 'MAINTENANCE');
      rooms.sort((a, b) => (a.price || 0) - (b.price || 0));
      pushAssistant({ type: 'text', text: 'Gợi ý nhanh vài phòng giá tốt nè:' });
      pushAssistant({ type: 'rooms', rooms: rooms.slice(0, 3) });
    } catch {
      pushAssistant({ type: 'error', text: 'Không tải được phòng gợi ý.' });
    } finally {
      setIsTyping(false);
    }
  };

  const handleBotLogic = async (raw) => {
    const message = normalizeSpaces(raw);
    const intent = extractSearchIntent(message);
    intent.rawMessage = message;

    if (intent.wantsMenu) {
      pushAssistant({ type: 'text', text: buildMenuText() });
      return;
    }
    if (intent.wantsRoomTypes) {
      await doRoomTypes();
      return;
    }
    if (intent.wantsFeatured) {
      await doFeatured();
      return;
    }
    if (intent.wantsSearch) {
      await doSearchRooms(intent);
      return;
    }

    // fallback
    pushAssistant({
      type: 'text',
      text: 'Bạn muốn tìm phòng hay xem loại phòng? Gõ "menu" để xem hướng dẫn nhanh nhé ✨',
    });
  };

  const send = async (text) => {
    const trimmed = normalizeSpaces(text);
    if (!trimmed) return;
    pushUser(trimmed);
    setInput('');
    await handleBotLogic(trimmed);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isTyping) return;
    await send(input);
  };

  const onKeyDown = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isTyping) await send(input);
    }
  };

  const renderMessage = (msg) => {
    const isUser = msg.role === 'user';
    const bubbleClass = `hb-chat-bubble ${isUser ? 'hb-chat-bubble--user' : 'hb-chat-bubble--bot'}`;

    if (msg.type === 'rooms') {
      return (
        <div className={bubbleClass}>
          <div className="hb-chat-cards">
            {msg.rooms.map((r) => (
              <button
                key={r.id}
                type="button"
                className="hb-chat-roomcard"
                onClick={() => navigate(`/rooms/${r.id}`)}
                title="Xem chi tiết"
              >
                <div className="hb-chat-roomcard__top">
                  <div className="hb-chat-roomno">Phòng {r.roomNumber || r.id}</div>
                  <div className="hb-chat-price">{formatMoneyVND(r.price)}/đêm</div>
                </div>
                <div className="hb-chat-meta">
                  <span className="hb-chat-pill">{r.roomTypeName || r.roomType?.name || 'Loại phòng'}</span>
                  <span className="hb-chat-pill">{r.capacity || 0} khách</span>
                </div>
                <div className="hb-chat-roomcard__cta">Bấm để xem chi tiết →</div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (msg.type === 'roomTypes') {
      return (
        <div className={bubbleClass}>
          <div className="hb-chat-rt">
            {msg.roomTypes.map((rt) => (
              <div key={rt.id} className="hb-chat-rt__row">
                <div className="hb-chat-rt__name">{rt.name}</div>
                {rt.description ? <div className="hb-chat-rt__desc">{rt.description}</div> : null}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className={bubbleClass}>
        <div className="hb-chat-text">{msg.text}</div>
      </div>
    );
  };

  return (
    <>
      {!open ? (
        <button className="hb-chat-fab" type="button" onClick={handleOpen} aria-label="Mở chat">
          <FiMessageCircle size={20} />
          <span className="hb-chat-fab__label">Hỏi nhanh</span>
        </button>
      ) : (
        <div className={`hb-chat-shell ${minimized ? 'hb-chat-shell--min' : ''}`}>
          <div className="hb-chat-header">
            <div className="hb-chat-title">
              <span className="hb-chat-dot" />
              <div>
                <div className="hb-chat-title__name">{BOT_NAME}</div>
                <div className="hb-chat-title__sub">Tìm phòng nhanh • Gợi ý theo nhu cầu</div>
              </div>
            </div>
            <div className="hb-chat-actions">
              <button type="button" className="hb-chat-iconbtn" onClick={handleMinimize} aria-label="Thu gọn">
                <FiMinus />
              </button>
              <button type="button" className="hb-chat-iconbtn" onClick={handleClose} aria-label="Đóng">
                <FiX />
              </button>
            </div>
          </div>

          {!minimized ? (
            <>
              <div className="hb-chat-body" ref={listRef}>
                {messages.map((m) => (
                  <div key={m.id} className={`hb-chat-row ${m.role === 'user' ? 'hb-chat-row--user' : ''}`}>
                    {renderMessage(m)}
                  </div>
                ))}

                {!hasUserMessage ? (
                  <div className="hb-chat-quick">
                    {quickActions.map((a) => (
                      <button
                        key={a.label}
                        type="button"
                        className="hb-chat-chip"
                        onClick={() => send(a.text)}
                      >
                        <span className="hb-chat-chip__icon">{a.icon}</span>
                        {a.label}
                      </button>
                    ))}
                  </div>
                ) : null}

                {isTyping ? (
                  <div className="hb-chat-row">
                    <div className="hb-chat-bubble hb-chat-bubble--bot">
                      <div className="hb-chat-typing">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <form className="hb-chat-input" onSubmit={onSubmit}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder='Ví dụ: "Tìm phòng 2 người từ 5/2 đến 7/2 dưới 600k"'
                  rows={1}
                />
                <button type="submit" className="hb-chat-send" disabled={!normalizeSpaces(input) || isTyping}>
                  <FiSend />
                </button>
              </form>
              <div className="hb-chat-hint">Bạn có thể nhập ngày dạng <b>5/2</b> (không cần năm).</div>
            </>
          ) : (
            <button className="hb-chat-minbar" type="button" onClick={handleMinimize}>
              <FiMessageCircle /> <span>Mở lại chat</span>
            </button>
          )}
        </div>
      )}
    </>
  );
}
