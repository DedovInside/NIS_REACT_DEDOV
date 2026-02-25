import { useCallback, useRef, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GradeIcon from '@mui/icons-material/Grade';

import styles from './ProductsPage.module.css';

import { useGetProductsQuery, useGetCategoryListQuery } from '@/features/products/api/productsApi';
import { useAppSelector } from '@/app/store/hooks';
import { selectPageSize } from '@/features/settings/model/settingsSelectors';
import Loader from '@/shared/ui/Loader/Loader';
import ErrorMessage from '@/shared/ui/ErrorMessage/ErrorMessage';

type SortOption = 'default' | 'price-asc' | 'price-desc';

const VALID_SORTS: SortOption[] = ['default', 'price-asc', 'price-desc'];

const ProductsPage = () => {
  const { t } = useTranslation();
  const pageSize = useAppSelector(selectPageSize);
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') ?? '';
  const sort = (
    VALID_SORTS.includes(searchParams.get('sort') as SortOption)
      ? searchParams.get('sort')
      : 'default'
  ) as SortOption;
  const page = Math.max(0, Number(searchParams.get('page') ?? '0'));

  const qFromUrl = searchParams.get('q') ?? '';
  const [search, setSearch] = useState(qFromUrl);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSearch(qFromUrl);
  }, [qFromUrl]);

  const setParam = useCallback(
    (key: string, value: string) => {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        next.delete('page');
        return next;
      });
    },
    [setSearchParams],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setSearch(val);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setParam('q', val);
      }, 400);
    },
    [setParam],
  );

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => setParam('category', e.target.value),
    [setParam],
  );

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      setParam('sort', e.target.value === 'default' ? '' : e.target.value),
    [setParam],
  );

  const handlePageChange = useCallback(
    (delta: number) => {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        const newPage = Math.max(0, page + delta);
        if (newPage === 0) {
          next.delete('page');
        } else {
          next.set('page', String(newPage));
        }
        return next;
      });
    },
    [page, setSearchParams],
  );

  const sortParams =
    sort === 'price-asc'
      ? { sortBy: 'price' as const, order: 'asc' as const }
      : sort === 'price-desc'
        ? { sortBy: 'price' as const, order: 'desc' as const }
        : {};

  const { data: categoryList } = useGetCategoryListQuery();

  const { data, isLoading, isError } = useGetProductsQuery({
    limit: pageSize,
    skip: page * pageSize,
    q: qFromUrl || undefined,
    category: category || undefined,
    ...sortParams,
  });

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('products.title')}</h1>

      <div className={styles.toolbar}>
        <search className={styles.searchWrapper}>
          <label htmlFor="product-search" className={styles.srOnly}>
            {t('products.searchLabel')}
          </label>
          <input
            id="product-search"
            type="search"
            value={search}
            onChange={handleSearchChange}
            placeholder={t('common.searchPlaceholder')}
            className={styles.searchInput}
          />
        </search>

        <div className={styles.controls}>
          <label htmlFor="category-filter" className={styles.srOnly}>
            {t('products.category')}
          </label>
          <select
            id="category-filter"
            value={category}
            onChange={handleCategoryChange}
            className={styles.select}
          >
            <option value="">{t('products.allCategories')}</option>
            {categoryList?.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <label htmlFor="sort-select" className={styles.srOnly}>
            {t('products.sortBy')}
          </label>
          <select
            id="sort-select"
            value={sort}
            onChange={handleSortChange}
            className={styles.select}
          >
            <option value="default">{t('products.sortDefault')}</option>
            <option value="price-asc">{t('products.sortPriceAsc')}</option>
            <option value="price-desc">{t('products.sortPriceDesc')}</option>
          </select>
        </div>
      </div>

      {isLoading && <Loader />}
      {isError && <ErrorMessage message={t('products.loadingError')} />}

      {!isLoading && !isError && data && (
        <>
          {data.products.length === 0 ? (
            <p className={styles.empty}>{t('products.noProducts')}</p>
          ) : (
            <ul className={styles.grid}>
              {data.products.map(product => (
                <li key={product.id} className={styles.listItem}>
                  <Link to={`/products/${product.id}`} className={styles.card}>
                    <article>
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className={styles.thumbnail}
                      />
                      <div className={styles.info}>
                        <h3 className={styles.productTitle}>{product.title}</h3>
                        <span className={styles.category}>{product.category}</span>
                        <div className={styles.meta}>
                          <span className={styles.price}>${product.price}</span>
                          <span className={styles.rating}>
                            <GradeIcon
                              fontSize="small"
                              sx={{ verticalAlign: 'middle', color: '#f43f5e' }}
                            />
                            {product.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {totalPages > 1 && (
            <nav aria-label={t('common.pagination')} className={styles.pagination}>
              <button
                className={styles.pageBtn}
                disabled={page === 0}
                onClick={() => handlePageChange(-1)}
              >
                {t('common.prev')}
              </button>
              <span className={styles.pageInfo}>
                {t('common.page')} {page + 1} {t('common.of')} {totalPages}
              </span>
              <button
                className={styles.pageBtn}
                disabled={page >= totalPages - 1}
                onClick={() => handlePageChange(1)}
              >
                {t('common.next')}
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsPage;
