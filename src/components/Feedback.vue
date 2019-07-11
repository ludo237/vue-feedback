<template>
  <div class="position-absolute w-15 feedback-container">
    <a class="btn btn-lg btn-block btn-info feedback-btn" @click.prevent="toggle">
      <span class="text-white">
        <span>Give Your Feedback</span>
      </span>
    </a>

    <div class="card rounded-0 border border-bottom-0 border-info" v-if="isOpen">
      <div class="card-body">
        <form @submit.prevent="submit" method="post" role="form" v-if="isPending">
          <div>Score</div>
          <div class="form-group">
            <div
              class="custom-control custom-radio custom-control-inline"
              v-for="item in [1,2,3,4,5]"
              :key="item"
            >
              <input
                type="radio"
                :id="'scoreValue' + item"
                v-model="score"
                :value="item"
                class="custom-control-input"
                required
              />
              <label class="custom-control-label" :for="'scoreValue' + item">{{ item }}</label>
            </div>
          </div>
          <div class="form-group">
            <label for="thoughts">Thoughts</label>
            <textarea
              class="form-control no-resize"
              id="thoughts"
              rows="3"
              v-model="text"
              placeholder="Share your opinion"
              required
            ></textarea>
          </div>
          <button type="submit" class="btn btn-sm btn-block btn-success">Send</button>
        </form>
        <loader v-else-if="isSubmitted"></loader>
        <alert v-else :alert="alert"></alert>
      </div>
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
            variant: 'success',
            message: 'Thanks for your feedback!'
          };
        })
        .catch(({ response }) => {
          this.alert = {
            variant: 'danger',
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
.feedback-container {
  bottom: 0;
  right: 3em;
}

.feedback-btn {
  border-radius: 0;
  border-top-left-radius: 0.25rem !important;
  border-top-right-radius: 0.25rem !important;
}

.custom-control-inline {
  margin-right: 0.5rem !important;
}
</style>
