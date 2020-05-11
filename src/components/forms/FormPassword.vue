<template>
<div>
    <b-spinner v-show="requestActive" class="mt-4"/>

    <b-container v-if="!requestActive">
      <b-row>
        <b-col />
        <b-col cols=5>
          <b-form-group>
            <small id="passwordHelpId" class="text-muted">Old password</small>
            <b-form-input type="password" v-model="old_password" aria-describedby="passwordHelpId" />
          </b-form-group>
        </b-col>
        <b-col />
      </b-row>

      <b-row>
        <b-col />
        <b-col cols=5>
          <b-form-group>
            <small id="newpasswordHelpId" class="text-muted">New password</small>
            <b-form-input type="password" v-model="new_password1" aria-describedby="newpasswordHelpId" />
          </b-form-group>
        </b-col>
        <b-col />
      </b-row>

      <b-row>
        <b-col />
        <b-col cols=5>
          <b-form-group>
            <small id="newpassword2HelpId" class="text-muted">New password (confirmation)</small>
            <b-form-input type="password" v-model="new_password2" aria-describedby="newpassword2HelpId" />
          </b-form-group>
        </b-col>
        <b-col />
      </b-row>

      <FormButtons @submit="doSubmit" />

    </b-container>
</div>
</template>

<script>
import { LoadingMixin, UrlMixin } from "../../mixins.js";
import * as helpers from '../../helpers.js';
import FormButtons from './Buttons.vue';

export default {
    name: 'FormSleep',

    data: function() {
        return {
            old_password: "",
            new_password1: "",
            new_password2: "",
            helpers: helpers,
        };
    },

    components: {
      FormButtons
    },

    mixins: [
        LoadingMixin,
        UrlMixin
    ],

    methods: {
        doSubmit() {
          this.loadAjax({
              type: "post",
              url: this.getUrl("change_password"),
              data: {
                  'old_password': this.old_password,
                  'new_password1': this.new_password1,
                  'new_password2': this.new_password2,
              },
          }).done( ()=> {
              this.$emit("updated");
          });
        },
    }
}
</script>