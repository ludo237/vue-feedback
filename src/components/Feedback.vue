<template>
  <div class="absolute w-64 feedback">
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full flex justify-center" @click.prevent="toggle">
      <span class="text-white">Give Your Feedback</span>
      <chevron-up-icon size="1.5x" v-if="!isOpen"></chevron-up-icon>
      <chevron-down-icon size="1.5x" v-else></chevron-down-icon>
    </button>

    <div class="max-w-sm overflow-hidden shadow-lg p-4" v-if="isOpen">
      <form @submit.prevent="submit" method="post" role="form" v-if="isPending">
        <div class="block text-gray-700 text-sm font-bold mb-2">Score</div>
        <div class="mb-4 flex">
          <div class="flex px-2" v-for="item in [1,2,3,4,5]" :key="item">
            <input :id="'scoreValue' + item" :value="item" type="radio" v-model="score" />
            <label :for="'scoreValue' + item" class="flex items-center cursor-pointer">{{ item }}</label>
          </div>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="thoughts">Thoughts</label>
          <textarea class="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="thoughts" placeholder="Share your opinion" required></textarea>
        </div>
        <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 w-full">Send</button>
      </form>
      <loader v-else-if="isSubmitted"></loader>
      <alert v-else :alert="alert"></alert>
    </div>
  </div>
</template>

<script>
/**
 * This can be either Vuex of any kind of API you want
 */
import FeedbackApi from '../api/feedback';

export default {
  name: 'feedback',

  components: {
    Alert: () => import('./Alert.vue'),
    ChevronDownIcon: () =>
      import(/* webpackMode: "eager" */ 'vue-feather-icons').then(
        ({ ChevronDownIcon }) => ChevronDownIcon
      ),
    ChevronUpIcon: () =>
      import(/* webpackMode: "eager" */ 'vue-feather-icons').then(
        ({ ChevronUpIcon }) => ChevronUpIcon
      ),
    Loader: () => import('./Loader.vue')
  },

  data: () => ({
    isOpen: false,
    status: 'pending',
    score: 5,
    text: '',
    alert: {
      variant: '',
      message: ''
    }
  }),

  methods: {
    toggle() {
      if (this.isSubmitted) {
        return false;
      }

      this.isOpen = !this.isOpen;
      this.status = 'pending';
    },

    submit() {
      this.status = 'submitted';

      FeedbackApi.store(this.buildPayload())
        .then(({ data }) => {
          this.alert = {
            color: 'green',
            message: 'Thanks for your feedback!'
          };
        })
        .catch(({ response }) => {
          this.alert = {
            color: 'red',
            message: 'Something Went Wrong'
          };
        })
        .finally(() => {
          // TODO: Add retry button
          this.status = 'done';
        });
    },

    buildPayload() {
      return {
        score: this.score,
        text: this.text
      };
    }
  },

  computed: {
    isClosed() {
      return !this.isOpen;
    },

    isPending() {
      return this.status === 'pending';
    },

    isSubmitted() {
      return this.status === 'submitted';
    }
  }
};
</script>

<style scoped lang="scss">
.feedback {
  bottom: 0;
  right: 3em;
}

.custom-control-inline {
  margin-right: 0.5rem !important;
}
</style>
