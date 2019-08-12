const svg = d3.select("svg");

const height = svg.attr("height");
const width = svg.attr("width");

const fake_data_url = "https://my.api.mockaroo.com/shellder.json?key=184542f0";

const render = data => {

    const xValue = d => d.population
    const yValue = d => d.country
    const margin = {
        top: 50,
        right: 100,
        left: 100,
        bottom: 50
    }
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;


    // xScale is an object to map the input data's domain to the bar chart's range.
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, xValue)])
        .range([0, innerWidth]);
    
    // band scale data space => screen space
    const yScale = d3.scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.1)


    // using the margin
    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)

    // adding axis
    g.append("g").call(d3.axisLeft(yScale));
    g.append("g").call(d3.axisBottom(xScale))
        .attr("transform", `translate(0, ${innerHeight})`);

    // console.log(xScale.domain());
    // console.log(xScale.range());
    // console.log(yScale.domain());
    // console.log(yScale.range());

    g.selectAll('rect').data(data)
        .enter().append("rect")
            .attr("y", d => yScale(yValue(d)))
            .attr("width", d => xScale(xValue(d)))
            .attr("height", yScale.bandwidth()) // bandwith: computed with of a single bar
};

d3.csv(fake_data_url).then(data => {
    data.forEach(d => {
        d.population = d.population * 100
    })
    console.log(data);
    render(data)
})

