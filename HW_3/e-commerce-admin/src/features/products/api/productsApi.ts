import { baseApi } from '@/shared/api/baseApi';
import type { Product, ProductsResponse, ProductsQueryParams } from '@/shared/types';

export const productsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getCategoryList: builder.query<string[], void>({
      query: () => '/products/category-list',
      providesTags: ['Products'],
    }),
    getProducts: builder.query<ProductsResponse, ProductsQueryParams>({
      query: ({ limit = 10, skip = 0, q, category, sortBy, order }) => {
        const params: Record<string, string | number> = { limit, skip };
        if (sortBy) params.sortBy = sortBy;
        if (order) params.order = order;

        if (q && q.trim()) {
          return { url: '/products/search', params: { ...params, q } };
        }
        if (category) {
          return { url: `/products/category/${category}`, params };
        }
        return { url: '/products', params };
      },
      providesTags: ['Products'],
    }),
    getProductById: builder.query<Product, number>({
      query: id => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Products', id }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetProductsQuery, useGetProductByIdQuery, useGetCategoryListQuery } = productsApi;
