<template>
<div>
    <b-spinner v-show="requestActive" class="mt-4"/>

    <b-container v-if="!requestActive">
      <b-row>
        <b-col md=5>
          <b-form-group>
            <small id="dateHelpId" class="text-muted">Day</small>
            <b-form-datepicker today-button no-close-button v-model="date" aria-describedby="dateHelpId" />
          </b-form-group>
        </b-col>
        <b-col md=3>
          <b-form-group>
            <small id="timeHelpId" class="text-muted">Time</small>
            <b-form-timepicker now-button no-close-button v-model="time" aria-describedby="timeHelpId" />
          </b-form-group>
        </b-col>
        <b-col md=2>
          <b-form-group>
            <small id="heightHelpId" class="text-muted">Height</small>
            <b-form-input v-model="height" aria-describedby="heightHelpId" />
          </b-form-group>
        </b-col>
        <b-col md=2>
          <b-form-group>
            <small id="weightHelpId" class="text-muted">Weight</small>
            <b-form-input v-model="weight" aria-describedby="weightHelpId" />
          </b-form-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <b-form-group>
            <small id="commentHelpId" class="text-muted">Comment</small>
            <b-form-input v-model="comment" aria-describedby="commentHelpId" />
          </b-form-group>
        </b-col>
      </b-row>

      <FormButtons :id="id" @delete="confirmDelete" @submit="doSubmit" />

    </b-container>
</div>
</template>

<script>
import { LoadingMixin, UrlMixin } from "../../mixins.js";
import * as helpers from '../../helpers.js';
import FormButtons from './Buttons.vue';

import moment from 'moment';

export default {
    name: 'FormSleep',

    data: function() {
        return {
            date: moment().local().toDate(),
            time: String(moment().local().format("HH:mm")),
            height: 0.0,
            weight: 0.0,
            comment: "",
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

    props: {
        id: { type: Number, default: 0 },
    },

    created: function() {
      if (this.id) {
        this.loadAjax({
            type: "get",
            url: this.getUrl("measurements_edit", this.id),
        })
        .done((data) => {
          this.date = moment(data.dt).local().toDate();
          this.time = moment(data.dt).local().format("HH:mm");
          this.height = data.height;
          this.weight = data.weight;
          this.comment = data.comment;
        });
      }
    },

    methods: {
        doSubmit() {
          this.loadAjax({
              type: "post",
              url: this.id
                   ? this.getUrl("measurements_edit", this.id)
                   : this.getUrl("measurements_add"),
              data: {
                  'dt': helpers.getTimestamp(this.date, this.time),
                  'height': this.height,
                  'weight': this.weight,
                  'comment': this.comment,
              },
          }).done( ()=> {
              this.$emit("updated");
          });
        },
        doDelete() {
          this.loadAjax({
              type: "post",
              url: this.getUrl("measurements_delete", this.id),
          }).done( ()=> {
              this.$emit("deleted");
          });
        },
        confirmDelete() {
            this.confirmPopup = ''
            this.$bvModal.msgBoxConfirm("Delete Meal?", {
                okVariant: 'danger',
                headerClass: 'p-2 border-bottom-0',
                footerClass: 'p-2 border-top-0',
                centered: true
            }).then(value => {
              if (value === true) {
                this.doDelete();
              }
            })
        },
    }
}
</script>