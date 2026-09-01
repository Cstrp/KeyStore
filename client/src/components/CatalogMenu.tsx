type CatalogMenuProps = {
  onSelect: (value: string) => void;
};

const catalogGroups = [
  {
    title: 'Игры',
    items: ['Steam', 'PlayStation', 'Xbox', 'Roblox'],
  },
  {
    title: 'Подписки',
    items: ['Discord', 'Spotify', 'YouTube', 'Netflix'],
  },
  {
    title: 'Пополнения',
    items: ['Steam', 'Telegram', 'Roblox', 'App Store'],
  },
];

export const CatalogMenu = ({ onSelect }: CatalogMenuProps) => {
  return (
    <div className="absolute left-0 top-14 z-50 grid w-[min(680px,calc(100vw-3rem))] animate-in grid-cols-3 gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/15 fade-in slide-in-from-top-2 duration-200" role="menu" aria-label="Меню каталога">
      {catalogGroups.map((group) => (
        <div key={group.title} className="flex flex-col gap-1">
          <strong className="mb-2 text-sm text-slate-950">{group.title}</strong>
          {group.items.map((item) => (
            <button
              key={item}
              type="button"
              className="rounded-lg px-3 py-2 text-left text-sm text-slate-500 transition duration-200 hover:translate-x-1 hover:bg-violet-50 hover:text-violet-700"
              onClick={() => onSelect(item)}
              aria-label={`Открыть ${item}`}
            >
              {item}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};
