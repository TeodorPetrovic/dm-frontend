<template>
  <div>
    <h1 class="text-center py-5 text-2xl font-bold">Shop</h1>
    
    <!-- Search bar to demonstrate structured data tracking -->
    <div class="px-10 pb-5">
      <UInput
        v-model="searchQuery"
        placeholder="Search products..."
        icon="i-lucide-search"
        size="lg"
        @keyup.enter="handleSearch"
      />
      <p v-if="searchQuery" class="text-sm text-gray-500 mt-2">
        Showing {{ filteredProducts.length }} results for "{{ searchQuery }}"
      </p>
    </div>

    <div class="p-10 pt-0 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <UCard v-for="(product, index) in filteredProducts" :key="product.product_id">
        <template #header>
          <UBadge>Sale</UBadge>
        </template>

        <NuxtLink :to="`/product/${product.slug}`" @click="handleProductClick(product, index)">
          <NuxtImg class="mx-auto w-full" :src="product.img_url" />
          <p class="text-2xl font-bold pt-4">{{ product.name }}</p>
          <p class="text-gray-600">{{ product.description.substring(0,40) }}</p>
        </NuxtLink>

        <template #footer>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold">15$</p>
            </div>
            <UButton class="cursor-pointer" icon="i-lucide-shopping-cart" @click="addToShoppingCart(product)" />
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Product } from '~/types/Product';

const products: Product[] = await $fetch("/api/shop");

const { addToCart } = useShoppingCart();
const { trackSearch } = useSearchTracking();

const searchQuery = ref('');
const searchStartTime = ref(0);

// Filter products based on search query
const filteredProducts = computed(() => {
  if (!searchQuery.value) return products;
  
  const query = searchQuery.value.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(query) || 
    product.description.toLowerCase().includes(query)
  );
});

// Handle search event with structured metadata
function handleSearch() {
  if (!searchQuery.value) return;
  
  const timeSpent = searchStartTime.value ? Date.now() - searchStartTime.value : 0;
  
  // Track search with rich metadata (demonstrates ClickHouse structured data)
  trackSearch(searchQuery.value, 0, {
    resultsCount: filteredProducts.value.length,
    sortBy: 'relevance',
    page: 1,
    timeSpent,
  });
  
  searchStartTime.value = Date.now();
}

// Track product click from search results
function handleProductClick(product: Product, position: number) {
  if (searchQuery.value) {
    const timeSpent = searchStartTime.value ? Date.now() - searchStartTime.value : 0;
    
    // Track search result click with position
    trackSearch(searchQuery.value, product.product_id, {
      resultsCount: filteredProducts.value.length,
      clickedPosition: position,
      timeSpent,
    });
  }
}

function addToShoppingCart(product: Product) {
  addToCart({
    product_id: product.product_id,
    slug: product.slug,
    name: product.name,
    img_url: product.img_url,
    price: 15,
  });
}

// Watch search query changes
watch(searchQuery, (newVal) => {
  if (!newVal) {
    searchStartTime.value = 0;
  } else if (searchStartTime.value === 0) {
    searchStartTime.value = Date.now();
  }
});

</script>