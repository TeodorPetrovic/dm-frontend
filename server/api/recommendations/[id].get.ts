export default defineEventHandler(async (event) => {
  const productId = getRouterParam(event, 'id');

  if (!productId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product ID is required'
    });
  }

  try {
    // Call ML service for recommendations
    const recommendations = await $fetch(`http://127.0.0.1:3001/recommendations/${productId}`, {
      method: 'GET',
    }).catch(() => {
      // If ML service is not available, return empty array
      console.warn('ML service not available, returning empty recommendations');
      return [];
    });

    return recommendations;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
});
