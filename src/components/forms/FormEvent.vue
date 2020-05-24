<template>
<div>
    <b-spinner v-show="requestActive" class="mt-4"/>

    <b-container v-if="!requestActive">
      <b-row>
        <b-col />
        <b-col md=5>
          <b-form-group>
            <small id="dateHelpId" class="text-muted">Day</small>
            <b-form-datepicker today-button no-close-button v-model="date" aria-describedby="dateHelpId" />
          </b-form-group>
        </b-col>
        <b-col md=5>
          <b-form-group>
            <small id="timeHelpId" class="text-muted">Time</small>
            <b-form-timepicker now-button no-close-button v-model="time" aria-describedby="timeHelpId" />
          </b-form-group>
        </b-col>
        <b-col />
      </b-row>

      <b-row>
        <b-col />
        <b-col md=10>
          <b-form-group>
            <small id="eventHelpId" class="text-muted">Event</small>
            <b-form-input v-model="event" aria-describedby="eventHelpId" />
          </b-form-group>
        </b-col>
        <b-col />
      </b-row>

      <b-row>
        <b-col />
        <b-col md=10>
          <b-form-group>
            <small id="descriptionHelpId" class="text-muted">Description</small>
            <b-form-textarea v-model="description" aria-describedby="descriptionHelpId" />
          </b-form-group>
        </b-col>
        <b-col />
      </b-row>

      <FormButtons :id="id" @delete="doDelete" @submit="doSubmit" />

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
            event: "",
            description: "",
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
            url: this.getUrl("events_edit", this.id),
        })
        .done((data) => {
          this.date = moment(data.dt).local().toDate();
          this.time = moment(data.dt).local().format("HH:mm");
          this.event = data.event;
          this.description = data.description;
        });
      }
    },

    methods: {
        doSubmit() {
          this.loadAjax({
              type: "post",
              url: this.id
                   ? this.getUrl("events_edit", this.id)
                   : this.getUrl("events_add"),
              data: {
                  'dt': helpers.getTimestamp(this.date, this.time),
                  'event': this.event,
                  'description': this.description,
              },
          }).done( ()=> {
              this.$emit("updated");
          });
        },
        doDelete() {
          this.loadAjax({
              type: "post",
              url: this.getUrl("events_delete", this.id),
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