import { useState } from "react";
import Icon from "@/components/ui/icon";

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "chats" | "channels" | "search" | "contacts" | "favorites" | "settings";

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread?: number;
  online?: boolean;
  pinned?: boolean;
  muted?: boolean;
}

interface Message {
  id: number;
  text: string;
  time: string;
  isMe: boolean;
  reactions?: { emoji: string; count: number }[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CHATS: Chat[] = [
  { id: 1, name: "Алексей Громов", avatar: "АГ", lastMsg: "Окей, встретимся в 18:00!", time: "18:42", unread: 3, online: true, pinned: true },
  { id: 2, name: "Команда Дизайн", avatar: "КД", lastMsg: "Новые макеты готовы к ревью", time: "17:55", unread: 12, pinned: true },
  { id: 3, name: "Мария Светлова", avatar: "МС", lastMsg: "Спасибо за помощь 🙏", time: "16:30", online: true },
  { id: 4, name: "Дев Чат", avatar: "DC", lastMsg: "Деплой прошёл успешно ✅", time: "15:10", unread: 2 },
  { id: 5, name: "Игорь Полянский", avatar: "ИП", lastMsg: "Ты сегодня в офисе?", time: "14:20" },
  { id: 6, name: "Анна Коваль", avatar: "АК", lastMsg: "Отправила файлы на почту", time: "13:05", online: true },
  { id: 7, name: "Маркетинг", avatar: "МК", lastMsg: "Встреча в пятницу в 11:00", time: "11:30", muted: true },
  { id: 8, name: "Пётр Зайцев", avatar: "ПЗ", lastMsg: "👍", time: "вчера" },
  { id: 9, name: "Сервис поддержки", avatar: "СП", lastMsg: "Ваш запрос обработан", time: "вчера" },
];

const CHANNELS: Chat[] = [
  { id: 101, name: "TechNews Daily", avatar: "TN", lastMsg: "Apple представила новый MacBook Pro M4", time: "19:00", unread: 8 },
  { id: 102, name: "Crypto Insider", avatar: "CI", lastMsg: "BTC пробил $75k — что дальше?", time: "18:30", unread: 24 },
  { id: 103, name: "Design Digest", avatar: "DD", lastMsg: "Тренды UI 2026: что использовать", time: "17:00" },
  { id: 104, name: "Стартап Журнал", avatar: "СЖ", lastMsg: "Как поднять первый раунд за 3 месяца", time: "15:45", unread: 5 },
  { id: 105, name: "Dev Weekly", avatar: "DW", lastMsg: "Топ-10 open source проектов недели", time: "13:00" },
];

const CONTACTS = [
  { id: 1, name: "Алексей Громов", status: "В сети", avatar: "АГ", online: true },
  { id: 2, name: "Анна Коваль", status: "В сети", avatar: "АК", online: true },
  { id: 3, name: "Мария Светлова", status: "В сети", avatar: "МС", online: true },
  { id: 4, name: "Дмитрий Орлов", status: "Был в сети час назад", avatar: "ДО" },
  { id: 5, name: "Екатерина Лисова", status: "Была вчера", avatar: "ЕЛ" },
  { id: 6, name: "Игорь Полянский", status: "Был в сети 3 часа назад", avatar: "ИП" },
  { id: 7, name: "Пётр Зайцев", status: "Был вчера", avatar: "ПЗ" },
];

const FAVORITES = [
  { id: 1, text: "Идея для нового продукта: AI-ассистент для командных встреч 🤖", time: "Сегодня 14:30" },
  { id: 2, text: "Пароль от сервера: ******* (скопировать в keeper)", time: "Вчера 09:15" },
  { id: 3, text: "Книги к прочтению: Thinking Fast and Slow, Zero to One, Alchemy", time: "22 апр, 18:00" },
  { id: 4, text: "Встреча с инвесторами — 27 апреля, 15:00, офис Technocenter", time: "21 апр, 11:30" },
];

const MESSAGES: Message[] = [
  { id: 1, text: "Привет! Как дела?", time: "18:20", isMe: false },
  { id: 2, text: "Отлично, работаю над новым проектом 🚀", time: "18:21", isMe: true },
  { id: 3, text: "О, здорово! Расскажи поподробнее", time: "18:22", isMe: false },
  { id: 4, text: "Это мессенджер с тёмной темой. Очень удобно работать ночью!", time: "18:25", isMe: true, reactions: [{ emoji: "👍", count: 2 }] },
  { id: 5, text: "Выглядит крутo! Когда можно попробовать?", time: "18:30", isMe: false },
  { id: 6, text: "Уже скоро 😊 Тестируем последние детали", time: "18:35", isMe: true },
  { id: 7, text: "Жду с нетерпением! Удачи с разработкой 🙌", time: "18:40", isMe: false },
  { id: 8, text: "Окей, встретимся в 18:00!", time: "18:42", isMe: false },
];

const STICKERS = ["😄", "😂", "🥰", "🤔", "😎", "🔥", "👍", "❤️", "🎉", "😢", "😡", "🤯", "💀", "👻", "🚀", "⭐", "🌈", "💎"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavIcon({ icon, label, active, badge, onClick }: {
  icon: string; label: string; active?: boolean; badge?: number; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 w-14 ${
        active
          ? "text-[hsl(213,90%,60%)]"
          : "text-[hsl(220,10%,45%)] hover:text-[hsl(220,10%,70%)] hover:bg-[hsl(220,12%,14%)]"
      }`}
      title={label}
    >
      {active && (
        <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-[hsl(213,90%,60%)] rounded-r-full" />
      )}
      <Icon name={icon} size={22} />
      {badge != null && badge > 0 && (
        <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-[hsl(213,90%,60%)] text-[10px] font-bold text-[hsl(220,16%,8%)] rounded-full flex items-center justify-center px-1">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
      <span className="text-[10px] leading-none">{label}</span>
    </button>
  );
}

function ChatRow({ chat, active, onClick }: { chat: Chat; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left ${
        active ? "bg-[hsl(220,12%,16%)]" : "hover:bg-[hsl(220,12%,14%)]"
      }`}
    >
      <div className="relative flex-shrink-0">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[hsl(213,70%,40%)] to-[hsl(270,60%,45%)] flex items-center justify-center text-xs font-bold text-white select-none">
          {chat.avatar}
        </div>
        {chat.online && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-[hsl(145,60%,45%)] rounded-full border-2 border-[hsl(220,16%,6%)]" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-sm font-semibold text-[hsl(220,15%,88%)] truncate flex items-center gap-1">
            {chat.pinned && <Icon name="Pin" size={12} className="text-[hsl(213,90%,60%)] flex-shrink-0" />}
            {chat.name}
          </span>
          <span className="text-[11px] text-[hsl(220,8%,45%)] flex-shrink-0 ml-1">{chat.time}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-[hsl(220,8%,50%)] truncate">{chat.lastMsg}</p>
          <div className="flex items-center gap-1 flex-shrink-0 ml-1">
            {chat.muted && <Icon name="BellOff" size={12} className="text-[hsl(220,8%,40%)]" />}
            {chat.unread != null && chat.unread > 0 && (
              <span className={`min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1 ${
                chat.muted ? "bg-[hsl(220,10%,30%)] text-[hsl(220,8%,55%)]" : "bg-[hsl(213,90%,60%)] text-[hsl(220,16%,8%)]"
              }`}>
                {chat.unread}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  return (
    <div className={`flex ${msg.isMe ? "justify-end" : "justify-start"} animate-message-in`}>
      <div className={`max-w-[72%] ${msg.isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          msg.isMe
            ? "bg-[hsl(213,60%,25%)] text-[hsl(220,15%,92%)] rounded-br-sm"
            : "bg-[hsl(220,14%,15%)] text-[hsl(220,12%,85%)] rounded-bl-sm"
        }`}>
          {msg.text}
        </div>
        <div className="flex items-center gap-2">
          {msg.reactions && msg.reactions.map((r, i) => (
            <button key={i} className="flex items-center gap-1 bg-[hsl(220,12%,16%)] hover:bg-[hsl(220,12%,20%)] rounded-full px-2 py-0.5 text-xs transition-colors">
              {r.emoji} <span className="text-[hsl(220,8%,60%)]">{r.count}</span>
            </button>
          ))}
          <span className={`text-[10px] text-[hsl(220,8%,40%)] ${msg.isMe ? "order-first" : ""}`}>{msg.time}</span>
          {msg.isMe && <Icon name="CheckCheck" size={14} className="text-[hsl(213,90%,60%)]" />}
        </div>
      </div>
    </div>
  );
}

// ─── Panels ───────────────────────────────────────────────────────────────────

function ChatsPanel({ items, active, onSelect, title }: {
  items: Chat[]; active: number | null; onSelect: (id: number) => void; title: string;
}) {
  const [search, setSearch] = useState("");
  const pinned = items.filter(c => c.pinned && c.name.toLowerCase().includes(search.toLowerCase()));
  const rest = items.filter(c => !c.pinned && c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3">
        <h2 className="text-lg font-bold text-[hsl(220,15%,90%)] mb-3">{title}</h2>
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(220,8%,40%)]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск..."
            className="w-full bg-[hsl(220,12%,14%)] rounded-xl pl-9 pr-4 py-2 text-sm text-[hsl(220,12%,80%)] placeholder:text-[hsl(220,8%,40%)] outline-none focus:ring-1 focus:ring-[hsl(213,90%,60%)] transition-all"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5 pb-4">
        {pinned.length > 0 && (
          <>
            <p className="text-[10px] uppercase tracking-widest text-[hsl(220,8%,38%)] px-3 py-2 font-semibold">Закреплённые</p>
            {pinned.map(c => <ChatRow key={c.id} chat={c} active={active === c.id} onClick={() => onSelect(c.id)} />)}
            <div className="h-px bg-[hsl(220,12%,16%)] mx-3 my-2" />
          </>
        )}
        {rest.map(c => <ChatRow key={c.id} chat={c} active={active === c.id} onClick={() => onSelect(c.id)} />)}
      </div>
    </div>
  );
}

function ChatView({ chat }: { chat: Chat | undefined }) {
  const [input, setInput] = useState("");
  const [showStickers, setShowStickers] = useState(false);
  const [messages, setMessages] = useState<Message[]>(MESSAGES);

  const send = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), text: input.trim(), time: "сейчас", isMe: true }]);
    setInput("");
  };

