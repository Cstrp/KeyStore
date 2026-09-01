import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Button } from '../ui/button';
import hero from '../../assets/hero.png';
import type { StoreBanner } from '../../data/store';

type StoreHeroProps = {
  banners: StoreBanner[];
  activeBanner: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
};

export const StoreHero = ({
  banners,
  activeBanner,
  onPrev,
  onNext,
  onSelect,
}: StoreHeroProps) => {
  const banner = banners[activeBanner];

  return (
    <section className="relative grid min-h-[400px] overflow-hidden rounded-[2rem] bg-slate-950 px-8 py-12 text-white shadow-2xl shadow-slate-950/20 md:grid-cols-[1.15fr_.85fr] md:px-14">
      <div key={activeBanner} className="z-10 flex animate-in flex-col items-start justify-center fade-in slide-in-from-left-4 duration-500">
        <p className="mb-4 text-xs font-bold tracking-[.25em] text-violet-300">KEY STORE</p>
        <h1 className="max-w-2xl text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">{banner.title}</h1>
        <p className="mt-5 max-w-lg text-base leading-7 text-slate-300 md:text-lg">{banner.text}</p>
        <Button
          type="button"
          className="mt-8 h-12 rounded-xl bg-violet-500 px-6 font-semibold text-white shadow-xl shadow-violet-950/30 transition duration-300 hover:-translate-y-1 hover:bg-violet-400"
          onClick={() =>
            document
              .getElementById('products')
              ?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          Смотреть каталог
        </Button>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="absolute size-72 rounded-full bg-violet-500/25 blur-3xl" />
        <img src={hero} alt="Баннер магазина" className="relative z-10 w-full max-w-md object-contain drop-shadow-2xl transition duration-700 hover:scale-105 hover:rotate-1" />
      </div>

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/10 p-1.5 backdrop-blur-md">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="size-8 text-white hover:bg-white/15 hover:text-white"
          onClick={onPrev}
          aria-label="Предыдущий баннер"
        >
          <ArrowLeft size={16} />
        </Button>

        {banners.map((item, index) => (
          <button
            key={item.title}
            type="button"
            className={`h-2 rounded-full transition-all duration-500 ${index === activeBanner ? 'w-7 bg-violet-400' : 'w-2 bg-white/35 hover:bg-white/70'}`}
            aria-label={`Слайд ${index + 1}`}
            onClick={() => onSelect(index)}
          />
        ))}

        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="size-8 text-white hover:bg-white/15 hover:text-white"
          onClick={onNext}
          aria-label="Следующий баннер"
        >
          <ArrowRight size={16} />
        </Button>
      </div>
    </section>
  );
};
