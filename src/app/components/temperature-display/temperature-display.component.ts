import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { select, arc } from 'd3';
import * as d3 from 'd3';

interface GaugeConfiguration {
  minAngle: number;
  maxAngle: any;
  size: number;
  clipWidth: number;
  clipHeight: number;
  ringInset: number;
  ringWidth: number;
  pointerWidth: number;
  pointerTailLength: number;
  pointerHeadLengthPercent: number;
  minValue: number;
  maxValue: number;
  transitionMs: number;
  majorTicks: number;
  arcColorFn: (t: number) => string;
  labelFormat: any;
  labelInset: any;
}

@Component({
  selector: 'app-temperature-display',
  templateUrl: './temperature-display.component.html',
  styleUrls: ['./temperature-display.component.css']
})
export class TemperatureDisplayComponent implements OnInit, OnChanges {
  

  @Input() minTemperature!: number;
  @Input() maxTemperature!: number;
  @Input() targetTemperature!: number;

  @Input()
  isFormValid!: boolean;


  gaugemap: any = {};

  constructor() { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['isFormValid']?.currentValue) {
      this.draw();
    }
  }

  draw() {
    const self = this;

    const gauge = function (container: string, configuration: GaugeConfiguration) {
      const config: GaugeConfiguration = {
        size: 710,
        clipWidth: 200,
        clipHeight: 110,
        ringInset: 20,
        ringWidth: 20,
        pointerWidth: 10,
        pointerTailLength: 5,
        pointerHeadLengthPercent: 0.9,
        minValue: 0,
        maxValue: 100,
        minAngle: -90,
        maxAngle: 90,
        transitionMs: 750,
        majorTicks: 5,
        labelFormat: d3.format('d'),
        labelInset: 10,
        arcColorFn: d3.interpolateHsl(d3.rgb('#e8e2ca'), d3.rgb('#3e6c0a'))
      };

      let range: number;
      let r: number;
      let pointerHeadLength: number;
      let value = 0;

      let svg: any;
      let arc: any;
      let scale: any;
      let ticks: any;
      let tickData: any;
      let pointer: any;

      const donut = d3.pie();

      function deg2rad(deg: number) {
        return deg * Math.PI / 180;
      }

      function newAngle(d: any) {
        const ratio = scale(d);
        const newAngle = config.minAngle + (ratio * range);
        return newAngle;
      }

      function configure(configuration: Partial<GaugeConfiguration>) {
        Object.assign(config, configuration);

        range = config.maxAngle - config.minAngle;
        r = config.size / 2;
        pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);

        scale = d3.scaleLinear()
          .range([0, 1])
          .domain([config.minValue, config.maxValue]);

        ticks = scale.ticks(config.majorTicks);
        tickData = d3.range(config.majorTicks).map(() => 1 / config.majorTicks);


        arc = d3.arc()
          .innerRadius(r - config.ringWidth - config.ringInset)
          .outerRadius(r - config.ringInset)
          .startAngle(function (d: any, i: number) {
            var ratio = d * i;
            return deg2rad(config.minAngle + (ratio * range));
          })
          .endAngle(function (d: any, i: number) {
            var ratio = d * (i + 1);
            return deg2rad(config.minAngle + (ratio * range));
          });
      }
      self.gaugemap.configure = configure;

      function centerTranslation() {
        return 'translate(' + r + ',' + r + ')';
      }

      function isRendered() {
        return (svg !== undefined);
      }
      self.gaugemap.isRendered = isRendered;

      function render(newValue: undefined) {
        svg = d3.select(container)
          .append('svg:svg')
          .attr('class', 'gauge')
          .attr('width', config.clipWidth)
          .attr('height', config.clipHeight);

        var centerTx = centerTranslation();

        var arcs = svg.append('g')
          .attr('class', 'arc')
          .attr('transform', centerTx);

        arcs.selectAll('path')
          .data(tickData)
          .enter().append('path')
          .attr('fill', function (d: number, i: number) {
            return config.arcColorFn(d * i);
          })
          .attr('d', arc);

        var lg = svg.append('g')
          .attr('class', 'label')
          .attr('transform', centerTx);
        lg.selectAll('text')
          .data(ticks)
          .enter().append('text')
          .attr('transform', function (d: any) {
            var ratio = scale(d);
            var newAngle = config.minAngle + (ratio * range);
            return 'rotate(' + newAngle + ') translate(0,' + (config.labelInset - r) + ')';
          })
          .text(config.labelFormat);

        var lineData = [[config.pointerWidth / 2, 0],
        [0, -pointerHeadLength],
        [-(config.pointerWidth / 2), 0],
        [0, config.pointerTailLength],
        [config.pointerWidth / 2, 0]];
        var pointerLine = d3.line().curve(d3.curveLinear)
        var pg = svg.append('g').data([lineData])
          .attr('class', 'pointer')
          .attr('transform', centerTx);

        pointer = pg.append('path')
          .attr('d', pointerLine/*function(d) { return pointerLine(d) +'Z';}*/)
          .attr('transform', 'rotate(' + config.minAngle + ')');

        update(newValue === undefined ? 0 : newValue);
      }
      self.gaugemap.render = render;
      function update(newValue: any, newConfiguration?: undefined) {
        if (newConfiguration !== undefined) {
          configure(newConfiguration);
        }
        var ratio = scale(newValue);
        var newAngle = config.minAngle + (ratio * range);
        pointer.transition()
          .duration(config.transitionMs)
          .ease(d3.easeElastic)
          .attr('transform', 'rotate(' + newAngle + ')');
      }
      self.gaugemap.update = update;
      configure(configuration);
      return self.gaugemap;
    };

    const powerGauge = gauge('#power-gauge', {
      size: 300,
      clipWidth: 300,
      clipHeight: 200,
      ringInset: 20,
      ringWidth: 20,
      pointerWidth: 10,
      pointerTailLength: 5,
      pointerHeadLengthPercent: 0.9,
      minValue: this.minTemperature,
      maxValue: this.maxTemperature,
      transitionMs: 4000,
      majorTicks: 5,
      labelFormat: d3.format('d'),
      labelInset: 10,
      arcColorFn: d3.interpolateHsl(d3.rgb('#5cbaf0'), d3.rgb('#8c1a1a')),
      minAngle: -90,
      maxAngle: 90
    });

    powerGauge.render(this.targetTemperature);


  }


}