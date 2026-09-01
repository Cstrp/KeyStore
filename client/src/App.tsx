import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, CreditCard, Sparkles } from 'lucide-react';

import { AuthPopover } from './components/store/AuthPopover';
import { ProductSection } from './components/store/ProductSection';
import { ReviewsSection } from './components/store/ReviewsSection';
import { ServiceRow } from './components/store/ServiceRow';
import { StoreHero } from './components/store/StoreHero';
import { TopUpPanel } from './components/store/TopUpPanel';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { Toaster } from './components/ui/toast';
import { Button } from './components/ui/button';
import {
  banners,
  currencyOptions,
  formatPrice,
  reviews,
  services,
} from './data/store';
import { useAuthSession } from './hooks/useAuthSession';
import { useStoreProducts } from './hooks/useStoreProducts';
import { api, type Order, type Product } from './lib/api';

const terminalStatuses = new Set([
  'delivered',
  'payment_failed',
  'out_of_stock',
  'delivery_failed',
]);

const statusLabels: Record<string, string> = {
  created: 'Ожидание оплаты',
  paid: 'Оплата подтверждена',
  delivering: 'Ключ готовится',
  delivered: 'Доставлено',
  payment_failed: 'Оплата не прошла',
  out_of_stock: 'Нет в наличии',
  delivery_failed: 'Доставка не удалась',
  failed: 'Оплата не прошла',
};