  if (!chat) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-3xl bg-[hsl(220,14%,10%)] flex items-center justify-center">
        <Icon name="MessageCircle" size={36} className="text-[hsl(220,8%,35%)]" />
      </div>
      <div>
        <p className="text-[hsl(220,10%,55%)] font-medium">Выберите чат</p>
        <p className="text-[hsl(220,8%,38%)] text-sm mt-1">или начните новый разговор</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full animate-fade-in">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[hsl(220,12%,16%)] bg-[hsl(220,14%,10%)]">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(213,70%,40%)] to-[hsl(270,60%,45%)] flex items-center justify-center text-xs font-bold text-white">
            {chat.avatar}
          </div>
          {chat.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[hsl(145,60%,45%)] rounded-full border-2 border-[hsl(220,14%,10%)]" />}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-[hsl(220,15%,90%)]">{chat.name}</p>
          <p className="text-xs text-[hsl(145,60%,45%)]">{chat.online ? "В сети" : chat.time}</p>
        </div>
        <div className="flex items-center gap-1">
          {[{ icon: "Phone" }, { icon: "Video" }, { icon: "MoreVertical" }].map(b => (
            <button key={b.icon} className="p-2 rounded-lg hover:bg-[hsl(220,12%,14%)] text-[hsl(220,8%,50%)] hover:text-[hsl(220,12%,75%)] transition-colors">
              <Icon name={b.icon} size={18} />
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={msg.id} style={{ animationDelay: `${i * 0.04}s` }}>
            <MessageBubble msg={msg} />
          </div>
        ))}
      </div>

      <div className="px-4 pb-4 pt-2 border-t border-[hsl(220,12%,16%)]">
        {showStickers && (
          <div className="mb-2 p-3 bg-[hsl(220,14%,10%)] rounded-2xl border border-[hsl(220,12%,16%)] grid grid-cols-9 gap-2 animate-slide-up">
            {STICKERS.map((s, i) => (
              <button key={i} onClick={() => { setInput(p => p + s); setShowStickers(false); }}
                className="text-xl hover:scale-125 transition-transform">
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2">
          <button onClick={() => setShowStickers(p => !p)}
            className="p-2.5 rounded-xl hover:bg-[hsl(220,12%,14%)] text-[hsl(220,8%,45%)] hover:text-[hsl(220,12%,70%)] transition-colors flex-shrink-0">
            <Icon name="Smile" size={20} />
          </button>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Написать сообщение..."
            rows={1}
            className="flex-1 bg-[hsl(220,12%,14%)] rounded-2xl px-4 py-3 text-sm text-[hsl(220,12%,85%)] placeholder:text-[hsl(220,8%,40%)] outline-none focus:ring-1 focus:ring-[hsl(213,90%,60%)] resize-none transition-all leading-relaxed"
            style={{ maxHeight: "120px", overflowY: "auto" }}
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-[hsl(213,90%,60%)] hover:bg-[hsl(213,85%,55%)] disabled:opacity-40 disabled:cursor-not-allowed text-[hsl(220,16%,8%)] transition-all flex-shrink-0 hover:scale-105 active:scale-95"
          >
            <Icon name="Send" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SearchPanel() {
  const [q, setQ] = useState("");
  const all = [...CHATS, ...CHANNELS];
  const results = q.length > 1 ? all.filter(c => c.name.toLowerCase().includes(q.toLowerCase()) || c.lastMsg.toLowerCase().includes(q.toLowerCase())) : [];

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3">
        <h2 className="text-lg font-bold text-[hsl(220,15%,90%)] mb-3">Поиск</h2>
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(213,90%,60%)]" />
          <input
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Чаты, каналы, сообщения..."
            className="w-full bg-[hsl(220,12%,14%)] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[hsl(220,12%,80%)] placeholder:text-[hsl(220,8%,40%)] outline-none focus:ring-1 focus:ring-[hsl(213,90%,60%)] transition-all"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {q.length < 2 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
            <Icon name="Search" size={40} className="text-[hsl(220,8%,30%)]" />
            <p className="text-[hsl(220,8%,45%)] text-sm">Введите минимум 2 символа для поиска</p>
          </div>
        )}
        {q.length >= 2 && results.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <p className="text-[hsl(220,8%,45%)] text-sm">Ничего не найдено</p>
          </div>
        )}
        {results.map(c => (
          <div key={c.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[hsl(220,12%,14%)] cursor-pointer transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(213,70%,40%)] to-[hsl(270,60%,45%)] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {c.avatar}
            </div>
            <div>
              <p className="text-sm font-medium text-[hsl(220,15%,85%)]">{c.name}</p>
              <p className="text-xs text-[hsl(220,8%,45%)] truncate">{c.lastMsg}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactsPanel() {
  const online = CONTACTS.filter(c => c.online);
  const offline = CONTACTS.filter(c => !c.online);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[hsl(220,15%,90%)]">Контакты</h2>
        <button className="p-2 rounded-lg hover:bg-[hsl(220,12%,14%)] text-[hsl(213,90%,60%)] transition-colors">
          <Icon name="UserPlus" size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
        <p className="text-[10px] uppercase tracking-widest text-[hsl(220,8%,38%)] px-3 py-2 font-semibold">В сети — {online.length}</p>
        {online.map(c => (
          <div key={c.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[hsl(220,12%,14%)] cursor-pointer transition-colors">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(213,70%,40%)] to-[hsl(270,60%,45%)] flex items-center justify-center text-xs font-bold text-white">{c.avatar}</div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[hsl(145,60%,45%)] rounded-full border-2 border-[hsl(220,16%,6%)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[hsl(220,15%,85%)]">{c.name}</p>
              <p className="text-xs text-[hsl(145,60%,45%)]">{c.status}</p>
            </div>
            <button className="p-1.5 rounded-lg hover:bg-[hsl(220,12%,16%)] text-[hsl(220,8%,40%)] hover:text-[hsl(220,12%,70%)] transition-colors">
              <Icon name="MessageCircle" size={16} />
            </button>
          </div>
        ))}
        <div className="h-px bg-[hsl(220,12%,16%)] mx-3 my-2" />
        <p className="text-[10px] uppercase tracking-widest text-[hsl(220,8%,38%)] px-3 py-2 font-semibold">Не в сети — {offline.length}</p>
        {offline.map(c => (
          <div key={c.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[hsl(220,12%,14%)] cursor-pointer transition-colors opacity-70">
            <div className="w-10 h-10 rounded-full bg-[hsl(220,12%,20%)] flex items-center justify-center text-xs font-medium text-[hsl(220,8%,55%)]">{c.avatar}</div>
            <div>
              <p className="text-sm font-medium text-[hsl(220,12%,72%)]">{c.name}</p>
              <p className="text-xs text-[hsl(220,8%,40%)]">{c.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FavoritesPanel() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3">
        <h2 className="text-lg font-bold text-[hsl(220,15%,90%)]">Избранное</h2>
        <p className="text-xs text-[hsl(220,8%,45%)] mt-1">Ваши сохранённые заметки и сообщения</p>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2">
        {FAVORITES.map((f, i) => (
          <div key={f.id}
            className="bg-[hsl(220,14%,10%)] rounded-2xl p-4 border border-[hsl(220,12%,16%)] hover:border-[hsl(213,40%,25%)] cursor-pointer transition-all animate-slide-up group"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <p className="text-sm text-[hsl(220,12%,80%)] leading-relaxed">{f.text}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-[11px] text-[hsl(220,8%,40%)]">{f.time}</span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 rounded hover:bg-[hsl(220,12%,14%)] text-[hsl(220,8%,45%)] hover:text-[hsl(220,12%,70%)] transition-colors">
                  <Icon name="Copy" size={14} />
                </button>
                <button className="p-1 rounded hover:bg-[hsl(220,12%,14%)] text-[hsl(220,8%,45%)] hover:text-[hsl(0,60%,50%)] transition-colors">
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsPanel() {
  const [notifs, setNotifs] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [preview, setPreview] = useState(false);
  const [twofa, setTwofa] = useState(false);

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`w-11 h-6 rounded-full transition-all duration-200 relative flex-shrink-0 ${value ? "bg-[hsl(213,90%,60%)]" : "bg-[hsl(220,12%,22%)]"}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-200 ${value ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
      <p className="text-[10px] uppercase tracking-widest text-[hsl(220,8%,38%)] px-1 mb-2 font-semibold">{title}</p>
      <div className="bg-[hsl(220,14%,10%)] rounded-2xl border border-[hsl(220,12%,16%)] overflow-hidden divide-y divide-[hsl(220,12%,14%)]">
        {children}
      </div>
    </div>
  );

  const Row = ({ icon, label, sub, action }: { icon: string; label: string; sub?: string; action?: React.ReactNode }) => (
    <div className="flex items-center gap-3 px-4 py-3.5 hover:bg-[hsl(220,12%,14%)] transition-colors cursor-pointer">
      <div className="w-8 h-8 rounded-xl bg-[hsl(220,12%,18%)] flex items-center justify-center flex-shrink-0">
        <Icon name={icon} size={16} className="text-[hsl(213,90%,60%)]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[hsl(220,12%,82%)]">{label}</p>
        {sub && <p className="text-xs text-[hsl(220,8%,42%)]">{sub}</p>}
      </div>
      {action || <Icon name="ChevronRight" size={16} className="text-[hsl(220,8%,35%)]" />}
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3">
        <h2 className="text-lg font-bold text-[hsl(220,15%,90%)]">Настройки</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <Section title="Уведомления">
          <Row icon="Bell" label="Push-уведомления" sub="Для новых сообщений" action={<Toggle value={notifs} onChange={() => setNotifs(p => !p)} />} />
          <Row icon="Volume2" label="Звуки" sub="Звуковые оповещения" action={<Toggle value={sounds} onChange={() => setSounds(p => !p)} />} />
          <Row icon="Eye" label="Превью сообщений" sub="Показывать текст в уведомлениях" action={<Toggle value={preview} onChange={() => setPreview(p => !p)} />} />
        </Section>
        <Section title="Безопасность">
          <Row icon="ShieldCheck" label="Двухфакторная аутентификация" sub={twofa ? "Включена" : "Выключена"} action={<Toggle value={twofa} onChange={() => setTwofa(p => !p)} />} />
          <Row icon="Lock" label="Изменить пароль" />
          <Row icon="Smartphone" label="Активные сессии" sub="3 устройства" />
        </Section>
        <Section title="Конфиденциальность">
          <Row icon="UserCheck" label="Кто видит мой статус" sub="Только контакты" />
          <Row icon="Clock" label="Последний визит" sub="Только контакты" />
        </Section>
        <Section title="Приложение">
          <Row icon="Globe" label="Язык" sub="Русский" />
          <Row icon="HardDrive" label="Использование памяти" sub="284 МБ" />
          <Row icon="HelpCircle" label="Поддержка" />
          <Row icon="Info" label="О приложении" sub="Версия 1.0.0" />
        </Section>
        <div className="mt-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-[hsl(0,30%,12%)] border border-[hsl(0,25%,18%)] text-[hsl(0,65%,58%)] hover:bg-[hsl(0,30%,15%)] transition-colors">
            <Icon name="LogOut" size={16} />
            <span className="text-sm font-medium">Выйти из аккаунта</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfilePanel() {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="h-32 bg-gradient-to-br from-[hsl(213,70%,28%)] via-[hsl(240,60%,30%)] to-[hsl(270,55%,25%)]" />
      <div className="px-5 pb-5">
        <div className="flex items-end justify-between -mt-10 mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[hsl(213,80%,50%)] to-[hsl(270,70%,55%)] flex items-center justify-center text-2xl font-bold text-white border-4 border-[hsl(220,16%,8%)] shadow-2xl">
              ВМ
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[hsl(145,60%,45%)] rounded-full border-2 border-[hsl(220,16%,8%)]" />
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[hsl(220,14%,10%)] border border-[hsl(220,12%,16%)] text-sm text-[hsl(220,12%,75%)] hover:border-[hsl(213,90%,60%)] transition-all">
            <Icon name="Pencil" size={14} />
            Редактировать
          </button>
        </div>
        <div className="space-y-1 mb-5">
          <h3 className="text-xl font-bold text-[hsl(220,15%,92%)]">Василий Морозов</h3>
          <p className="text-sm text-[hsl(220,8%,50%)]">@morozov_dev</p>
          <p className="text-sm text-[hsl(220,10%,65%)] mt-2 leading-relaxed">Разработчик, космический энтузиаст 🚀 Люблю чистый код и красивый UI</p>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[{ label: "Контакты", val: "248" }, { label: "Чаты", val: "91" }, { label: "Каналы", val: "17" }].map(s => (
            <div key={s.label} className="bg-[hsl(220,14%,10%)] rounded-2xl p-3 text-center border border-[hsl(220,12%,16%)]">
              <p className="text-lg font-bold text-[hsl(213,90%,60%)]">{s.val}</p>
              <p className="text-xs text-[hsl(220,8%,45%)] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {[
            { icon: "Phone", val: "+7 (900) 123-45-67" },
            { icon: "Mail", val: "morozov@mail.ru" },
            { icon: "MapPin", val: "Москва, Россия" },
            { icon: "Calendar", val: "Зарегистрирован 12 января 2024" },
          ].map(r => (
            <div key={r.val} className="flex items-center gap-3 px-1">
              <Icon name={r.icon} size={16} className="text-[hsl(213,90%,60%)] flex-shrink-0" />
              <span className="text-sm text-[hsl(220,10%,65%)]">{r.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Index() {
  const [tab, setTab] = useState<Tab>("chats");
  const [activeChat, setActiveChat] = useState<number | null>(1);
  const [showProfile, setShowProfile] = useState(false);

  const allChats = [...CHATS, ...CHANNELS];
  const currentChat = allChats.find(c => c.id === activeChat);

  const totalUnread = CHATS.reduce((a, c) => a + (c.unread || 0), 0);
  const channelUnread = CHANNELS.reduce((a, c) => a + (c.unread || 0), 0);

  const openChat = (id: number) => {
    setActiveChat(id);
    setShowProfile(false);
  };

  const setTabAndHideProfile = (t: Tab) => {
    setTab(t);
    setShowProfile(false);
  };

  const showChat = tab === "chats" || tab === "channels";

  const renderPanel = () => {
    switch (tab) {
      case "chats": return <ChatsPanel items={CHATS} active={activeChat} onSelect={openChat} title="Сообщения" />;
      case "channels": return <ChatsPanel items={CHANNELS} active={activeChat} onSelect={openChat} title="Каналы" />;
      case "search": return <SearchPanel />;
      case "contacts": return <ContactsPanel />;
      case "favorites": return <FavoritesPanel />;
      case "settings": return <SettingsPanel />;
    }
  };

  return (
    <div className="h-screen w-screen flex bg-[hsl(220,16%,8%)] overflow-hidden" style={{ fontFamily: "'Golos Text', sans-serif" }}>
      {/* Nav */}
      <nav className="w-16 flex flex-col items-center py-4 bg-[hsl(220,16%,6%)] border-r border-[hsl(220,12%,14%)] flex-shrink-0 z-10">
        <button
          onClick={() => { setTab("chats"); setShowProfile(true); }}
          className="mb-5 w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(213,80%,50%)] to-[hsl(270,70%,55%)] flex items-center justify-center text-xs font-bold text-white hover:scale-105 transition-transform flex-shrink-0 ring-2 ring-transparent hover:ring-[hsl(213,90%,60%)]"
          title="Профиль"
        >
          ВМ
        </button>
        <div className="flex flex-col items-center gap-1 flex-1">
          <NavIcon icon="MessageCircle" label="Чаты" active={tab === "chats" && !showProfile} badge={totalUnread} onClick={() => setTabAndHideProfile("chats")} />
          <NavIcon icon="Radio" label="Каналы" active={tab === "channels"} badge={channelUnread} onClick={() => setTabAndHideProfile("channels")} />
          <NavIcon icon="Search" label="Поиск" active={tab === "search"} onClick={() => setTabAndHideProfile("search")} />
          <NavIcon icon="Users" label="Контакты" active={tab === "contacts"} onClick={() => setTabAndHideProfile("contacts")} />
          <NavIcon icon="Star" label="Избранное" active={tab === "favorites"} onClick={() => setTabAndHideProfile("favorites")} />
        </div>
        <NavIcon icon="Settings" label="Настройки" active={tab === "settings"} onClick={() => setTabAndHideProfile("settings")} />
      </nav>

      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 bg-[hsl(220,16%,6%)] border-r border-[hsl(220,12%,14%)] flex flex-col overflow-hidden">
        {showProfile ? <ProfilePanel /> : renderPanel()}
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col bg-[hsl(220,16%,8%)] overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(213,90%,80%) 1px, transparent 0)", backgroundSize: "32px 32px" }}
        />
        {showChat ? (
          <ChatView chat={currentChat} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-[hsl(220,14%,10%)] border border-[hsl(220,12%,16%)] flex items-center justify-center">
              {tab === "search" && <Icon name="Search" size={28} className="text-[hsl(213,90%,60%)]" />}
              {tab === "contacts" && <Icon name="Users" size={28} className="text-[hsl(213,90%,60%)]" />}
              {tab === "favorites" && <Icon name="Star" size={28} className="text-[hsl(213,90%,60%)]" />}
              {tab === "settings" && <Icon name="Settings" size={28} className="text-[hsl(213,90%,60%)]" />}
            </div>
            <div>
              <p className="text-[hsl(220,10%,55%)] font-medium">
                {tab === "search" && "Найдите чаты и каналы"}
                {tab === "contacts" && "Выберите контакт для чата"}
                {tab === "favorites" && "Ваши сохранённые материалы"}
                {tab === "settings" && "Настройте приложение"}
              </p>
              <p className="text-[hsl(220,8%,38%)] text-sm mt-1">Используйте панель слева</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
