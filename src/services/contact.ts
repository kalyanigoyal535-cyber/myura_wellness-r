import apiClient, { getErrorMessage } from './api';
import { ContactSubmissionRequest, ContactSubmission } from './types';

// Contact API
export const contactApi = {
  // Submit contact form
  submitContact: async (data: ContactSubmissionRequest): Promise<{ message: string; submission: ContactSubmission }> => {
    try {
      const response = await apiClient.post<{ message: string; submission: ContactSubmission }>('/contact/', data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};



