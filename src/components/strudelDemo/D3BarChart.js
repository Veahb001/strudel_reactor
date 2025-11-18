import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { getD3Data } from '../../utils/console-monkey-patch';

export default function D3BarChart() {
    const svgRef = useRef(null);
    const [data, setData] = useState([]);

    // Subscribe to hap data updates
    useEffect(() => {
        const handleD3Data = (event) => {
            setData(event.detail);
        };

        document.addEventListener('d3Data', handleD3Data);

        // Also poll as backup
        const interval = setInterval(() => {
            const currentData = getD3Data();
            if (currentData.length > 0) {
                setData(currentData);
            }
        }, 100);

        return () => {
            document.removeEventListener('d3Data', handleD3Data);
            clearInterval(interval);
        };
    }, []);

    // Draw D3 bar chart
    useEffect(() => {
        if (!svgRef.current || data.length === 0) return;

        // Clear previous chart
        d3.select(svgRef.current).selectAll('*').remove();

        // Dimensions
        const margin = { top: 20, right: 30, bottom: 40, left: 50 };
        const width = svgRef.current.clientWidth - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        // Create SVG
        const svg = d3.select(svgRef.current)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Extract gain values from hap strings
        const extractGain = (hapString) => {
            if (!hapString) return 0;
            const match = hapString.match(/gain:([\d.]+)/);
            return match ? parseFloat(match[1]) : 0.5;
        };

        const values = data.slice(-20).map(extractGain); // Show last 20 values

        // Scales
        const xScale = d3.scaleBand()
            .domain(d3.range(values.length))
            .range([0, width])
            .padding(0.2);

        const yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([height, 0]);

        // Colour scale
        const colourScale = d3.scaleSequential()
            .domain([0, 1])
            .interpolator(d3.interpolateCool);

        // Draw bars
        svg.selectAll('.bar')
            .data(values)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', (d, i) => xScale(i))
            .attr('y', d => yScale(d))
            .attr('width', xScale.bandwidth())
            .attr('height', d => height - yScale(d))
            .attr('fill', d => colourScale(d))
            .attr('rx', 2);

        // Add axis
        const xAxis = d3.axisBottom(xScale);
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(xAxis)
            .style('colour', '#666');

        const yAxis = d3.axisLeft(yScale).ticks(5);
        svg.append('g')
            .call(yAxis)
            .style('colour', '#666');

        // Add labels
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height + 35)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#666')
            .text('Recent Haps');

        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -35)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#666')
            .text('Gain Value');

    }, [data]);

    return (
        <div className="d3-bar-chart-container">
            <h4>Real-Time Audio Data</h4>
            <svg
                ref={svgRef}
                width="100%"
                height="300"
                style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundcolour: '#f8f9fa'
                }}
            />
            <div style={{ marginTop: '10px', fontSize: '12px', colour: '#666' }}>
                Showing last 20 hap events | Total captured: {data.length}
            </div>
        </div>
    );
}