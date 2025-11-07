import * as d3 from "d3";
import React, { useState, useEffect } from 'react';
import { getD3Data } from '../../utils/console-monkey-patch'

export default function D3Graph() {
    const [rngNumber, setRngNumber] = useState(0);
    const [rngArray, setRngArray] = useState([]);
    const maxItems = 20;
    const timeOut = 250;
    const maxValue = 1;

    useEffect(() => {
        const handleHapData = (event) => {
            const data = event.detail;
            if (data && data.length > 0) {
                const latestValue = data[data.length - 1]
                setRngNumber(latestValue);
            }
        };

        document.addEventListener('strudelHapData', handleHapData);

        return () => {
            document.removeEventListener('strudelHapData', handleHapData);
        };
        }, []);


    useEffect(() => {
        let tempArray = [...rngArray];

        if (typeof rngNumber === 'number' && !isNaN(rngNumber)) {
            tempArray.push(rngNumber);
            if (tempArray.length > maxItems) {
                tempArray.shift();
            }
            setRngArray(tempArray);
        }
        
    }, [rngNumber]);

    useEffect(() => {
        //Select SVG element
        const svg = d3.select('svg')
        svg.selectAll("*").remove();

        //Set the Width & Height
        let w = svg.node().getBoundingClientRect().width
        w = w - 40
        let h = svg.node().getBoundingClientRect().height
        h = h - 25
        const barMargin = 10;
        const barWidth = w / rngArray.length

        //Create yScale
        let yScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([h, 0])

        //Translate the Brs to make room for axis
        const chartGroup = svg.append('g')
            .classed('chartGroup', true)
            .attr('transform', 'translate(30, 3)');

        //Set the gradient
        chartGroup.append("linearGradient")
            .attr("id", "line-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0)
            .attr("y1", yScale(0))
            .attr("x2", 0)
            .attr("y2", yScale(maxValue))
            .selectAll("stop")
            .data([
                { offset: "0%", color: "green" },
                { offset: "100%", color: "red" }
            ])
            .enter().append("stop")
            .attr("offset", function (d) { return d.offset; })
            .attr("stop-color", function (d) { return d.color; });

        //Draw some lines
        chartGroup
            .append('path')
            .datum(rngArray.map((d) => LogToNum(d)))
            .attr('fill', 'none')
            .attr('stroke', 'url(#line-gradient)')
            .attr('stroke-width', 1.5)
            .attr('d', d3.line()
                .x((d, i) => i * barWidth)
                .y((d) => yScale(d))
            )

        //Add yAxis to chartGroup
        let yAxis = d3.axisLeft(yScale);
        chartGroup.append('g')
            .classed('axis y', true)
            .call(yAxis);

    }, [rngArray]);

    // function LogToNum(input) {
    //     if (!input) { return 0 };

    //     if (typeof input === 'number') {
    //         return input;
    //     }

    //     //If already a string (such as hap) parse
    //     if (typeof input == 'string'){
    //       var stringArray = input.split(/(\s+)/)

    //       for (const item of stringArray) {
    //           if (item.startsWith('gain:')) {
    //               let val = item.substring(5)
    //               return Number(val)
    //           }
    //       }
    //   }
    // return 0;
    // }

    function LogToNum(input) {
        if (typeof input === 'number' && !isNaN(input)) {
            return input;
        }
        return 0;
    }

    return (
        <div className="App container">

            <h2>
                RNG Output: {rngNumber}
            </h2>
            <div className="row">
                <svg width="100%" height="600 px"
                className="border border-primary round p-2"></svg>

            </div>
        
        </div>
    )

}