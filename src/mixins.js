import $ from 'jquery';
import _ from 'lodash';

import urls from './urls.js';

var LoadingMixin = {
    data: function() {
        return {
            isLoading: false,
            requestActive: false,
        };
    },

    methods: {
        loadAjax(params) {
            this.requestActive = true;
            this._debounceLoading();

            return $.ajax(params)
              .always(
                () => {
                  this.isLoading = false;
                  this.requestActive = false;
                }
              ).fail(
                (response) => {
                  if (response.responseText.startsWith("<!DOCTYPE html>")) {
                    this.popupError("HTML response received.");
                  } else if (response.status === 400) {
                    try {
                      let errors = JSON.parse(response.responseText);
                      let responseText = "";

                      for (const [key, value] of Object.entries(errors)) {
                        if (responseText.length > 0) {
                          responseText += " - ";
                        }
                        responseText += key + ": " + value;
                      }

                      this.popupError(responseText, "Invalid input");
                    } catch {
                      this.popupError("Invalid Input.");
                    }
                  } else {
                    this.popupError("Error " + response.status);
                  }
                }
              );
        },
        setLoading() {
            if (this.requestActive) {
                this.isLoading = true;
            } else {
                this.isLoading = false;
            }
        },
        popupError(errormsg, title="Error") {
            this.errorPopup = ''
            this.$bvModal.msgBoxOk(errormsg, {
                title: title,
                size: 'sm',
                buttonSize: 'sm',
                okVariant: 'danger',
                headerClass: 'p-2 border-bottom-0',
                footerClass: 'p-2 border-top-0',
                centered: true
            }).then(value => {
                this.errorPopup = value;
            })
        },
    },

    created: function() {
        this._debounceLoading = _.debounce(this.setLoading, 200);
    }
}

var UrlMixin = {
    methods: {
        getUrl(target, id = 0) {
            return urls(
                this.$root.userdata.id,
                this.$root.userdata.currentChild.id,
                target,
                id
            );
        },
    },
}

var TableAccordionMixin = {
    data: function() {
        return {
            data: [],
        };
    },
  methods: {
    initAccordion(data) {
      for (const i in data) {
        data[i]._showDetails = false;
      }
      this.data = data;
    },
    accordion(row) {
      const rowShowing = row.item._showDetails;
      for (const i in this.data) {
        this.data[i]._showDetails = false;
      }
      if (!rowShowing)
        row.toggleDetails();
      this.$refs.table.refresh();
    },
  }
}

export { LoadingMixin, UrlMixin, TableAccordionMixin };