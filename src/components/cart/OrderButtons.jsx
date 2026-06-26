import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ClipboardCheck, X } from "lucide-react";
import {
  buildOrderLinks,
  buildOrderMessage,
  PREFILLS_TEXT,
} from "../../utils/orderMessage";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.8 9.8 0 0 0 12.04 2zm0 18.08h-.01a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.12.82.83-3.04-.2-.31a8.15 8.15 0 0 1-1.26-4.38c0-4.5 3.66-8.16 8.19-8.16 2.19 0 4.25.85 5.8 2.4a8.13 8.13 0 0 1 2.41 5.79c0 4.5-3.66 8.16-8.21 8.16z"
    />
    <path
      fill="currentColor"
      d="M16.52 14.38c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-.99-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.91 2.44 1.04 2.6.12.17 1.79 2.73 4.33 3.83.61.26 1.08.42 1.45.54.61.19 1.16.16 1.6.1.49-.07 1.47-.6 1.67-1.18.2-.58.2-1.08.14-1.18-.06-.1-.23-.16-.48-.28z"
    />
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.11.3z"
    />
  </svg>
);

const MaxIcon = () => (
  <span className="text-[13px] font-semibold leading-none tracking-tight">max</span>
);

const channels = [
  { id: "whatsapp", label: "WhatsApp", Icon: WhatsAppIcon },
  { id: "telegram", label: "Telegram", Icon: TelegramIcon },
  { id: "max", label: "Max", Icon: MaxIcon },
];

function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => legacyCopy(text));
    return;
  }
  legacyCopy(text);
}

function legacyCopy(text) {
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "-9999px";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    document.body.removeChild(area);
  } catch {
    // Игнорируем — пользователь сможет ввести заказ вручную.
  }
}

const toneStyles = {
  light: {
    heading: "text-[#1c1c1c]/40",
    note: "text-[#1c1c1c]/45",
    button:
      "border-[#1c1c1c]/15 bg-white text-[#1c1c1c] hover:border-[#1c1c1c]/30 hover:bg-[#f3eee6]",
  },
  dark: {
    heading: "text-[#f3ede5]/55",
    note: "text-[#f3ede5]/45",
    button:
      "border-white/15 bg-white/[0.06] text-[#f3ede5] hover:border-white/35 hover:bg-white/[0.12]",
  },
};

export default function OrderButtons({
  items,
  totalPrice,
  customer,
  message,
  heading = "Оформить заказ через мессенджер",
  tone = "light",
  className = "",
}) {
  const styles = toneStyles[tone] ?? toneStyles.light;
  const [hint, setHint] = useState(null);
  const hideTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  const dismissHint = () => {
    window.clearTimeout(hideTimer.current);
    setHint(null);
  };

  const openLink = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleOrder = (id, label) => {
    const msg = message ?? buildOrderMessage({ items, totalPrice, customer });
    const links = buildOrderLinks(msg);

    // WhatsApp / Max открывают чат с уже подставленным текстом — сразу переход.
    if (PREFILLS_TEXT[id]) {
      openLink(links[id]);
      return;
    }

    // Telegram: копируем текст в буфер (с запасным способом) ДО перехода и
    // показываем карточку с инструкцией и кнопкой открытия чата.
    copyToClipboard(msg);
    window.clearTimeout(hideTimer.current);
    setHint({ url: links[id], label });
    hideTimer.current = window.setTimeout(() => setHint(null), 20000);
  };

  return (
    <div className={className}>
      <p
        className={`font-sans text-[11px] uppercase tracking-[0.12em] ${styles.heading}`}
      >
        {heading}
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2.5">
        {channels.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleOrder(id, label)}
            className={`flex h-[50px] items-center justify-center gap-2.5 rounded-full border font-sans text-[14px] font-medium site-motion ${styles.button}`}
          >
            <Icon />
            {label}
          </button>
        ))}
      </div>

      {hint &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[200] flex items-end justify-center px-4 pb-[max(16px,env(safe-area-inset-bottom))] sm:items-center sm:pb-4">
            <button
              type="button"
              aria-label="Закрыть"
              onClick={dismissHint}
              className="absolute inset-0 bg-[#1c1c1c]/40 site-fade-in"
            />
            <div className="relative w-full max-w-[440px] rounded-[20px] border border-[#1c1c1c]/10 bg-white p-5 shadow-[0_24px_60px_rgba(28,28,28,0.28)] site-fade-in">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1c1c1c] text-white">
                  <ClipboardCheck className="h-5 w-5" strokeWidth={1.9} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-sans text-[15px] font-semibold text-[#1c1c1c]">
                    Текст заказа скопирован
                  </p>
                  <p className="mt-1.5 font-sans text-[13px] leading-[1.55] text-[#1c1c1c]/65">
                    Мы сохранили ваш заказ в буфер обмена. Осталось три шага:
                  </p>
                  <ol className="mt-3 space-y-2">
                    {[
                      "Нажмите «Открыть Telegram» ниже — откроется наш чат.",
                      "В поле сообщения нажмите «Вставить» (или Ctrl/⌘ + V).",
                      "Отправьте сообщение — мы сразу ответим.",
                    ].map((step, i) => (
                      <li
                        key={i}
                        className="flex gap-2.5 font-sans text-[13px] leading-[1.45] text-[#1c1c1c]/80"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f0e9dd] text-[11px] font-semibold text-[#1c1c1c]">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
                <button
                  type="button"
                  onClick={dismissHint}
                  aria-label="Закрыть подсказку"
                  className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#1c1c1c]/40 site-motion hover:bg-[#1c1c1c]/5 hover:text-[#1c1c1c]/70"
                >
                  <X className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  openLink(hint.url);
                  dismissHint();
                }}
                className="mt-4 flex h-[50px] w-full items-center justify-center gap-2 rounded-full bg-[#1c1c1c] font-sans text-[14px] font-semibold text-white site-motion hover:bg-[#000]"
              >
                <TelegramIcon />
                Открыть {hint.label}
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
