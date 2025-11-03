import * as d3 from 'd3';
import { useEffect, useState, useRef } from 'react';
import { subscribe, unsubscribe, getD3Data } from '../../utils/console-monkey-patch';

export default function D3Graph({ logData }) {
  const svgRef = useRef();
  const [data, setData] = useState(getD3Data());

  // Listen for "d3Data" events from console-monkey-patch.js
  useEffect(() => {
    const handleUpdate = (event) => {
      console.debug("D3Graph received event:", event?.detail?.length);
      setData(event.detail); 
    };

    subscribe('d3Data', handleUpdate);
    return () => unsubscribe('d3Data', handleUpdate);
  }, []);

  // Render the D3 graph
  useEffect(() => {
    
    if (! data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    const rect = svgRef.current.getBoundingClientRect();
    const width = rect.width || 400;
    const height = rect.height || 250;

    svg.selectAll('*').remove();

    // Parse and scale data
    
    if (!data || data.length === 0) {
      // show waiting text
      svg
        .append("text")
        .attr("x", 20)
        .attr("y", 30)
        .attr("fill", "#888")
        .text("Waiting for Strudel log data...");
      return;
    }

    // parse numeric values
    const yValues = data.map((d) => parseFloat(d)).filter((d) => !isNaN(d));
    if (yValues.length === 0) {
      svg
        .append("text")
        .attr("x", 20)
        .attr("y", 30)
        .attr("fill", "#888")
        .text("No numeric data yet");
      return;
    }

    const xScale = d3.scaleLinear().domain([0, yValues.length - 1]).range([0, width]);
    const yScale = d3.scaleLinear().domain([d3.min(yValues), d3.max(yValues)]).nice().range([height, 0]);

    const line = d3.line().x((_, i) => xScale(i)).y((d) => yScale(d)).curve(d3.curveMonotoneX);


    svg.append('path')
      .datum(yValues)
      .attr('fill', 'none')
      .attr('stroke', '#00ff88')
      .attr('stroke-width', 2)
      .attr('d', line);

  }, [data]);

  return (
    <div
      style={{
        width: '100%',
        height: '250px',
        background: '#0a0a0a',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '8px',
      }}
    >
      <svg ref={svgRef} width="100%" height="100%"></svg>
    </div>
  );
}