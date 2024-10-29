sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/type/String", // Import the type String to use in Range fields
    "sap/ui/comp/library", // Import sap.ui.comp library
    "sap/ui/comp/valuehelpdialog/ValueHelpDialog",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, TypeString, compLibrary, ValueHelpDialog, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("project2.controller.View1", {
        onInit: function () {
            this._oMultipleConditionsDialog = null; // Dialog is initially null

            var oData = {
                Products: [
                    { ProductId: "P001", Name: "Laptop", Category: "Electronics", Price: "1200" },
                    { ProductId: "P002", Name: "Mobile", Category: "Electronics", Price: "600" },
                    { ProductId: "P003", Name: "Shoes", Category: "Fashion", Price: "150" },
                    { ProductId: "P004", Name: "Watch", Category: "Accessories", Price: "300" }
                ]
            };
            var oModel = new JSONModel(oData);

            // Set the model to the view
            this.getView().setModel(oModel);
        },

        onMultipleConditionsVHRequested: function () {
            // Check if the dialog is already created
            if (!this._oMultipleConditionsDialog) {
                // Load the fragment if it hasn't been loaded before
                this.loadFragment({
                    name: "project2.view.searchfragment" // Ensure this path is correct
                }).then(function (oFragment) {
                    this._oMultipleConditionsDialog = oFragment;
                    this._configureMultipleConditionsVH(); // Configure dialog after loading
                    this.getView().addDependent(this._oMultipleConditionsDialog); // Add as dependent to handle lifecycle
                    this._oMultipleConditionsDialog.open(); // Open the dialog
                }.bind(this)).catch(function (oError) {
                    console.error("Error loading fragment: ", oError);
                });
            } else {
                this._oMultipleConditionsDialog.open(); // Open if already created
            }
        },

        _configureMultipleConditionsVH: function () {
            // Configure the ValueHelpDialog with range key fields and tokens
            var aRangeKeyFields = [{
                label: "Product",  // Label for the range key field
                key: "ProductId",  // Key that identifies the field
                type: "string",    // Data type of the field
                typeInstance: new TypeString({}, { maxLength: 7 }) // Instance for string with a max length of 7
            }];

            // Set the range key fields on the dialog
            this._oMultipleConditionsDialog.setRangeKeyFields(aRangeKeyFields);

            // Get the MultiInput control and bind its tokens to the dialog
            var oMultiInput = this.byId("multipleConditions");
            if (oMultiInput) {
                this._oMultipleConditionsDialog.setTokens(oMultiInput.getTokens());
            }
        },

        onMultipleConditionsValueHelpOkPress: function (oEvent) {
            // When OK is pressed, get the tokens selected in the ValueHelpDialog
            var aTokens = oEvent.getParameter("tokens");

            // Set those tokens to the MultiInput field
            var oMultiInput = this.byId("multipleConditions");
            if (oMultiInput) {
                oMultiInput.setTokens(aTokens);
            }

            // Close the dialog
            this._oMultipleConditionsDialog.close();
        },

        onMultipleConditionsCancelPress: function () {
            // Close the dialog without saving any changes
            this._oMultipleConditionsDialog.close();
        },

        onMultipleConditionsAfterClose: function () {
            // Destroy the dialog after it is closed to free up resources
            if (this._oMultipleConditionsDialog) {
                this._oMultipleConditionsDialog.destroy();
                this._oMultipleConditionsDialog = null; // Reset dialog reference to null
            }
        },

        onvaluehelp: function () {
            // Consolidate value help logic to use onMultipleConditionsVHRequested
            this.onMultipleConditionsVHRequested();
        },
        onGoPress: function () {
            // Get the MultiInput control
            var oMultiInput = this.byId("multiInputFilter");

            // Get the entered values (you can use getTokens if there are multiple tokens)
            var sQuery = oMultiInput.getValue(); // Get entered text

            // Create a filter array
            var aFilters = [];

            // If there's a value entered, create a filter for the ProductId
            if (sQuery) {
                var oFilter = new Filter("ProductId", FilterOperator.Contains, sQuery);
                aFilters.push(oFilter);
            }

            // Get the table and its binding
            var oTable = this.byId("productTable");
            var oBinding = oTable.getBinding("items");

            // Apply the filter to the table binding
            oBinding.filter(aFilters);
        }
    });
});
