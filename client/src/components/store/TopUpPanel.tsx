type Currency = '$' | '₸' | '₽';

type TopUpPanelProps = {
  currency: Currency;
  onChange: (value: Currency) => void;
  options: readonly Currency[];
};

export const TopUpPanel = ({
  currency,
  onChange,
  options,
}: TopUpPanelProps) => {
  return (
    <section className="flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-8 md:flex-row md:items-center">
      <div>
        <p className="mb-2 text-xs font-bold tracking-[.2em] text-violet-600">ПОПУЛЯРНО</p>
        <h2 className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl">Пополните баланс Steam</h2>
        <p className="mt-2 text-slate-500">Выберите валюту и продолжайте, когда будете готовы.</p>
      </div>

      <div className="flex rounded-2xl border border-violet-100 bg-white p-1.5 shadow-lg shadow-violet-100/60" aria-label="Выбор валюты для Steam">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`size-11 rounded-xl text-sm font-bold transition-all duration-300 ${currency === option ? 'scale-105 bg-slate-950 text-white shadow-lg' : 'text-slate-400 hover:bg-violet-50 hover:text-violet-700'}`}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
};
