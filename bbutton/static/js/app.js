function buildMetadata(sample) {
  var url = "/metadata/" + sample;
  var selector = d3.select("tbody");

  // d3.json(url).then(function(response){
  //   Object.entries(response).forEach(([key, value]) => {
  //     selector.append("tr").append("td").text(key);
  //     d3.select("tr").append("td").text(value);
  d3.select("#sample-metadata").html("");
  var meta_table = d3.select("#sample-metadata").append("ul");
  d3.json(url).then(function(response) {
   console.log(response);

   meta_table.append("li").text("AGE: " + response.AGE);
   meta_table.append("li").text("BBTYPE: " + response.BBTYPE);
   meta_table.append("li").text("GENDER: " + response.GENDER);
   meta_table.append("li").text("LOCATION: " + response.LOCATION);
   meta_table.append("li").text("WFREQ: " + response.WFREQ);
  });
}
  // @TODO: Complete the following function that builds the metadata panel
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

function buildCharts(sample) {
  var url = "/samples/" + sample;
  d3.json(url).then(function(response){
    console.log(response);
    var trace = {
      x:response.otu_ids,
      y:response.sample_values,
      name: response.otu_labels,
      type: "scatter",
      mode: "markers",
      marker: {
        size: response.sample_values,
        color: response.otu_ids
      }
    };
    var data = [trace];
    var layout = {
      xaxis: {title: "OTU_IDS"}
    };
    Plotly.newPlot("bubble", data, layout);


  });

  d3.json(url).then(function(response){
    console.log(response);
    var samples_sliced = response.sample_values.slice(0,10);
    var ids_sliced = response.otu_ids.slice(0,10);
    var labels_sliced = response.otu_labels.slice(0,10);
    var trace = {
      values:samples_sliced,
      labels:ids_sliced,
      type: "pie",
      text: labels_sliced,
      hoverinfo: "text"
      }
    var data = [trace];
    var layout = {
      hovermode: 'closest'
    };
    Plotly.newPlot("pie", data, layout);



  });


}
  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
