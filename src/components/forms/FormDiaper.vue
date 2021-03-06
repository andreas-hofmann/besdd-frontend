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
            <b-input v-model="comment" aria-describedby="commentHelpId" />
          </b-form-group>
        </b-col>
        <b-col md=4>
          <b-form-group>
            <small id="typeHelpId" class="text-muted">Type</small>
            <b-form-select v-model="type" :options="typeChoices" value-field="id" text-field="name" aria-describedby="typeHelpId">
              <b-form-select-option value="">---</b-form-select-option>
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col />
      </b-row>
      <b-row>
        <b-col>
          <b-form-group>
            <small id="contentsHelpId" class="text-muted">Contents</small>
            <b-form-checkbox-group v-model="contents" aria-describedby="contentsHelpId" >
              <b-form-checkbox v-for="c in contentChoices" :key="c.id" :value="c.name">{{ c.name }}</b-form-checkbox>
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
            contents: [],
            type: "",
            comment: "",
            contentChoices: [],
            typeChoices: [],
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
            url: this.getUrl("diapers_edit", this.id),
        })
        .done((data) => {
          this.date = moment(data.dt).local().toDate();
          this.time = moment(data.dt).local().format("HH:mm");
          this.contents = data.content;
          this.comment = data.comment;
          this.type = data.diaper_type;
          this.contentChoices = data.content_choices;
          this.typeChoices = data.type_choices;
        });
      } else {
        this.loadAjax({
            type: "get",
            url: this.getUrl("diapers_add"),
        })
        .done((data) => {
          this.contentChoices = data.content_choices;
          this.typeChoices = data.type_choices;
        });
      }
    },

    methods: {
        getContents() {
          return _.map(this.contentChoices, (f) => {
            if (this.contents.includes(f.name)) {
              return f.id;
            }
            return null;
          }).filter( (e) => { return e != null; } );
        },
        doSubmit() {
          this.loadAjax({
              type: "post",
              url: this.id
                   ? this.getUrl("diapers_edit", this.id)
                   : this.getUrl("diapers_add"),
              data: {
                  'dt': helpers.getTimestamp(this.date, this.time),
                  'content': this.getContents(),
                  'comment': this.comment,
                  'diaper_type': this.type,
              },
              traditional: true, // To prevent extra brackets in content-key
          }).done( ()=> {
              this.$emit("updated");
          });
        },
        doDelete() {
          this.loadAjax({
              type: "post",
              url: this.getUrl("diapers_delete", this.id),
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