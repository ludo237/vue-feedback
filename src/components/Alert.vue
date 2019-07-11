<template>
  <div class="border px-4 py-3 rounded relative" :class="variantClass" role="alert">
    <span class="block sm:inline">{{ alert.message }}</span>
  </div>
</template>

<script>
export default {
  name: 'alert',

  props: {
    alert: {
      required: true,
      type: Object
    }
  },

  computed: {
    variantClass() {
      return `bg-${this.alert.color}-100 border-${this.alert.color}-400 text-${this.alert.color}-700`;
    }
  }
};
</script>
