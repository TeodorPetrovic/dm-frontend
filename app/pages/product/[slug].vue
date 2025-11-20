<template>
  <div>
    <div class="px-10 pt-4">
      <UButton icon="i-lucide-arrow-left-to-line" @click="router.back" />
    </div>
    <div class="grid grid-cols-3 gap-2 px-20 pt-5">
    <div class="col-span-2 h-full">
      <NuxtImg class="mx-auto w-1/2 border" :src="data.img_url" />
      <p class="pt-5">
        {{ data.description }}
      </p>
      
      <!-- Recommendations Section -->
      <div v-if="recommendations && recommendations.length > 0" class="mt-10">
        <h2 class="text-2xl font-bold mb-4">Recommended Products</h2>
        <div class="grid grid-cols-3 gap-4">
          <UCard v-for="rec in recommendations" :key="rec.product_id">
            <NuxtLink :to="`/product/${rec.slug}`">
              <NuxtImg class="w-full h-32 object-cover" :src="rec.img_url" />
              <p class="font-bold mt-2">{{ rec.name }}</p>
              <p class="text-sm text-gray-600">{{ rec.description?.substring(0, 40) }}</p>
              <p class="font-bold mt-1">15$</p>
            </NuxtLink>
          </UCard>
        </div>
      </div>
    </div>
    <div class="relative">
      <div class="fixed px-5 py-5 border-2 rounded-lg w-[300px]">
        <UBadge color="error">Sale</UBadge>
        <p class="text-2xl font-bold pt-4">{{ data.name }}</p>
        <p class="text-gray-600">{{ data.description }}</p>
        <p class="text-2xl font-bold">15$</p>
        <UButton class="w-full mb-2" @click="handleAddToCart">Add to cart</UButton>
        <UButton class="w-full" variant="outline" @click="handleCheckout">Buy Now</UButton>
      </div>
    </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Product } from '~/types/Product';

const router = useRouter()
const route = useRoute()
const slug = route.params.slug;

const data: Product = await $fetch("/api/product/" + slug)

// Track product view event
const { trackEvent } = useEventTracking();
onMounted(() => {
  trackEvent('view', data.product_id);
});

// Fetch recommendations
const recommendations = ref<Product[]>([]);
onMounted(async () => {
  try {
    recommendations.value = await $fetch(`/api/recommendations/${data.product_id}`);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
  }
});

// Shopping cart functionality
const { addToCart } = useShoppingCart();
const handleAddToCart = () => {
  addToCart({
    product_id: data.product_id,
    slug: data.slug,
    name: data.name,
    img_url: data.img_url,
    price: 15,
  });
  router.push('/cart');
};

const handleCheckout = () => {
  addToCart({
    product_id: data.product_id,
    slug: data.slug,
    name: data.name,
    img_url: data.img_url,
    price: 15,
  });
  router.push(`/checkout/success?total=15.00`);
};

useSeoMeta({
  title: data.seo?.title, 
  ogTitle: data.seo?.title,
  description: data.seo?.description.substring(0,150) + " ...",
  ogDescription: data.seo?.description.substring(0,150) + " ...",
  ogImage: data.img_url, 
  ogUrl: 'http://localhost:3000/product/' + slug,
  twitterTitle: data.seo?.title,
  twitterDescription: data.seo?.description.substring(0,150) + " ...",
  twitterImage: data.img_url,
  twitterCard: 'summary_large_image',
})

useHead({
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    {
      rel: 'icon',
      type: 'image/ico',
      href: '/favicon.ico'
    }
  ],
  meta: [
    { name: 'keywords', content: data.seo?.key_words.join(", ") },
  ],

})
</script>
