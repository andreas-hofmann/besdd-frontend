<template>
<div>
    <b-spinner v-show="requestActive" class="mt-4"/>

    <b-container v-if="!requestActive">
      <b-row>
        <b-col />
        <b-col md=5>
          <b-form-group>
            <small id="birthdayHelpId" class="text-muted">Birthday</small>
            <b-form-datepicker v-model="birthday" aria-describedby="birthdayHelpId" />
          </b-form-group>
        </b-col>
        <b-col md=5>
          <b-form-group>
            <small id="nameHelpId" class="text-muted">Name</small>
            <b-form-input v-model="name" aria-describedby="nameHelpId" />
          </b-form-group>
        </b-col>
        <b-col />
      </b-row>
      <b-row>
        <b-col />
        <b-col md=8>
          <b-form-group>
            <small id="parentsHelpId" class="text-muted">Parents (comma separated)</small>
            <b-form-input v-model="parents" aria-describedby="parentsHelpId" />
          </b-form-group>
        </b-col>
        <b-col md=2>
          <b-form-group>
            <small id="genderHelpId" class="text-muted">Gender</small>
            <b-form-select v-model="gender" aria-describedby="gendersHelpId">
              <b-form-select-option value="M">Male</b-form-select-option>
              <b-form-select-option value="F">Female</b-form-select-option>
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col />
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
    name: 'FormChild',

    data: function() {
        return {
            birthday: "",
            name: "",
            gender: "",
            parents: "",
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
        console.log(this.id);
        this.loadAjax({
            type: "get",
            url: this.getUrl("child_edit", this.id),
        })
        .done((data) => {
          this.birthday = moment(data.birthday).local().toDate();
          this.name = data.name;
          this.gender = data.gender;
          this.parents = helpers.allItemsString(data.parents);
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
                   ? this.getUrl("child_edit", this.id)
                   : this.getUrl("child_add"),
              data: {
                  'birthday': helpers.localdate(this.birthday),
                  'name': this.name,
                  'gender': this.gender,
                  'all_parents': this.parents,
              },
              traditional: true, // To prevent extra brackets in content-key
          }).done( ()=> {
              this.$emit("updated");
          });
        },
        doDelete() {
          this.loadAjax({
              type: "post",
              url: this.getUrl("children_delete", this.id),
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