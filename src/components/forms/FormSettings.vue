<template>
<div>
    <b-spinner v-show="requestActive" class="mt-4"/>

    <b-container v-if="!requestActive">

      <b-row>
        <b-col md=6>
          <b-form-group>
            <small id="childHelpId" class="text-muted">Default child</small>
            <b-form-select aria-described-by="childHelpId" v-model="settings.default_child" :options="allChildren"  value-field="id" text-field="name">
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group>
            <small id="newUiHelpId" class="text-muted">Use new UI?</small>
            <b-form-checkbox v-model="settings.use_new_ui"  aria-described-by="newUiHelpId" />
          </b-form-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col md=3>
          <b-form-group>
            <small id="rasterHelpId" class="text-muted">Histogram raster (minutes)</small>
            <b-form-input aria-described-by="rasterHelpId" v-model="settings.histogram_raster" :value="settings.histogram_raster" />
          </b-form-group>
        </b-col>
        <b-col md=3>
          <b-form-group>
            <small id="factorHelpId" class="text-muted">Time factor (meals+diapers)</small>
            <b-form-input aria-described-by="factorHelpId" v-model="settings.histogram_factor_md" :value="settings.histogram_factor_md" />
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group>
            <small id="graphsHelpId" class="text-muted">Plots enabled by default</small>
            <b-form-checkbox-group v-model="enabledGraphs" :options="graphOptions"  aria-described-by="graphsHelpId">
            </b-form-checkbox-group>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col md=3>
          <b-form-group>
            <small id="rangeHelpId" class="text-muted">Default days range (summary)</small>
            <b-form-input aria-described-id="rangeHelpId" v-model="settings.date_range_days" :value="settings.date_range_days" />
          </b-form-group>
        </b-col>
        <b-col md=3>
          <b-form-group>
            <small id="detailsrangeHelpId" class="text-muted">Default days range (details)</small>
            <b-form-input aria-described-id="detailsrangeHelpId" v-model="settings.date_range_days_details" :value="settings.date_range_days" />
          </b-form-group>
        </b-col>
        <b-col md=3>
          <b-form-group>
            <small id="startDayHelpId" class="text-muted">Start hour day</small>
            <b-form-input are-described-by="startDayHelpId" v-model="settings.start_hour_day" :value="settings.start_hour_day" />
          </b-form-group>
        </b-col>
        <b-col md=3>
          <b-form-group>
            <small id="startNightHelpId" class="text-muted">Start hour night</small>
            <b-form-input aria-described-by="startNightHelpId" v-model="settings.start_hour_night" :value="settings.start_hour_night" />
          </b-form-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col md=3>
          <b-form-group>
            <small id="paginateHelpId" class="text-muted">Paginate by:</small>
            <b-form-input aria-described-by="paginateHelpId" v-model="settings.paginate_by" :value="settings.paginate_by" />
          </b-form-group>
        </b-col>
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
    name: 'FormSettings',

    data: function() {
        return {
            helpers: helpers,
            settings: {
              paginate_by: 0,
              date_range_days: 0,
              sleep_enabled: 0,
              meals_enabled: 0,
              diapers_enabled: 0,
              default_child: 0,
              start_hour_day: 0,
              start_hour_night: 0,
              histogram_raster: 0,
              histogram_factor_md: 0,
              use_new_ui: 0,
            },
            allChildren: [],
            enabledGraphs: [],
            graphOptions: {}
        };
    },

    components: {
      FormButtons
    },

    mixins: [
        LoadingMixin,
        UrlMixin
    ],

    created: function() {
      this.loadAjax({
          type: "get",
          url: this.getUrl("settings"),
      })
      .done((data) => {
        this.settings.paginate_by = data.paginate_by;
        this.settings.date_range_days = data.date_range_days;
        this.settings.date_range_days_details = data.date_range_days_details;
        this.settings.sleep_enabled = data.sleep_enabled;
        this.settings.meals_enabled = data.meals_enabled;
        this.settings.diapers_enabled = data.diapers_enabled;
        this.settings.start_hour_day = data.start_hour_day;
        this.settings.start_hour_night = data.start_hour_night;
        this.settings.histogram_raster = data.histogram_raster;
        this.settings.histogram_factor_md = data.histogram_factor_md;
        this.settings.default_child = data.default_child;
        this.settings.use_new_ui = data.use_new_ui;

        this.allChildren = this.$root.userdata.children;

        this.graphOptions = [
          { text: "Sleep", value: "Sleep" },
          { text: "Meals", value: "Meals" },
          { text: "Diapers", value: "Diapers" },
        ];

        this.enabledGraphs = [];
        if (this.settings.sleep_enabled) this.enabledGraphs.push("Sleep");
        if (this.settings.meals_enabled) this.enabledGraphs.push("Meals");
        if (this.settings.diapers_enabled) this.enabledGraphs.push("Diapers");
      });
    },

    methods: {
        doSubmit() {
          this.settings.sleep_enabled = this.enabledGraphs.includes("Sleep");
          this.settings.meals_enabled = this.enabledGraphs.includes("Meals");
          this.settings.diapers_enabled = this.enabledGraphs.includes("Diapers");

          this.loadAjax({
              type: "post",
              url: this.getUrl("settings"),
              data: this.settings,
              traditional: true, // To prevent extra brackets in content-key
          }).done( ()=> {
              this.$emit("updated");
              this.$root.fetchUserSettings();
          });
        },
    }
}
</script>