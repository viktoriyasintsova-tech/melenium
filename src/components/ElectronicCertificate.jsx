function FieldLine({ label, value, sample, widthClass }) {
  return (
    <span className="inline-flex items-end gap-1.5">
      {label}:
      {sample || !value ? (
        <span className={`inline-block border-b border-current/40 ${widthClass}`} />
      ) : (
        <span className="font-medium">{value}</span>
      )}
    </span>
  );
}

export default function ElectronicPreview({
  theme,
  amountToPreview,
  sample = true,
  recipient,
  dateText,
  code,
}) {
  const blockSave = (event) => {
    if (sample) event.preventDefault();
  };

  return (
    <div
      onContextMenu={blockSave}
      onDragStart={blockSave}
      className={`relative mx-auto w-full max-w-[720px] overflow-hidden rounded-[20px] border sm:rounded-[24px] ${
        sample ? "select-none" : ""
      } ${theme.lineClass} ${theme.cardClass} aspect-[3/4] sm:aspect-[4/5] lg:aspect-[16/10]`}
    >
      {theme.useBackground && (
        <>
          <img
            src={theme.background}
            alt=""
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
          <div className={`absolute inset-0 ${theme.overlayClass ?? "bg-black/35"}`} />
        </>
      )}

      <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-7 lg:p-9">
        <div className="flex items-start justify-between gap-3">
          <img
            src="/assets/logo.png"
            alt="Логотип Millennium"
            draggable={false}
            className={`pointer-events-none h-7 w-auto object-contain sm:h-9 lg:h-11 ${
              theme.logoClass ?? ""
            }`}
          />
          {sample && (
            <span className="rounded-full border border-current/40 px-2.5 py-1 font-sans text-[9px] font-semibold uppercase tracking-[0.16em] opacity-70 sm:text-[10px]">
              Образец
            </span>
          )}
        </div>

        <div>
          <p className="font-denistina text-[26px] leading-[0.9] sm:text-[36px] lg:text-[52px]">
            Электронный сертификат
          </p>
          <p className="mt-3 font-sans text-[28px] font-semibold leading-none sm:mt-4 sm:text-[40px] lg:text-[56px]">
            {amountToPreview}
          </p>
          <div className={`mt-4 w-full border-b sm:mt-5 ${theme.lineClass}`} />
          <div className="mt-3 flex flex-wrap items-end gap-x-6 gap-y-2 font-sans text-[11px] opacity-80 sm:text-[12px]">
            <FieldLine
              label="Кому"
              value={recipient}
              sample={sample}
              widthClass="w-20 sm:w-28"
            />
            <FieldLine
              label="Дата"
              value={dateText}
              sample={sample}
              widthClass="w-16 sm:w-24"
            />
          </div>
          <div className="mt-2 font-sans text-[11px] opacity-80 sm:text-[12px]">
            <span className="inline-flex items-end gap-1.5">
              Код подлинности:
              {sample || !code ? (
                <span className="inline-block w-28 border-b border-current/40 sm:w-40" />
              ) : (
                <span className="font-mono text-[11px] font-semibold tracking-[0.04em] sm:text-[12px]">
                  {code}
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {sample && (
        <>
          <div
            className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-center gap-5 overflow-hidden opacity-[0.14] sm:gap-7"
            aria-hidden="true"
          >
            {Array.from({ length: 7 }).map((_, i) => (
              <p
                key={i}
                className="-rotate-[20deg] whitespace-nowrap text-center font-sans text-[18px] font-semibold uppercase tracking-[0.35em] sm:text-[22px]"
              >
                Образец · Millennium · Образец · Millennium · Образец
              </p>
            ))}
          </div>
          <div className="absolute inset-0 z-30" />
        </>
      )}
    </div>
  );
}
