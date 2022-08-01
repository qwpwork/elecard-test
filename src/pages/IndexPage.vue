<template>
  <v-app>
    <LayoutHeader />
    <LayoutMainSection />
    <LayoutFooter />
  </v-app>
</template>

<script>

import LayoutHeader from '@/components/LayoutHeader.vue'
import LayoutFooter from '@/components/LayoutFooter.vue'
import LayoutMainSection from '@/components/LayoutMainSection.vue'

export default {
  components: {
    LayoutFooter,
    LayoutHeader,
    LayoutMainSection
  }  
}
</script>