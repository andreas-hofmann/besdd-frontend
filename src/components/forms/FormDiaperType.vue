<template>
<div>
    <b-spinner v-show="requestActive" class="mt-4"/>

    <b-container v-if="!requestActive">
      <b-row>
        <b-col />
        <b-col md=10>
          <b-form-group>
            <small id="typeHelpId" class="text-muted">Type</small>
            <b-form-input v-model="type" aria-describedby="typeHelpId" />
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

      <FormButtons noDelete=true :id="id" @submit="doSubmit" />

    </b-container>
</div>
</template>

<script>
import { LoadingMixin, UrlMixin } from "../../mixins.js";
import * as helpers from '../../helpers.js';
import FormButtons from './Buttons.vue';

export default {
    name: 'FormDiaperType',

    data: function() {
        return {
            type: "",
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
            url: this.getUrl("diapertypes_edit", this.id),
        })
        .done((data) => {
          this.type = data.name;
          this.description = data.description;
        });
      }
    },

    methods: {
        doSubmit() {
          this.loadAjax({
              type: "post",
              url: this.id
                   ? this.getUrl("diapertypes_edit", this.id)
                   : this.getUrl("diapertypes_add"),
              data: {
                  'name': this.type,
                  'description': this.description,
              },
          }).done( ()=> {
              this.$emit("updated");
          });
        },
    }
}
</script>