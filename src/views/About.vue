<template>
  <div class="about">
    <h1>besdd - A babys eat-sleep-diaper diary.</h1>

    <b-container>
      <b-row>
        <b-col />
        <b-col cols=8>
          <p>
            Track your baby's sleeping, eating and relieving habits.
          </p>

          <p>
            This started out as just a script to plot a histogram from spreadsheet data, but since logging data via Excel/Libreoffice/whatever is tedious, uncomfortable and error prone, I created this web app.
          </p>
        </b-col>
        <b-col />
      </b-row>

      <b-row>
        <b-col />
        <b-col cols=8>
          <h4> Features: </h4>

          <ul>
          </ul>
          <li> Log sleep phases, meals and changed diapers </li>
          <li>Log height/weight measurements</li>
          <li>Log special events (like first steps, words, etc.)</li>
          <li>Log diary entries</li>
          <li>Allow other users to add+view child data</li>
          <li>Display the data in a summary list or in graphical form</li>

        </b-col>
        <b-col />
      </b-row>

      <b-row class="mt-4">
        <b-col />
          <p>
          Check out the source on <b-link href="https://github.com/andreas-hofmann/besdd">github</b-link>.
          </p>
        <b-col />
      </b-row>

    </b-container>
  </div>
</template>

<script>
export default {
  name: "About",
}
</script>