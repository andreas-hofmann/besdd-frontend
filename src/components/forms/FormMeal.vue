<template>
<div>
    <b-spinner v-show="requestActive" class="mt-4"/>

    <b-container v-if="!requestActive">
      <b-row>
        <b-col />
        <b-col md=6>
          <b-form-group>
            <small id="dateHelpId" class="text-muted">Day</small>
            <b-form-datepicker today-button no-close-button v-model="date" aria-describedby="dateHelpId" />
          </b-form-group>
        </b-col>
        <b-col md=4>
          <b-form-group>
            <small id="timeHelpId" class="text-muted">Time</small>
            <b-form-timepicker now-button no-close-button v-model="time" aria-describedby="timeHelpId" />
          </b-form-group>
        </b-col>
        <b-col />
      </b-row>
      <b-row>
        <b-col />
        <b-col md=6>
          <b-form-group>
            <small id="commentHelpId" class="text-muted">Comment</small>
            <b-form-input v-model="comment" aria-describedby="commentHelpId" />
          </b-form-group>
        </b-col>
        <b-col md=4>
          <b-form-group>
            <small id="untilHelpId" class="text-muted">Until</small>
            <b-form-timepicker now-button reset-button no-close-button v-model="until" aria-describedby="untilHelpId" />
          </b-form-group>
        </b-col>
        <b-col />
      </b-row>
      <b-row>
        <b-col>
          <b-form-group>
            <small id="foodsHelpId" class="text-muted">Foods eaten</small>
            <b-form-checkbox-group v-model="foods" aria-describedby="foodsHelpId" >
              <b-form-checkbox v-for="c in foodChoices" :key="c.id" :value="c.name">{{ c.name }}</b-form-checkbox>
            </b-form-checkbox-group>
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
import _ from 'lodash';

export default {
    name: 'FormSleep',

    data: function() {
        return {
            date: moment().local().toDate(),
            time: String(moment().local().format("HH:mm")),
            until: "",
            foods: [],
            comment: "",
            foodChoices: [],
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
            url: this.getUrl("meals_edit", this.id),
        })
        .done((data) => {
          this.date = moment(data.dt).local().toDate();
          this.time = moment(data.dt).local().format("HH:mm");
          this.foods = data.food;
          this.comment = data.comment;
          this.foodChoices = data.food_choices;

          if (data.dt_end) {
            this.until = moment(data.dt_end).local().format("HH:mm");
          }
        });
      } else {
        this.loadAjax({
            type: "get",
            url: this.getUrl("meals_add"),
        })
        .done((data) => {
          this.foodChoices = data.food_choices;
        });
      }
    },

    methods: {
        getFoods() {
          return _.map(this.foodChoices, (f) => {
            if (this.foods.includes(f.name)) {
              return f.id;
            }
            return null;
          }).filter( (e) => { return e != null; } );
        },
        doSubmit() {
          this.loadAjax({
              type: "post",
              url: this.id
                   ? this.getUrl("meals_edit", this.id)
                   : this.getUrl("meals_add"),
              data: {
                  'dt': helpers.getTimestamp(this.date, this.time),
                  'dt_end': helpers.getTimestamp(this.date, this.until),
                  'food': this.getFoods(),
                  'comment': this.comment,
              },
              traditional: true, // To prevent extra brackets in food-key
          }).done( ()=> {
              this.$emit("updated");
          });
        },
        doDelete() {
          this.loadAjax({
              type: "post",
              url: this.getUrl("meals_delete", this.id),
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