<template>
  <div class="alert" :class="variantClass" role="alert">
    <slot name="message">{{ alert.message }}</slot>
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
      return `alert-${this.alert.variant}`;
    }
  }
};
</script>

