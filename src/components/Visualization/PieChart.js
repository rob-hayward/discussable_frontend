// src/components/Visualization/PieChart.js
import React, { useEffect } from 'react';
import * as d3 from 'd3';

const PieChart = ({ word }) => {
    useEffect(() => {
        let data;

        // Ensure that the necessary properties are defined and not null
        const positiveVotes = word.positive_votes ?? 0;
        const negativeVotes = word.negative_votes ?? 0;
        const positivePercentage = word.positive_percentage ?? 0;
        const negativePercentage = word.negative_percentage ?? 0;

        if (positiveVotes === 0 && negativeVotes === 0) {
            data = [{ name: 'No Vote', value: 1 }];
        } else {
            data = [
                { name: 'Positive votes', value: positiveVotes, percentage: positivePercentage },
                { name: 'Negative votes', value: negativeVotes, percentage: negativePercentage }
            ];
        }

        drawPieChart(data, `chart-word-${word.id}`);
            }, [word]);

            const drawPieChart = (data, elementId) => {
              // Instead of fixed dimensions, consider using the container's dimensions
            const container = document.getElementById(elementId);
            const width = container.clientWidth; // Get the width of the container
            const height = container.clientHeight; // Get the height of the container or use the same value as width for a square aspect ratio
            const fontSize = Math.max(width, height) / 25; // Adjust divisor as needed for scaling

            const color = d3.scaleOrdinal()
                            .domain(['Approve votes', 'Reject votes', 'No Vote'])
                            .range(['rgb(250, 232, 0)', '#333', 'white']);

            const pie = d3.pie().sort(null).value(d => d.value);
            const arc = d3.arc().innerRadius(0).outerRadius(Math.min(width, height) / 2 - 1);
            const arcs = pie(data);

            const svg = d3.create("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [-width / 2, -height / 2, width, height])
                .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

            svg.append("g")
                .attr("stroke", "white")
                .selectAll("path")
                .data(arcs)
                .join("path")
                .attr("fill", d => color(d.data.name))
                .attr("d", arc)
                .append("title")
                .text(d => `${d.data.name}: ${d.data.value.toLocaleString("en-US")}`);

            svg.append("g")
                .attr("text-anchor", "middle")
                .selectAll("text")
                .data(arcs)
                .join("text")
                .attr("transform", d => `translate(${arc.centroid(d)})`)
                .style("fill", "black")
                .style("font-weight", "bold")
                .style("font-size", `${fontSize}px`)
                .each(function (d) {
                    const text = d3.select(this);
                    text.append("tspan")
                        .attr("x", 0)
                        .attr("dy", "-0.1em")
                        .text(`${d.data.name}: ${d.data.value.toLocaleString("en-US")}`);

                    // Add this line to round the percentage to the nearest whole number
                    const roundedPercentage = Math.round(d.data.percentage);

                    text.append("tspan")
                        .attr("x", 0)
                        .attr("dy", "1.2em")
                        .text(`${roundedPercentage}%`);
                });

            document.getElementById(elementId).innerHTML = '';
            document.getElementById(elementId).appendChild(svg.node());
        };


    return <div className="word-piechart" id={`chart-word-${word.id}`}></div>;
};

export default PieChart;
