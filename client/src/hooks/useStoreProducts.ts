import { useEffect, useMemo, useState } from 'react';

import { productCatalog } from '../data/store';
import { api, type Product } from '../lib/api';

export const useStoreProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    void api
      .products()
      .then((loaded) => setProducts(loaded.filter((product) => product.active)))
      .catch((reason: unknown) => {
        setError(
          reason instanceof Error ? reason.message : 'Не удалось загрузить товары',
        );
      });
  }, []);

  const combinedProducts = useMemo(() => {
    const uniqueProducts = [...productCatalog];

    if (products.length > 0) {
      for (const product of products) {
        if (
          !uniqueProducts.some(
            (item) => item.sku === product.sku && item.name === product.name,
          )
        ) {
          uniqueProducts.push(product);
        }
      }
    }

    return uniqueProducts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return combinedProducts;
    }

    return combinedProducts.filter((product) => {
      const haystack = `${product.name} ${product.type}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [combinedProducts, searchQuery]);

  return {
    products: combinedProducts,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    error,
  };
};
