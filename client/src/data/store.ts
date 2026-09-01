import appStore from '../assets/images/App Store.png';
import chatgpt from '../assets/images/ChatGPT.png';
import playStation from '../assets/images/PlayStation.png';
import pubg from '../assets/images/PUBG.png';
import roblox from '../assets/images/Roblox.png';
import steam from '../assets/images/Steam.png';
import telegram from '../assets/images/Telegram.png';
import tiktok from '../assets/images/TikTok.png';
import hero from '../assets/hero.png';
import type { Product } from '../lib/api';

export type StoreBanner = {
  title: string;
  text: string;
};

export const banners: StoreBanner[] = [
  {
    title: 'Цифровые товары для геймеров',
    text: 'Ключи, пополнения и подписки в пару кликов.',
  },
  {
    title: 'Мгновенная доставка',
    text: 'Оплачивайте безопасно и получайте продукт автоматически.',
  },
  {
    title: 'Игры начинаются здесь',
    text: 'Простой чек-аут, понятные цены и надежная поддержка.',
  },
];

export const services = [
  { name: 'Steam', icon: steam },
  { name: 'Telegram', icon: telegram },
  { name: 'Roblox', icon: roblox },
  { name: 'PlayStation', icon: playStation },
  { name: 'App Store', icon: appStore },
  { name: 'ChatGPT', icon: chatgpt },
  { name: 'PUBG', icon: pubg },
  { name: 'TikTok', icon: tiktok },
];

export const productCatalog: Product[] = [
  { sku: 'TOPUP-STEAM-1290', name: 'Баланс Steam', type: 'Пополнение', price: 1290, currency: 'RUB', image: 'assets/steam.png', active: true },
  { sku: 'KEY-CS2-PRIME', name: 'CS2 Прайм', type: 'Ключ', price: 1490, currency: 'RUB', image: 'assets/cs2.png', active: true },
  { sku: 'SUB-ROBLOX-PREMIUM', name: 'Roblox Премиум', type: 'Подписка', price: 799, currency: 'RUB', image: 'assets/roblox.png', active: true },
  { sku: 'SUB-TELEGRAM-PREMIUM', name: 'Telegram Премиум', type: 'Подписка', price: 1390, currency: 'RUB', image: 'assets/telegram.png', active: true },
  { sku: 'TOPUP-PLAYSTATION', name: 'Баланс PlayStation', type: 'Пополнение', price: 2190, currency: 'RUB', image: 'assets/playstation.png', active: true },
  { sku: 'TOPUP-PUBG-UC', name: 'PUBG UC', type: 'Пополнение', price: 1190, currency: 'RUB', image: 'assets/pubg.png', active: true },
  { sku: 'SUB-CHATGPT-PLUS', name: 'ChatGPT Plus', type: 'Подписка', price: 1990, currency: 'RUB', image: 'assets/chatgpt.png', active: true },
  { sku: 'GIFT-APP-STORE', name: 'Код App Store', type: 'Подарочная карта', price: 2590, currency: 'RUB', image: 'assets/app-store.png', active: true },
  { sku: 'TOPUP-TIKTOK-COINS', name: 'Монеты TikTok', type: 'Пополнение', price: 790, currency: 'RUB', image: 'assets/tiktok.png', active: true },
  { sku: 'TOPUP-STEAM-2290', name: 'Баланс Steam', type: 'Пополнение', price: 2290, currency: 'RUB', image: 'assets/steam.png', active: true },
  { sku: 'GIFT-STEAM', name: 'Подарочная карта Steam', type: 'Подарочная карта', price: 1690, currency: 'RUB', image: 'assets/steam.png', active: true },
  { sku: 'GIFT-ROBLOX', name: 'Карта Roblox', type: 'Подарочная карта', price: 890, currency: 'RUB', image: 'assets/roblox.png', active: true },
  { sku: 'SUB-CHATGPT-PRO', name: 'ChatGPT Pro', type: 'Подписка', price: 2990, currency: 'RUB', image: 'assets/chatgpt.png', active: true },
  { sku: 'SUB-PLAYSTATION-PLUS', name: 'PlayStation Plus', type: 'Подписка', price: 2490, currency: 'RUB', image: 'assets/playstation.png', active: true },
  { sku: 'GIFT-TIKTOK', name: 'Баланс магазина TikTok', type: 'Подарочная карта', price: 1390, currency: 'RUB', image: 'assets/tiktok.png', active: true },
];

export const currencyOptions = ['$', '₸', '₽'] as const;
export const currencyRates = {
  '$': 90,
  '₸': 7,
  '₽': 1,
} as const;

export const reviews = [
  { name: 'Аида', text: 'Быстрая доставка и плавный чек-аут. Я получила баланс Steam меньше чем за минуту.', rating: 5 },
  { name: 'Михаил', text: 'Всегда надёжно для пополнений и кодов подписок. Поддержка отвечает быстро.', rating: 5 },
  { name: 'София', text: 'Каталог простой, а процесс оплаты выглядит очень безопасно и понятно.', rating: 5 },
];

export const resolveProductImage = (value?: string) => {
  if (!value) {
    return hero;
  }

  const assetMap: Record<string, string> = {
    'assets/cs2.png': hero,
    'assets/steam.png': steam,
    'assets/roblox.png': roblox,
    'assets/telegram.png': telegram,
    'assets/playstation.png': playStation,
    'assets/pubg.png': pubg,
    'assets/chatgpt.png': chatgpt,
    'assets/app-store.png': appStore,
    'assets/tiktok.png': tiktok,
  };

  return assetMap[value] ?? hero;
};

export const formatPrice = (amount: number, _currency: string, displayCurrency: string) => {
  const rate = currencyRates[displayCurrency as keyof typeof currencyRates] ?? 1;
  const numericValue = amount / rate;

  if (displayCurrency === '₸') {
    return `${Math.round(numericValue).toLocaleString()} ₸`;
  }

  return `${numericValue.toFixed(displayCurrency === '$' ? 2 : 0).toLocaleString()} ${displayCurrency}`;
};
