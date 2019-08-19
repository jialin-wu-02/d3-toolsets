const svg = d3.select("svg");

const height = svg.attr("height");
const width = svg.attr("width");

const fake_data_url = "https://my.api.mockaroo.com/shellder.json?key=184542f0";

const render = data => {

    const xValue = d => d.population
    const yValue = d => d.country
    const margin = {
        top: 80,
        right: 100,
        left: 200,
        bottom: 80
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
    const xAxisTickFormat = number => {
        return d3.format(".3s")(number).replace("G", "B");
    }

    const xAxis = d3.axisBottom(xScale)
        .tickFormat(xAxisTickFormat)
        .tickSize(-innerHeight);


    g.append("g")
        .call(d3.axisLeft(yScale))
        .selectAll('.domain, .tick line') // removing extra lines
        .remove();

    // labeling x-axis
    g.append("g").call(xAxis)
        .attr("transform", `translate(0, ${innerHeight})`)
        // .select('.domain') 
        //     .remove(); // not working???

    const xAxisG = g.append('g').call(xAxis)
        .attr('transform', `translate(0, ${innerHeight})`)
    
    xAxisG.append('text')
        .attr("class", "x-title") // !!!!important, adding class name
        .attr('y', 50)
        .attr('fill', "black")
        .attr('x', innerWidth / 2)
        .text('Population')

    g.selectAll('circle').data(data)
        .enter().append("circle")
            .attr("cy", d => yScale(yValue(d)))
            .attr("cx", d => xScale(xValue(d)))
            .attr("r", yScale.bandwidth() / 2) // bandwith: computed with of a single bar

    // adding title
    g.append('text')
        .attr("class", "title")
        .text("Some fake data with random contry names")
        .attr("y", -30)
        .attr("x", 200)
};

d3.csv(fake_data_url).then(data => {
    data.forEach(d => {
        d.population = d.population * 100
    })
    console.log(data);
    render(data)
})

