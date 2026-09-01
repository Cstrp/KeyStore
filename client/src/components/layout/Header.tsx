import { SearchIcon, User2Icon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CatalogMenu } from '../CatalogMenu';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

type HeaderSession = {
  user?: {
    email?: string | null;
    name?: string | null;
  } | null;
};

type HeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
  session?: HeaderSession | null;
  sessionPending?: boolean;
  onAccountClick: () => void;
};

export const Header = ({
  search,
  onSearchChange,
  session,
  sessionPending,
  onAccountClick,
}: HeaderProps) => {
  const [catalogOpen, setCatalogOpen] = useState(false);
  const catalogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!catalogRef.current?.contains(event.target as Node)) {
        setCatalogOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  const handleCatalogSelect = (value: string) => {
    onSearchChange(value);
    setCatalogOpen(false);
  };

  const accountLabel = sessionPending
    ? 'Загрузка…'
    : session?.user?.name || session?.user?.email || 'Войти';

  return (
    <header className="sticky top-0 z-40 flex h-18 items-center gap-4 border-b border-slate-200/80 bg-white/90 px-6 backdrop-blur-xl lg:px-10">
      <div className="relative" ref={catalogRef}>
        <Button
          type="button"
          className="h-11 rounded-xl bg-slate-950 px-5 text-white shadow-lg shadow-slate-950/15 transition duration-300 hover:-translate-y-0.5 hover:bg-violet-600"
          onClick={() => setCatalogOpen((value) => !value)}
          aria-expanded={catalogOpen}
        >
          <span aria-hidden="true">▦</span>
          Каталог
        </Button>

        {catalogOpen && <CatalogMenu onSelect={handleCatalogSelect} />}
      </div>

      <div className="mx-auto flex max-w-2xl flex-1 items-center rounded-xl border border-slate-200 bg-slate-50 p-1 transition duration-300 focus-within:border-violet-300 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-violet-100">
        <Input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Игра, приложение или сервис..."
          aria-label="Поиск товаров"
          className="h-9 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
        />

        <Button type="button" size="icon" variant="ghost" className="rounded-lg text-slate-500 hover:bg-violet-100 hover:text-violet-700" aria-label="Поиск">
          <SearchIcon size={16} />
        </Button>
      </div>

      <Button
        type="button"
        variant="ghost"
        className="h-11 max-w-52 gap-2 rounded-xl px-4 text-slate-700 transition duration-300 hover:bg-violet-50 hover:text-violet-700"
        aria-label={session ? 'Меню аккаунта' : 'Войти'}
        onClick={onAccountClick}
      >
        <User2Icon size={16} />
        <span>{accountLabel}</span>
      </Button>
    </header>
  );
};
