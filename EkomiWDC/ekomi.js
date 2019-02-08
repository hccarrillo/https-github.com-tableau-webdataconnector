(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();
    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
		

		var cols = [
		{id: "submitted",dataType: tableau.dataTypeEnum.date},
		{id: "order_id",alias: "order id",dataType: tableau.dataTypeEnum.string},
		{id: "rating",alias: "rating",dataType: tableau.dataTypeEnum.string},
		{id: "review",alias: "review",dataType: tableau.dataTypeEnum.string},
		{id: "comment",alias: "comment",dataType: tableau.dataTypeEnum.string}];
		

        var tableSchema = {
            id: "ekomi",
            alias: "ekomi data",
            columns: cols
        };


        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("http://localhost:8889/api.ekomi.de/v3/getFeedback?auth=94983|11f79d2e7beebdd7766a96baf&version=cust-1.0.0&type=json&charset=utf-8&range=1m", function(resp) {
            var feat = resp.features,
			    tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = resp.length; i < len; i++) {
			var c = resp[i].submitted;
			var x = new Date (c * 1000);
					tableData.push({
                    "submitted": x,
                    "order_id": resp[i].order_id,
                    "rating": resp[i].rating,
                    "review": resp[i].review,
					"comment": resp[i].comment
					
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };
	
    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "ekomi "; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
