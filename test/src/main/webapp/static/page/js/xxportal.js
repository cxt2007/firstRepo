/*
 *  Document   : compCharts.js
 *  Author     : pixelcave
 *  Description: Custom javascript code used in Charts page
 */

var xxportal = function() {

    return {
        init: function(monthData,stuNum,payNumGroupByMonth,payLogGroupByMonth) {
        	
        	/* Mini Bar/Line Charts with jquery.sparkline plugin, for more examples you can check out http://omnipotent.net/jquery.sparkline/#s-about */
            var miniChartBarOptions = {
                type: 'bar',
                barWidth: 6,
                barSpacing: 5,
                height: '50px',
                tooltipOffsetX: -25,
                tooltipOffsetY: 20,
                barColor: '#9b59b6',
                tooltipPrefix: '',
                tooltipSuffix: ' Projects',
                tooltipFormat: '{{prefix}}{{value}}{{suffix}}'
            };
            $('#mini-chart-bar1').sparkline('html', miniChartBarOptions);

            miniChartBarOptions['barColor'] = '#2ecc71';
            miniChartBarOptions['tooltipPrefix'] = '个';
            miniChartBarOptions['tooltipSuffix'] = '';
            $('#mini-chart-bar2').sparkline('html', miniChartBarOptions);

            miniChartBarOptions['barColor'] = '#1bbae1';
            miniChartBarOptions['tooltipPrefix'] = '';
            miniChartBarOptions['tooltipSuffix'] = ' Updates';
            $('#mini-chart-bar3').sparkline('html', miniChartBarOptions);

            var miniChartLineOptions = {
                type: 'line',
                width: '80px',
                height: '50px',
                tooltipOffsetX: -25,
                tooltipOffsetY: 20,
                lineColor: '#c0392b',
                fillColor: '#e74c3c',
                spotColor: '#555555',
                minSpotColor: '#555555',
                maxSpotColor: '#555555',
                highlightSpotColor: '#555555',
                highlightLineColor: '#555555',
                spotRadius: 3,
                tooltipPrefix: '',
                tooltipSuffix: ' Projects',
                tooltipFormat: '{{prefix}}{{y}}{{suffix}}'
            };
            $('#mini-chart-line1').sparkline('html', miniChartLineOptions);

            miniChartLineOptions['lineColor'] = '#16a085';
            miniChartLineOptions['fillColor'] = '#1abc9c';
            miniChartLineOptions['tooltipPrefix'] = '个';
            miniChartLineOptions['tooltipSuffix'] = '';
            $('#mini-chart-line2').sparkline('html', miniChartLineOptions);

            miniChartLineOptions['lineColor'] = '#7f8c8d';
            miniChartLineOptions['fillColor'] = '#95a5a6';
            miniChartLineOptions['tooltipPrefix'] = '';
            miniChartLineOptions['tooltipSuffix'] = ' Updates';
            $('#mini-chart-line3').sparkline('html', miniChartLineOptions);

           

            /*
             * Flot 0.8.2 Jquery plugin is used for charts
             *
             * For more examples or getting extra plugins you can check http://www.flotcharts.org/
             * Plugins included in this template: pie, resize, stack, time
             */

            // Get the elements where we will attach the charts
            var chartClassic = $('#chart-classic');
            var chartStacked = $ ('#chart-stacked');

            // Random data for the charts
            var dataEarnings=eval(stuNum);
            var dataSales = eval(payNumGroupByMonth);

            // Array with month labels used in Classic and Stacked chart
            var chartMonths=eval(monthData);
            // Classic Chart
            $.plot(chartClassic,
                [
                    {
                        label: '在校学生数',
                        data: dataEarnings,
                        lines: {show: true, fill: true, fillColor: {colors: [{opacity: 0.25}, {opacity: 0.25}]}},
                        points: {show: true, radius: 6}
                    },
                    {
                        label: '缴费人数',
                        data: dataSales,
                        lines: {show: true, fill: true, fillColor: {colors: [{opacity: 0.15}, {opacity: 0.15}]}},
                        points: {show: true, radius: 6}
                    }
                ],
                {
                    colors: ['#3498db', '#333333'],
                    legend: {show: true, position: 'nw', margin: [15, 10]},
                    grid: {borderWidth: 0, hoverable: true, clickable: true},
                    yaxis: {ticks: 4, tickColor: '#eeeeee'},
                    xaxis: {ticks: chartMonths, tickColor: '#ffffff'}
                }
            );
           
            // Creating and attaching a tooltip to the classic chart
            var previousPoint = null, ttlabel = null;
            chartClassic.bind('plothover', function(event, pos, item) {

                if (item) {
                    if (previousPoint !== item.dataIndex) {
                        previousPoint = item.dataIndex;

                        $('#chart-tooltip').remove();
                        var x = item.datapoint[0], y = item.datapoint[1];

                        if (item.seriesIndex === 1) {
                            ttlabel = '<strong>' + y + '</strong> sales';
                        } else {
                            ttlabel = '$ <strong>' + y + '</strong>';
                        }

                        $('<div id="chart-tooltip" class="chart-tooltip">' + ttlabel + '</div>')
                            .css({top: item.pageY - 45, left: item.pageX + 5}).appendTo("body").show();
                    }
                }
                else {
                    $('#chart-tooltip').remove();
                    previousPoint = null;
                }
            });
           
            // Stacked Chart, {label: '经营总收入', data: dataEarnings}
            $.plot(chartStacked,
                [{label: '经营总收入(单位:元)', data: eval(payLogGroupByMonth)}],
                {
                    colors: ['#f39c12'],
                    series: {stack: true, lines: {show: false, fill: true,steps: false}},
                    //lines: {show: true, lineWidth: 0, fill: true, fillColor: {colors: [{opacity: 0.75}, {opacity: 0.75}]}},
					bars: {
						show: true,
						barWidth: 0.6
					},
                    legend: {show: true, position: 'nw', margin: [15, 10], sorted: true},
                    grid: {borderWidth: 0},
                    yaxis: {ticks: 4, tickColor: '#eeeeee'},
                   xaxis: {ticks: chartMonths, tickColor: '#ffffff'}
                }
            );
            var stack = 0,
			bars = true,
			lines = false,
			steps = false;
//            $.plot("#placeholder", [ d1, d2, d3 ], {
//				series: {
//					stack: stack,
//					lines: {
//						show: lines,
//						fill: true,
//						steps: steps
//					},
//					bars: {
//						show: bars,
//						barWidth: 0.6
//					}
//				}
//			});
           
          
        }
    };
}();


function getDlsportalData(ctx){
	var url=ctx+"/index/portalData";
	$.get(url,
	     	function(datas){
			var data =eval('('+datas+')');
			
			$("#orgNum").html(data.orgNum);
			$("#stuNum").html(data.stuNum);
			$("#stuBindingNum").html(data.stuBindingNum);
			$("#yjfStuNum").html(data.yjfStuNum);
			
	   		return false;
	    });
}