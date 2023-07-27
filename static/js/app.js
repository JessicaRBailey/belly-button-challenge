// Belly button json url
const bbURL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

let testSubjects;
let samples;
let metadata;

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

// Function to get the test subject's OTU data based on the dropdown menu selection
function getData(dataset) {
    let selectedData = samples.find(sample => sample.id === dataset);
    let selectedMetadata = metadata.filter((meta) => meta.id === parseInt(dataset))[0];

    if (selectedData && selectedMetadata) {
        let otuIDs = selectedData.otu_ids.slice(0, 10).reverse();
        let values = selectedData.sample_values.slice(0, 10).reverse();
        let otuLabels = selectedData.otu_labels.slice(0, 10).reverse();
        
        // Call function to update the bar chart
        updatePlotly(dataset, values, otuIDs, otuLabels);
        // Call function to update the bubble chart
        updateBubbleChart(dataset, selectedData.otu_ids, selectedData.sample_values, selectedData.otu_labels);
        // Call function to update the metadata table
        updateMetadataTable(selectedMetadata);
    }
}

// Fetch the data and populate the dropdown
d3.json(bbURL).then(function(data) {
    testSubjects = data.names;
    samples = data.samples;
    metadata = data.metadata;

    // Call the function to populate the dropdown with test subjects
    populateDropdown(testSubjects);

    // On change to the DOM, call getData() 
    d3.selectAll("#selDataset").on("change", function() {
        const dataset = d3.select("#selDataset").property("value");
        getData(dataset); 
    });

    // Start the page with graph
    init();
});

// Update graphs when a new record is selected.
function updatePlotly(dataset, x, y, text) {
    const trace = {
        x: x,
        y: y.map(id => `OTU ${id}`),
        text: text,
        type: 'bar',
        orientation: 'h'
    };

    const data = [trace];

    const layout = {
        title: `Top 10 OTUs for subject ${dataset}`,
        xaxis: {title: 'Values'},
    };

    Plotly.newPlot('bar', data, layout); 
}

// Update bubble chart when a new record is selected.
function updateBubbleChart(dataset, x, y, text) {
    const trace = {
        x: x,
        y: y,
        text: text,
        mode: 'markers',
        marker: {
            size: y,
            color: x,
            colorscale: 'Earth'
        }
    };

    const data = [trace];

    const layout = {
        title: `Bubble Chart for subject ${dataset}`,
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Sample Values' },
    };

    Plotly.newPlot('bubble', data, layout);
}

function updateMetadataTable(metadata) {
    // Get a reference to the table body element in the HTML
    const tableBody = d3.select("#sample-metadata");
  
    // Clear the existing table contents
    tableBody.html("");
  
    // Append table rows for each key-value pair
    tableBody.append("p").text(`Id: ${metadata.id}`);
    tableBody.append("p").text(`ethnicity: ${metadata.ethnicity}`);
    tableBody.append("p").text(`gender: ${metadata.gender}`);
    tableBody.append("p").text(`age: ${metadata.age}`);
    tableBody.append("p").text(`location: ${metadata.location}`);
    tableBody.append("p").text(`bbtype: ${metadata.bbtype}`);
    tableBody.append("p").text(`wfreq: ${metadata.wfreq}`);
  }


// Start webpage with graphs for 940
function init() {
    // Set the default test subject ID to 940
    const defaultSubject = "940";
    
    // Call the getData function with the defaultSubject after a short delay to ensure data is available
    setTimeout(() => {
        getData(defaultSubject);
    }, 100);
}

init();