export const App = (): React.JSX.Element => {
  const [activeBanner, setActiveBanner] = useState(0);
  const [currency, setCurrency] =
    useState<(typeof currencyOptions)[number]>('$');
  const [purchase, setPurchase] = useState<{
    order: Order;
    product: Product;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const buyingRef = useRef(false);
  const order = purchase?.order ?? null;
  const [error, setError] = useState('');

  const {
    filteredProducts,
    searchQuery,
    setSearchQuery,
    error: catalogError,
  } = useStoreProducts();

  const {
    session,
    sessionPending,
    authOpen,
    setAuthOpen,
    authMode,
    email,
    password,
    authError,
    loading: authLoading,
    setEmail,
    setPassword,
    setAuthMode,
    submitAuth,
    signOut,
  } = useAuthSession();

  useEffect(() => {
    if (
      !order ||
      terminalStatuses.has(order.status) ||
      order.status === 'created'
    ) {
      return;
    }

    const timer = window.setInterval(async () => {
      try {
        const nextOrder = await api.getOrder(order.id);
        setPurchase((current) =>
          current?.order.id === nextOrder.id
            ? { ...current, order: nextOrder }
            : current,
        );
      } catch (reason) {
        setError(
          reason instanceof Error
            ? reason.message
            : 'Не удалось обновить статус заказа',
        );
      }
    }, 1500);

    return () => window.clearInterval(timer);
  }, [order]);

  useEffect(() => {
    const timer = window.setInterval(
      () => setActiveBanner((value) => (value + 1) % banners.length),
      5000,
    );

    return () => window.clearInterval(timer);
  }, []);

  const sections = useMemo(
    () => [
      {
        title: 'Популярное',
        description: 'Самые востребованные цифровые товары',
        products: filteredProducts.slice(0, 5),
      },
      {
        title: 'Пополнения',
        description: 'Моментально пополните баланс и не теряйте прогресс',
        products: filteredProducts.slice(5, 10),
      },
      {
        title: 'Подарочные карты и подписки',
        description: 'Премиум-доступ и готовые подарки в один клик',
        products: filteredProducts.slice(10, 15),
      },
    ],
    [filteredProducts],
  );

  const buy = async (product: Product) => {
    if (buyingRef.current) {
      return;
    }

    buyingRef.current = true;
    setLoading(true);
    setError('');
    setPurchase(null);

    try {
      const created = await api.createOrder(product.sku);
      setPurchase({ order: created, product });
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Не удалось оформить заказ',
      );
    } finally {
      buyingRef.current = false;
      setLoading(false);
    }
  };

  const pay = async (status: 'paid' | 'failed') => {
    if (!order) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.pay(order, status);
      const updated = await api.getOrder(order.id);
      setPurchase((current) =>
        current?.order.id === updated.id
          ? { ...current, order: updated }
          : current,
      );
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Ошибка оплаты');
    } finally {
      setLoading(false);
    }
  };

  const orderTotal = order
    ? formatPrice(order.amount, order.currency, currency)
    : '';

  return (
    <div className="min-h-screen bg-white text-slate-950 antialiased selection:bg-violet-200">
      <div className="mx-auto min-h-screen max-w-400 overflow-hidden bg-white">
        <Header
          search={searchQuery}
          onSearchChange={setSearchQuery}
          session={session}
          sessionPending={sessionPending}
          onAccountClick={() => setAuthOpen((value) => !value)}
        />

        {authOpen && (
          <AuthPopover
            session={session}
            authMode={authMode}
            email={email}
            password={password}
            authError={authError}
            loading={authLoading}
            onModeChange={setAuthMode}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={submitAuth}
            onSignOut={signOut}
          />
        )}

        <main className="flex flex-col gap-10 px-5 py-6 md:px-8 md:py-8 lg:px-10">
          <StoreHero
            banners={banners}
            activeBanner={activeBanner}
            onPrev={() =>
              setActiveBanner(
                (current) => (current - 1 + banners.length) % banners.length,
              )
            }
            onNext={() =>
              setActiveBanner((current) => (current + 1) % banners.length)
            }
            onSelect={setActiveBanner}
          />

          <ServiceRow services={services} />

          <TopUpPanel
            currency={currency}
            onChange={setCurrency}
            options={currencyOptions}
          />

          <section id="products" className="flex flex-col gap-8 scroll-mt-24">
            {sections.map((section) => (
              <ProductSection
                key={section.title}
                title={section.title}
                description={section.description}
                products={section.products}
                currency={currency}
                loading={loading}
                formatPrice={formatPrice}
                onBuy={buy}
              />
            ))}
          </section>

          {catalogError && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {catalogError}
            </p>
          )}
          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {filteredProducts.length === 0 && !catalogError && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center text-slate-500">
              По вашему запросу ничего не найдено.
            </div>
          )}

          <ReviewsSection reviews={reviews} />

          {order && (
            <section className="animate-in flex flex-col justify-between gap-6 rounded-3xl border border-violet-100 bg-violet-50 p-7 fade-in slide-in-from-bottom-3 md:flex-row md:items-center">
              <div>
                <p className="mb-2 text-xs font-bold tracking-[.2em] text-violet-600">
                  СТАТУС ЗАКАЗА
                </p>
                <h2 className="text-2xl font-black text-slate-950">
                  {order.status === 'delivered'
                    ? 'Ваш товар готов'
                    : 'Завершите оплату'}
                </h2>
                <p className="mt-1 font-semibold text-slate-800">
                  {purchase?.product.name}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  {statusLabels[order.status] ?? 'Обработка заказа'} · Заказ{' '}
                  {order.id}
                </p>
                {order.code && (
                  <code className="mt-4 block w-fit rounded-xl bg-slate-950 px-4 py-3 font-mono text-base font-bold tracking-wider text-violet-300">
                    {order.code}
                  </code>
                )}
                {order.status === 'delivered' && (
                  <p className="mt-2 text-sm font-semibold text-emerald-600">
                    Ключ выдан
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {order.status === 'created' && (
                  <>
                    <Button
                      type="button"
                      onClick={() => void pay('paid')}
                      disabled={loading}
                    >
                      Оплатить успешно
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => void pay('failed')}
                      disabled={loading}
                    >
                      Имитация сбоя
                    </Button>
                  </>
                )}

                {order.status === 'paid' && (
                  <div className="flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
                    <Sparkles size={16} />
                    Подготавливаем ключ
                  </div>
                )}

                {order.status === 'delivered' && (
                  <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                    <CheckCircle2 size={18} />
                    Оплачено · {orderTotal}
                  </div>
                )}

                {order.status === 'payment_failed' && (
                  <div className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
                    <CreditCard size={16} />
                    Оплата не прошла
                  </div>
                )}
              </div>
            </section>
          )}
        </main>

        <Toaster />
        <Footer />
      </div>
    </div>
  );
};
