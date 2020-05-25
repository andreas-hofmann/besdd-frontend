<template>
<div>
    <b-spinner v-show="requestActive" class="mt-4"/>

    <b-container v-if="!requestActive">
      <b-row>
        <b-col md=4>
          <b-form-group>
            <small id="dateHelpId" class="text-muted">Day</small>
            <b-form-datepicker today-button no-close-button v-model="date" aria-describedby="dateHelpId" />
          </b-form-group>
        </b-col>
        <b-col md=4>
          <b-form-group>
            <small id="starttimeHelpId" class="text-muted">Start time</small>
            <b-form-timepicker now-button no-close-button v-model="starttime" aria-describedby="starttimeHelpId" />
          </b-form-group>
        </b-col>
        <b-col md=4>
          <b-form-group>
            <small id="endtimeHelpId" class="text-muted">End time</small>
            <b-form-timepicker now-button reset-button no-close-button v-model="endtime" aria-describedby="endtimeHelpId" />
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
import FormButtons from './Buttons.vue';

import moment from 'moment';

export default {
    name: 'FormSleep',

    data: function() {
        return {
            date: moment().local().toDate(),
            starttime: String(moment().local().format("HH:mm")),
            endtime: "",
            comment: "",
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
            url: this.getUrl("sleepphases_edit", this.id),
        })
        .done((data) => {
          this.date = moment(data.dt).local().toDate();
          this.starttime = moment(data.dt).local().format("HH:mm");

          if (data.dt_end) {
            this.endtime = moment(data.dt_end).local().format("HH:mm");
          } else {
            this.endtime = moment().local().format("HH:mm");
          }

          this.comment = data.comment;
        });
      }
    },

    methods: {
        getTimestamps() {
          const d = moment(this.date).format("YYYY-MM-DD");
          let dt     = moment( d + " " + this.starttime );
          let dt_end = moment( d + " " + this.endtime );

          if (dt_end.isBefore(dt)) {
            dt_end.add(1, 'd');
          }

          return {
            'dt': dt.format("YYYY-MM-DD HH:mm"),
            'dt_end': this.endtime ? dt_end.format("YYYY-MM-DD HH:mm") : ""
          };
        },
        doSubmit() {
          let timestamps = this.getTimestamps();

          this.loadAjax({
              type: "post",
              url: this.id
                    ? this.getUrl("sleepphases_edit", this.id)
                    : this.getUrl("sleepphases_add"),
              data: {
                'dt': timestamps.dt,
                'dt_end': timestamps.dt_end,
                'comment': this.comment,
              },
          }).done( ()=> {
              this.$emit("updated");
          });
        },
        doDelete() {
          this.loadAjax({
              type: "post",
              url: this.getUrl("sleepphases_delete", this.id),
          }).done( ()=> {
              this.$emit("deleted");
          });
        },
        confirmDelete() {
            this.confirmPopup = ''
            this.$bvModal.msgBoxConfirm("Delete Sleepphase?", {
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