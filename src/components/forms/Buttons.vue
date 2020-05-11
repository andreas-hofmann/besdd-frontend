<template>
  <b-row class="mt-3">
    <b-col cols=1 />
    <b-col cols=3>
      <b-button v-if="id != 0 && this.noDelete != 'true'" class="btn-danger" size="sm" @click="$emit('delete')">Delete Entry</b-button>
    </b-col>
    <b-col />
    <b-col cols=3>
      <b-button class="btn-warning" size="sm" @click="$emit('submit')">Submit Changes</b-button>
    </b-col>
    <b-col cols=1 />
  </b-row>
</template>

<script>
export default {
    name: "FormButtons",

    props: {
        id: { type: Number, default: 0 },
        noDelete: { type: String, default: "false" }
    }
}
</script>