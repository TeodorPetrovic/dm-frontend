<template>
  <div>
    <UHeader title="DM">
      <UNavigationMenu :items="items" />

      <template #trailing>
        <UButton 
          to="/cart" 
          icon="i-lucide-shopping-cart" 
          variant="ghost"
          :badge="totalItems > 0 ? totalItems : undefined"
        />
      </template>

      <template #body>
        <UNavigationMenu :items="items" orientation="vertical" />
      </template>
    </UHeader>

    <main>
      <slot />
    </main>

    <UFooter>
      <p class="text-muted text-sm">Copyright © {{ new Date().getFullYear() }}</p>
    </UFooter>
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const { totalItems } = useShoppingCart()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Home',
    to: '/',
    active: route.path == "/"
  },
  {
    label: 'Shop',
    to: '/shop',
    active: route.path.startsWith('/shop')
  },
  {
    label: 'Category',
    to: '/category',
    active: route.path.startsWith('/category')
  },
  {
    label: 'Cart',
    to: '/cart',
    active: route.path.startsWith('/cart')
  },
  {
    label: 'Admin',
    to: '/admin',
  },
])

</script>