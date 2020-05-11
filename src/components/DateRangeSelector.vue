<template>
  <div id="range-selector">
    <b-row class="mb-2" align-h="center">
      <div class="col-xs-3">
        Select time range:
      </div>
    </b-row>

    <b-row align-h="center">
      <div class="col-xs-4 mx-2">
        From:
        <div class="input-group">
          <input
            v-model="from"
            @changed="from = $event.target.value"
            type="date"
            class="form-control"
          />
        </div>
      </div>
      <div class="col-xs-4 mx-2">
        To:
        <div class="input-group">
          <input
            v-model="to"
            @changed="to = $event.target.value"
            type="date"
            class="form-control"
          />
        </div>
      </div>
    </b-row>

    <b-row align-h="center">
      <div class="col-xs-2">
        Shift time window (by days):
        <div class="input-group mb-5">
          <div
            @click="move_window(-1)"
            class="input-group-prepend1 page-link"
            aria-label="Previous"
          >
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </div>
          <input
            v-model="window"
            type="number"
            size="2"
            min="1"
            max="365"
            class="form-control"
          />
          <div
            @click="move_window(1)"
            class="input-group-append page-link"
            aria-label="Next"
          >
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </div>
        </div>
      </div>
    </b-row>
  </div>
</template>

<script>
import moment from "moment";
import _ from "lodash";

export default {
  name: "date-range-selector",
  props: {
    dateRangeDays: Number
  },

  data: function() {
    return {
      window: 7,
      from: null,
      to: null
    };
  },

  methods: {
    move_window: function(direction) {
      this.from = moment(this.from)
        .add(direction * this.window, "days")
        .format("YYYY-MM-DD");
      this.to = moment(this.to)
        .add(direction * this.window, "days")
        .format("YYYY-MM-DD");
    },
    emitDates: function() {
      this.$emit("dates", { "from": this.from, "to": this.to });
    }
  },

  watch: {
    from: function() {
      this.debounce_emit();
    },
    to: function() {
      this.debounce_emit();
    }
  },

  created: function() {
    this.from = moment()
      .subtract([this.dateRangeDays], "days")
      .format("YYYY-MM-DD");
    this.to = moment().format("YYYY-MM-DD");
    this.debounce_emit = _.debounce(this.emitDates, 750);
  }
};
</script>
