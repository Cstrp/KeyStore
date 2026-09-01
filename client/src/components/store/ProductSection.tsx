import { Loader2, Star } from 'lucide-react';

import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import type { Product } from '../../lib/api';
import { resolveProductImage } from '../../data/store';

type ProductSectionProps = {
  title: string;
  description: string;
  products: Product[];
  currency: '$' | '₸' | '₽';
  loading: boolean;
  onBuy: (product: Product) => void;
  formatPrice: (amount: number, currency: string, displayCurrency: string) => string;
};

export const ProductSection = ({
  title,
  description,
  products,
  currency,
  loading,
  onBuy,
  formatPrice,
}: ProductSectionProps) => {
  return (
    <div className="py-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold tracking-[.2em] text-violet-600">КАТАЛОГ</p>
          <h2 className="text-3xl font-black tracking-tight text-slate-950">{title}</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">{products.length} товаров</span>
      </div>

      <p className="mt-2 text-slate-500">{description}</p>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {products.map((product) => (
          <Card key={`${title}-${product.name}-${product.price}`} className="group gap-0 rounded-2xl border border-slate-200 bg-white py-0 ring-0 transition-all duration-300 hover:-translate-y-1 hover:border-violet-300">
            <div className="m-2 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-5">
              <img src={resolveProductImage(product.image)} alt={product.name} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110" />
            </div>

            <CardHeader className="flex-row items-start justify-between gap-2 px-4 pt-3">
              <CardTitle className="line-clamp-2 text-sm font-bold text-slate-900">{product.name}</CardTitle>
              <p className="flex shrink-0 items-center gap-1 text-xs font-semibold text-amber-500">
                <Star size={14} fill="currentColor" /> 4.9
              </p>
            </CardHeader>

            <CardContent className="mt-auto px-4 pt-3">
              <p className="text-xs text-slate-400">{product.type} · мгновенно</p>
              <strong className="mt-1 block text-lg font-black text-slate-950">{formatPrice(product.price, product.currency, currency)}</strong>
            </CardContent>

            <CardFooter className="px-4 pb-4 pt-3">
              <Button
                type="button"
                className="h-10 w-full rounded-xl bg-slate-950 text-white transition duration-300 hover:bg-violet-600 hover:shadow-lg hover:shadow-violet-200"
                disabled={loading}
                onClick={() => onBuy(product)}
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Купить'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
