export interface Product {
  sku: string;
  name: string;
  type: string;
  price: number;
  currency: string;
  image?: string;
  active: boolean;
}

export interface Order {
  id: string;
  sku: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  code?: string;
}

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5555';

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: { 'content-type': 'application/json', ...init?.headers },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Ошибка запроса: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  products: () => apiRequest<Product[]>('/products'),
  createOrder: (sku: string) =>
    apiRequest<Order>('/orders/create', {
      method: 'POST',
      body: JSON.stringify({ sku }),
    }),
  getOrder: (id: string) => apiRequest<Order>(`/orders/${id}`),
  pay: (order: Order, status: 'paid' | 'failed') =>
    apiRequest<{ ok: true }>('/webhook/payment', {
      method: 'POST',
      body: JSON.stringify({
        event_id: `client-${order.id}-${status}`,
        order_id: order.id,
        status,
        amount: order.amount,
        currency: order.currency,
        created_at: new Date().toISOString(),
      }),
    }),
};
