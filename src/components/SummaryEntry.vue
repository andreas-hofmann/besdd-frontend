<template>
  <div class="summary-entry">
    <b-card no-body>
      <b-card-header header-tag="header" role="tab" class="p-1">
        <h5 class="mb-0">
          <b-container>
            <b-row class="mt-2">
              <div v-if="summary.sleep" class="col-xs small mt-2 ml-2">
                <small>
                  Slept {{ secToHHMM(summary.sleep.sum.time) }} in
                  {{ summary.sleep.sum.count }} phases.
                </small>
              </div>

              <div v-if="summary.meals" class="col-xs small mt-2 ml-2">
                <small>{{ summary.meals.sum.count }} meals eaten.</small>
              </div>

              <div v-if="summary.diapers" class="col-xs small mt-2 ml-2">
                <small>{{ summary.diapers.sum.count }} diapers used.</small>
              </div>

              <div class="ml-auto">
                <b-btn-group role="group">
                  <b-icon
                    v-if="summary.diary"
                    icon="book"
                    class="mt-1 mr-2"
                  ></b-icon>
                  <b-icon
                    v-if="summary.events"
                    icon="trophy"
                    class="mt-1 mr-2"
                  ></b-icon>
                  <b-icon
                    v-if="summary.measurements"
                    icon="calendar"
                    class="mt-1 mr-2"
                  ></b-icon>
                  <small class="mt-2 mr-2">{{ day }}</small>
                  <b-btn
                    class="btn-link bg-light"
                    v-b-toggle="'collapse-' + idx"
                  >
                    <span class="when-open">
                      <b-icon icon="chevron-compact-up"></b-icon>
                    </span>
                    <span class="when-closed">
                      <b-icon icon="chevron-compact-down"></b-icon>
                    </span>
                  </b-btn>
                </b-btn-group>
              </div>
            </b-row>
          </b-container>
        </h5>
      </b-card-header>

      <b-collapse
        v-bind:id="'collapse-' + idx"
        v-bind:visible="idx == initial_expand ? true : false"
        accordion="accordion"
        role="tabpanel"
      >
        <b-card-body>
          <b-container>
            <div v-if="summary.sleep" v-bind:id="['sleep' + idx]">
              <b-row class="mb-2">
                <b-col md></b-col>
                <b-col md>
                  <h3><u>Sleep</u></h3>
                </b-col>
                <b-col md></b-col>
              </b-row>
              <b-row>
                <b-col md>
                  <h5>Total:</h5>
                  <p>
                    {{ secToHHMM(summary.sleep.sum.time) }} in
                    {{ summary.sleep.sum.count }} phases.<br />
                    Avg. length {{ avgTime(summary.sleep.sum) }}.<br />
                    Avg. interval {{ avgInterval(summary.sleep.sum) }}.
                  </p>
                </b-col>
                <b-col md>
                  <h5>Day:</h5>
                  <p>
                    {{ secToHHMM(summary.sleep.day.time) }} in
                    {{ summary.sleep.day.count }} phases.<br />
                    Avg. length {{ avgTime(summary.sleep.day) }}.<br />
                    Avg. interval {{ avgInterval(summary.sleep.day) }}.
                  </p>
                </b-col>
                <b-col md>
                  <h5>Night:</h5>
                  <p>
                    {{ secToHHMM(summary.sleep.night.time) }} in
                    {{ summary.sleep.night.count }} phases.<br />
                    Avg. length {{ avgTime(summary.sleep.night) }}.<br />
                    Avg. interval {{ avgInterval(summary.sleep.night) }}.
                  </p>
                </b-col>
              </b-row>
            </div>

            <div v-if="summary.meals" v-bind:id="['meals' + idx]">
              <b-row mb=2>
                <b-col md></b-col>
                <b-col md>
                  <h3><u>Meals</u></h3>
                </b-col>
                <b-col md></b-col>
              </b-row>
              <b-row>
                <b-col md>
                  <h5>Total:</h5>
                  <p>
                    {{ summary.meals.sum.count }} meals eaten.<br />
                    <template v-if="$root.usersettings.show_meal_durations">
                      Total feeding time {{ secToHHMM(summary.meals.sum.time) }} .<br />
                      Avg. feeding time {{ avgTime(summary.meals.sum) }}.<br />
                    </template>
                    Avg. interval {{ avgInterval(summary.meals.sum) }}.
                  </p>
                </b-col>
                <b-col md>
                  <h5>Day:</h5>
                  <p>
                    {{ summary.meals.day.count }} meals eaten.<br />
                    <template v-if="$root.usersettings.show_meal_durations">
                      Total feeding time {{ secToHHMM(summary.meals.day.time) }} .<br />
                      Avg. feeding time {{ avgTime(summary.meals.day) }}.<br />
                    </template>
                    Avg. interval {{ avgInterval(summary.meals.day) }}.
                  </p>
                </b-col>
                <b-col md>
                  <h5>Night:</h5>
                  <p>
                    {{ summary.meals.night.count }} meals eaten.<br />
                    <template v-if="$root.usersettings.show_meal_durations">
                      Total feeding time {{ secToHHMM(summary.meals.night.time) }}.<br />
                      Avg. feeding time {{ avgTime(summary.meals.night) }}.<br />
                    </template>
                    Avg. interval {{ avgInterval(summary.meals.night) }}.
                  </p>
                </b-col>
              </b-row>
            </div>

            <div v-if="summary.diapers" v-bind:id="['diapers' + idx]">
              <b-row class="mb-2">
                <b-col md></b-col>
                <b-col md>
                  <h3><u>Diapers</u></h3>
                </b-col>
                <b-col md></b-col>
              </b-row>
              <b-row>
                <b-col md>
                  <h5>Total:</h5>
                  <p>
                    {{ summary.diapers.sum.count }} diapers used.<br />
                    Avg. interval {{ avgInterval(summary.diapers.sum) }}.
                  </p>
                </b-col>
                <b-col md>
                  <h5>Day:</h5>
                  <p>
                    {{ summary.diapers.day.count }} diapers used.<br />
                    Avg. interval {{ avgInterval(summary.diapers.day) }}.
                  </p>
                </b-col>
                <b-col md>
                  <h5>Night:</h5>
                  <p>
                    {{ summary.diapers.night.count }} diapers used.<br />
                    Avg. interval {{ avgInterval(summary.diapers.night) }}.
                  </p>
                </b-col>
              </b-row>
            </div>

            <div v-if="summary.measurements" v-bind:id="['measurements' + idx]">
              <b-row>
                <b-col md></b-col>
                <b-col md>
                  <h3><u>Measurements</u></h3>
                </b-col>
                <b-col md></b-col>
              </b-row>
              <div
                v-for="(measurement, idx) in summary.measurements"
                v-bind:key="idx"
              >
                <b-row class="mb-2">
                  <b-col md v-if="measurement.height">
                    <h4>Height</h4>
                    <p>
                      {{ measurement.height }}
                    </p>
                  </b-col>
                  <b-col md v-if="measurement.weight">
                    <h4>Weight</h4>
                    <p>
                      {{ measurement.weight }}
                    </p>
                  </b-col>
                </b-row>
              </div>
            </div>

            <div v-if="summary.events" v-bind:id="['events' + idx]">
              <b-row>
                <div class="col-md"></div>
                <div class="col-md">
                  <h3><u>Events</u></h3>
                </div>
                <div class="col-md"></div>
              </b-row>
              <div v-for="(event, idx) in summary.events" v-bind:key="idx">
                <b-row class="mb-2">
                  <b-col md>
                    <h4>{{ event.event }}</h4>
                    <p>
                      {{ event.description }}
                    </p>
                  </b-col>
                </b-row>
              </div>
            </div>

            <div v-if="summary.diary" v-bind:id="['diary' + idx]">
              <b-row>
                <b-col md></b-col>
                <b-col md>
                  <h3><u>Diary</u></h3>
                </b-col>
                <b-col md></b-col>
              </b-row>
              <div v-for="(entry, idx) in summary.diary" v-bind:key="idx">
                <b-row class="mb-2">
                  <b-col md>
                    <h4>{{ entry.title }}</h4>
                    <p>
                      {{ entry.content }}
                    </p>
                  </b-col>
                </b-row>
              </div>
            </div>
          </b-container>
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>

import * as helpers from '../helpers.js';

export default {
  name: "summary-entry",
  props: {
    summary: { type: Object },
    day: { type: String },
    idx: { type: Number }
  },
  data: function() {
    return {
      initial_expand: -1, // Row to expand initially. -1 for none.
      helpers: helpers,
    };
  },
  methods: {
    avg: function(time, count) {
      let t = parseFloat(time);
      let c = parseFloat(count);

      if (t && c) return (t / c);

      return 0;
    },
    avgTime: function(val) {
      let ret = helpers.secToHHMM(this.avg(val.time, val.count));
      if (ret.length) return ret;
      return "0:00";
    },
    avgInterval: function(val) {
      let ret = helpers.secToHHMM(this.avg(val.interval, val.count));
      if (ret.length) return ret;
      return "0:00";
    },
    secToHHMM(val) {
      let ret = helpers.secToHHMM(val);
      if (ret.length) return ret;
      return "0:00";
    }
  }
};
</script>

<style>
.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}
</style>
