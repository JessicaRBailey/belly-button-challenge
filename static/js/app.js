// Belly button json url
const bbURL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Function to populate the dropdown with test subjects
function populateDropdown(testSubjects) {
  const dropdownMenu = d3.select("#selDataset");

  // Add options to the select element
  const options = dropdownMenu.selectAll("option")
    .data(testSubjects)
    .enter()
    .append("option")
    .text(d => d)
    .attr("value", d => d);
}

// Fetch the data and populate the dropdown
d3.json(bbURL).then(function(data) {
    const testSubjects = data.names;
    const samples = data.samples;
    const metadata = data.metadata;

    // Call the function to populate the dropdown with test subjects
    populateDropdown(testSubjects);
  

    // On change to the DOM, call getData() 
    d3.selectAll("#selDataset").on("change", getData);

    // Function to get the test subject's OTU data based on the dropdown menu selection
    function getData() {
        let dropdownMenu = d3.select("#selDataset");
        // Assign the value of the dropdown menu option to a variable
        let dataset = dropdownMenu.property("value");
        
        // Find the selected test subject's data in the samples array
        let selectedData = samples.find(sample => sample.id === dataset);
        
        if (selectedData) {
            let otuIDs = selectedData.otu_ids.slice(0, 10);
            let values = selectedData.sample_values.slice(0, 10);
            let otuLabels = selectedData.otu_labels.slice(0, 10);
            
            // Call function to update the chart
            updatePlotly(dataset, values, otuIDs, otuLabels);
        }
    }

    // Update graphs when a new record is selected.
    function updatePlotly(dataset, x, y, text) {
        const trace = {
            x: values,
            y: otuIDs.map(id => `OTU ${id}`),
            text: otuLabels,
            type: 'bar',
            orientation: 'h'
        };

        const data = [trace];

        const layout = {
            title: `Top 10 OTUs for subject ${dataset}`,
            xaxis: {title: 'Values'},
        };

        updatePlotly.newPlot('bar', data, layout); 
    }
});