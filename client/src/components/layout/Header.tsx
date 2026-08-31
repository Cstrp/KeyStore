import { SearchIcon, User2Icon } from 'lucide-react';
import { CatalogMenu } from '../CatalogMenu';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Input } from '../ui/input';

export const Header = () => {
  const [catalogOpen, setCatalogOpen] = useState<boolean>(false);

  return (
    <header className="relative flex items-center gap-6 h-15.5">
      <div className="header-left">
        <Button
          type="button"
          className="flex items-center gap-1.5"
          onClick={() => setCatalogOpen((value) => !value)}
        >
          <span>▦</span>
          Каталог
        </Button>

        {catalogOpen && <CatalogMenu />}
      </div>

      <div className="flex flex-1 m-0 m-auto">
        <Input
          type="search"
          placeholder="Игра, приложение или услуга..."
          className="flex-1"
        />

        <Button type="button">
          <SearchIcon size={16} />
        </Button>
      </div>

      <Button type="button" className="profile-button">
        <User2Icon size={16} />
      </Button>
    </header>
  );
};
