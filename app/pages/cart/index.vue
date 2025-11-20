<template>
  <div class="container mx-auto px-10 py-8">
    <h1 class="text-3xl font-bold mb-8">Shopping Cart</h1>
    
    <div v-if="cart.length === 0" class="text-center py-16">
      <p class="text-xl text-gray-600 mb-4">Your cart is empty</p>
      <UButton to="/shop">Continue Shopping</UButton>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2">
          <div v-for="item in cart" :key="item.product_id" class="flex gap-4 border-b pb-4 mb-4">
            <NuxtImg :src="item.img_url" class="w-24 h-24 object-cover rounded" />
            <div class="flex-1">
              <NuxtLink :to="`/product/${item.slug}`" class="font-bold text-lg hover:underline">
                {{ item.name }}
              </NuxtLink>
              <p class="text-gray-600 text-sm mt-1">${{ item.price.toFixed(2) }}</p>
              
              <div class="flex items-center gap-2 mt-2">
                <UButton size="xs" icon="i-lucide-minus" @click="updateQuantity(item.product_id, item.quantity - 1)" />
                <span class="mx-2">{{ item.quantity }}</span>
                <UButton size="xs" icon="i-lucide-plus" @click="updateQuantity(item.product_id, item.quantity + 1)" />
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-lg">${{ (item.price * item.quantity).toFixed(2) }}</p>
              <UButton 
                class="mt-2"
                color="red" 
                variant="ghost" 
                size="xs" 
                icon="i-lucide-trash-2" 
                @click="removeFromCart(item.product_id)"
              >
                Remove
              </UButton>
            </div>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="lg:col-span-1">
          <div class="border rounded-lg p-6 sticky top-4">
            <h2 class="text-xl font-bold mb-4">Order Summary</h2>
            <div class="space-y-2 mb-4">
              <div class="flex justify-between">
                <span>Items ({{ totalItems }})</span>
                <span>${{ totalPrice.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div class="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${{ totalPrice.toFixed(2) }}</span>
              </div>
            </div>
            <UButton class="w-full" size="lg">Proceed to Checkout</UButton>
            <UButton class="w-full mt-2" variant="outline" to="/shop">Continue Shopping</UButton>
            <UButton 
              class="w-full mt-2" 
              variant="ghost" 
              color="red"
              @click="clearCart"
            >
              Clear Cart
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useShoppingCart();

useSeoMeta({
  title: 'Shopping Cart',
  description: 'View and manage your shopping cart',
});
</script>
