<template>
  <div class="container mx-auto px-10 py-16">
    <div class="max-w-2xl mx-auto text-center">
      <div class="mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <UIcon name="i-lucide-check-circle" class="w-12 h-12 text-green-600" />
        </div>
        <h1 class="text-4xl font-bold mb-4">Order Successful!</h1>
        <p class="text-xl text-gray-600 mb-8">
          Thank you for your purchase. Your order has been successfully placed.
        </p>
      </div>

      <div class="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 class="text-lg font-semibold mb-4">Order Details</h2>
        <div class="space-y-2 text-left">
          <div class="flex justify-between">
            <span class="text-gray-600">Order Number:</span>
            <span class="font-semibold">#{{ orderNumber }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Date:</span>
            <span class="font-semibold">{{ orderDate }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Total Amount:</span>
            <span class="font-semibold text-lg">${{ totalAmount }}</span>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <p class="text-gray-600">
          A confirmation email has been sent to your email address.
        </p>
        <div class="flex gap-4 justify-center">
          <UButton to="/shop" size="lg">Continue Shopping</UButton>
          <UButton to="/" variant="outline" size="lg">Go to Home</UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();

// Generate order details
const orderNumber = ref(Math.floor(100000 + Math.random() * 900000).toString());
const orderDate = ref(new Date().toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
}));
const totalAmount = ref(route.query.total || '0.00');

// Clear cart after successful checkout
const { clearCart } = useShoppingCart();
onMounted(() => {
  clearCart();
});

useSeoMeta({
  title: 'Checkout Success',
  description: 'Your order has been successfully placed',
});
</script>
