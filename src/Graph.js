import React from "react";

export default class Graph extends React.Component {
    /** @type {HTMLCanvasElement} */
    ref;

    componentDidMount () {
        this.doImperitiveStuff();
    }

    componentDidUpdate () {
        this.doImperitiveStuff();
    }

    doImperitiveStuff () {
        if (this.ref) {
            const ctx = this.ref.getContext("2d");

            const {
                evaluator,
                xMin, xMax, yMin, yMax,
                width, height,
                gridlines,
            } = this.props;

            ctx.clearRect(0, 0, width, height);

            const yRange = yMax - yMin;
            const xRange = xMax - xMin;
            const xScale = width / xRange;
            const yScale = height / yRange;
            const step = 0.1;

            if (gridlines) {
                ctx.beginPath();
                ctx.moveTo(0, yMax * yScale);
                ctx.lineTo(width, yMax * yScale);
                ctx.moveTo(-xMin * xScale, 0);
                ctx.lineTo(-xMin * xScale, height);
                ctx.strokeStyle = "#666";
                ctx.stroke();
            }

            
            let y = evaluator(xMin);

            ctx.beginPath();
            ctx.moveTo(0, (yMax - y) * yScale);

            for (let x = xMin; x < xMax; x += step) {
                ctx.lineTo((x - xMin) * xScale, (yMax - evaluator(x)) * yScale);
            }

            ctx.strokeStyle = "#000";
            ctx.stroke();
        }
    }

    render () {
        return <canvas ref={r => this.ref = r} height={this.props.height} width={this.props.width} />
    }
}

Graph.defaultProps = {
    height: 300,
    width: 300,
    xMin: -5,
    xMax: 5,
    yMin: 0,
    yMax: 100,
    gridlines: true,
};