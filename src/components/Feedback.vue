<template>
    <div class="position-absolute w-15 feedback-container">
        <a class="btn btn-lg btn-block btn-info feedback-btn" @click.prevent="toggle">
            <span class="text-white">
                <span>Give Your Feedback</span>
            </span>
        </a>

        <transition enter-active-class="animated fadeIn" mode="out-in">
            <div class="card rounded-0 border border-info" v-if="isOpen">
                <div class="card-body">
                    <form @submit.prevent="submit" method="post" role="form" v-if="isPending">
                        <div>Score</div>
                        <div class="form-group">
                            <div class="custom-control custom-radio custom-control-inline" v-for="item in [1,2,3,4,5]" :key="item">
                                <input type="radio" :id="'scoreValue' + item" v-model="score" :value="item"
                                       class="custom-control-input" required>
                                <label class="custom-control-label" :for="'scoreValue' + item">{{ item }}</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="thoughts">Thoughts</label>
                            <textarea class="form-control no-resize" id="thoughts" rows="3" v-model="text"
                                      placeholder="Share your opinion" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-sm btn-block btn-success">Send</button>
                    </form>
                    <div class="d-flex justify-content-center" v-else-if="isSubmitted">
                        <div class="spinner-border text-secondary" role="status">
                            <span class="sr-only">Submitting...</span>
                        </div>
                    </div>
                    <template v-else>
                        <div class="alert" :class="alert.class" role="alert">{{ alert.message }}</div>
                    </template>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import FeedbackApi from "../api/feedback";

export default {
  name: "feedback",

  data: () => ({
    isOpen: false,
    status: "pending",
    score: 5,
    text: "",
    alert: {
      class: "",
      message: ""
    }
  }),

  methods: {
    toggle() {
      if (this.isSubmitted) {
        return false;
      }

      this.isOpen = !this.isOpen;
      this.status = "pending";
    },

    submit() {
      this.status = "submitted";

      let payload = {
        score: this.score,
        text: this.text,
        properties: {
          url: window.location.href,
          ua: navigator.userAgent,
          platform: navigator.platform
        }
      };

      FeedbackApi.store(payload)
        .then(({ data }) => {
          this.alert = {
            class: "alert-success",
            message: data.message
          };
        })
        .catch(({ response }) => {
          this.alert = {
            class: "alert-danger",
            message: "Something Went Wrong"
          };

          console.log(response.data.message);
        })
        .finally(() => {
          // TODO: Add retry button
          this.status = "done";
        });
    }
  },

  computed: {
    isClosed() {
      return !this.isOpen;
    },

    isPending() {
      return this.status === "pending";
    },

    isSubmitted() {
      return this.status === "submitted";
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