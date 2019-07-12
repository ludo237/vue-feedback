<template>
  <div class="absolute w-64 feedback">
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full flex justify-center" @click.prevent="toggle">
      <span class="text-white">Give Your Feedback</span>
      <chevron-up-icon size="1.5x" v-if="!isOpen"></chevron-up-icon>
      <chevron-down-icon size="1.5x" v-else></chevron-down-icon>
    </button>

    <div class="max-w-sm overflow-hidden shadow-lg p-4 feedback__container" v-if="isOpen">
      <form @submit.prevent="submit" method="post" role="form" v-if="isPending">
        <div class="block text-gray-700 text-sm font-bold mb-2">Score</div>
        <div class="mb-4 flex">
          <p-radio class="p-icon p-round p-smooth" name="radio" color="info" v-for="item in [1,2,3,4,5]" :key="item" v-model="score" :value="item">
            <check-circle-icon slot="extra" class="icon"></check-circle-icon>
            {{ item }}
          </p-radio>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="thoughts">Thoughts</label>
          <textarea class="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none" id="thoughts" placeholder="Share your opinion" required></textarea>
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
    CheckCircleIcon: () =>
      import(/* webpackMode: "eager" */ 'vue-feather-icons').then(
        ({ CheckCircleIcon }) => CheckCircleIcon
      ),
    Loader: () => import('./Loader.vue'),
    PRadio: () => import(/* webpackMode: "eager"*/ 'pretty-checkbox-vue/radio')
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

.feedback__container {
  min-height: 100px;
}

textarea {
  min-height: 130px;
}
</style>
