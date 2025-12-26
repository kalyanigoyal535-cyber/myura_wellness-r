import apiClient, { getErrorMessage } from './api';

export interface Blog {
  id: number;
  title: string;
  slug: string;
  subtitle?: string;
  excerpt?: string;
  content?: string;
  content_blocks?: ContentBlock[];
  featured_image?: string;
  featured_image_url?: string;
  thumbnail?: string;
  thumbnail_url?: string;
  author_id?: number;
  author?: string;
  author_name?: string;
  published: boolean;
  published_at?: string;
  tags: string[];
  views: number;
  view_count?: number;
  date?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentBlock {
  type: 'text' | 'heading' | 'image' | 'list';
  data?: string | string[];
  src?: string;
  alt?: string;
  caption?: string;
}

export interface BlogListResponse {
  count: number;
  total: number;
  page: number;
  page_size: number;
  results: Blog[];
}

export interface BlogFilters {
  published?: boolean;
  category?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

export const blogsApi = {
  getBlogs: async (filters?: BlogFilters): Promise<BlogListResponse> => {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.published !== undefined) {
          params.append('published', String(filters.published));
        }
        if (filters.category) params.append('category', filters.category);
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', String(filters.page));
        if (filters.page_size) params.append('page_size', String(filters.page_size));
      }

      const queryString = params.toString();
      const url = `/blogs/${queryString ? `?${queryString}` : ''}`;
      const response = await apiClient.get<BlogListResponse>(url);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  getBlog: async (slug: string): Promise<Blog> => {
    try {
      const response = await apiClient.get<Blog>(`/blogs/${slug}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

