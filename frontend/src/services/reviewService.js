/**
 * Review API service — maps to ReviewController.
 */
import api from '../api/axios';

const URL = '/api/reviews';

const reviewService = {
  getByRestaurant: (restaurantId, page = 0, size = 10) =>
    api
      .get(`${URL}/restaurant/${restaurantId}`, { params: { page, size } })
      .then((r) => r.data),

  add: (data) => api.post(URL, data).then((r) => r.data),

  update: (id, data) => api.put(`${URL}/${id}`, data).then((r) => r.data),

  delete: (id) => api.delete(`${URL}/${id}`),
};

export default reviewService;
