import { Quote, Star } from 'lucide-react';

type Review = {
  name: string;
  text: string;
  rating: number;
};

type ReviewsSectionProps = {
  reviews: Review[];
};

export const ReviewsSection = ({ reviews }: ReviewsSectionProps) => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10" aria-label="Отзывы клиентов">
      <div className="mb-7">
        <p className="mb-2 text-xs font-bold tracking-[.2em] text-violet-600">ОТЗЫВЫ</p>
        <h2 className="text-3xl font-black tracking-tight text-slate-950">Нам доверяют игроки</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {reviews.map((review) => (
          <div key={review.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-colors duration-300 hover:border-violet-300 hover:bg-white">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex size-9 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <Quote size={16} />
              </div>
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: review.rating }).map((_, index) => (
                  <Star key={`${review.name}-${index}`} size={14} fill="currentColor" />
                ))}
              </div>
            </div>
            <p className="min-h-20 text-sm leading-6 text-slate-600">{review.text}</p>
            <strong className="mt-4 block text-sm text-slate-950">{review.name}</strong>
          </div>
        ))}
      </div>
    </section>
  );
};
