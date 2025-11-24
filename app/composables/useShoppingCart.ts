export interface CartItem {
  product_id: number;
  slug: string;
  name: string;
  img_url: string;
  price: number;
  quantity: number;
}

export const useShoppingCart = () => {
  const cart = useState<CartItem[]>('shopping-cart', () => []);

  const addToCart = (product: { product_id: number; slug: string; name: string; img_url: string; price?: number }) => {
    const existingItem = cart.value.find(item => item.product_id === product.product_id);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.value.push({
        product_id: product.product_id,
        slug: product.slug,
        name: product.name,
        img_url: product.img_url,
        price: product.price || 15, // Default price
        quantity: 1,
      });
    }

    // Track add to cart event
    trackEvent('add_to_cart', product.product_id);
  };

  const removeFromCart = (product_id: number) => {
    const index = cart.value.findIndex(item => item.product_id === product_id);
    if (index !== -1) {
      cart.value.splice(index, 1);
    }
  };

  const updateQuantity = (product_id: number, quantity: number) => {
    const item = cart.value.find(item => item.product_id === product_id);
    if (item) {
      if (quantity <= 0) {
        removeFromCart(product_id);
      } else {
        item.quantity = quantity;
      }
    }
  };

  const clearCart = () => {
    cart.value = [];
  };

  const totalItems = computed(() => {
    return cart.value.reduce((total, item) => total + item.quantity, 0);
  });

  const totalPrice = computed(() => {
    return cart.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  });

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };
};

// Helper function to track events
const trackEvent = async (eventType: string, productId: number, metadata?: Record<string, any>) => {
  try {
    // Get or create a session ID
    const sessionId = getSessionId();
    
    await $fetch('/api/event/track', {
      method: 'POST',
      body: {
        event_type: eventType,
        product_id: productId,
        user_session: sessionId,
        event_metadata: metadata,
      },
    });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

// Helper function to get or create session ID
const getSessionId = (): string => {
  if (import.meta.client) {
    let sessionId = localStorage.getItem('user_session');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('user_session', sessionId);
    }
    return sessionId;
  }
  return '';
};

// Export trackEvent for use in other components
export const useEventTracking = () => {
  return {
    trackEvent: (eventType: string, productId: number, metadata?: Record<string, any>) => 
      trackEvent(eventType, productId, metadata),
    getSessionId,
  };
};
