var temperature = 0, 
	kelembaban = 0,
	arahAngin = 0,
	tekanan = 0;
var pos = {
	x: 0, y: 0, z: 0
}

var param = {
        lintang 	: -6.9147439 , //Bandung
        bujur 		: 107.609809875, //Bandung
        setLintang : function(data){
            this.lintang = parseFloat(data);
        },
        setBujur : function(data){
            this.bujur = parseFloat(data);
        },
        getLintang : function(){
           return this.lintang;
        },
        getBujur : function(){
           return this.bujur  ;
        }
    };
    
var lineCoordinatesArray = [];




var gaugetemp = new LinearGauge({
    renderTo: 'gaugetemp',
    width: 120,
    height: 300,
    units: "°C",
    minValue: 0,
    startAngle: 90,
    ticksAngle: 180,
    valueBox: false,
    maxValue: 220,
    majorTicks: [
        "0",
        "20",
        "40",
        "60",
        "80",
        "100",
        "120",
        "140",
        "160",
        "180",
        "200",
        "220"
    ],
    minorTicks: 2,
    strokeTicks: true,
    highlights: [
        {
            "from": 100,
            "to": 220,
            "color": "rgba(200, 50, 50, .75)"
        }
    ],
    colorPlate: "#fff",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 2,
    needleCircleSize: 7,
    needleCircleOuter: true,
    needleCircleInner: false,
    animationDuration: 1500,
    animationRule: "linear",
    barWidth: 10,
    value: 35
}).draw();

var gaugeArahAngin = new RadialGauge({
	renderTo: 'gaugeArahAngin',
	width : 250,
	height : 250,
	minValue: 0,
	maxValue: 360,
	majorTicks: [
		"N",
		"NE",
		"E",
		"SE",
		"S",
		"SW",
		"W",
		"NW",
		"N"
	],
	minorTicks: 22,
	ticksAngle: 360,
	startAngle: 180,
	strokeTicks: false,
	highlights: false,
	colorPlate: "#333",
	colorMajorTicks: "#f5f5f5",
	colorMinorTicks: "#ddd",
	colorNumbers: "#ccc",
	colorNeedle: "rgba(240, 128, 128, 1)",
	colorNeedleEnd: "rgba(255, 160, 122, .9)",
	valueBox: false,
	valueTextShadow: false,
	colorCircleInner: "#fff",
	colorNeedleCircleOuter: "#ccc",
	needleCircleSize: 15,
	needleCircleOuter: false,
	animationRule: "linear",
	needleType: "line",
	needleStart: 75,
	needleEnd: 99,
	needleWidth: 3,
	borders: true,
	borderInnerWidth: 0,
	borderMiddleWidth: 0,
	borderOuterWidth: 10,
	colorBorderOuter: "#ccc",
	colorBorderOuterEnd: "#ccc",
	colorNeedleShadowDown: "#222",
	borderShadowWidth: 0,
	animationTarget: "plate",
	animationDuration: 1500,
	value: 0,
	animateOnInit: true
}).draw();
gaugeArahAngin.draw();

function update(){
	const socket = io.connect();

	socket.on('socketData', (data)=>{
		// console.log(data);
		const dataHasil = data.datahasil;
		temperature = Math.abs(parseInt(dataHasil[2])) % 220;
		$( "#rawData" ).html(data.dataMentah);
		$( "#head" ).html(dataHasil[0]) ;
		$( "#ketinggian" ).html(dataHasil[1]) ;
		$( "#temperature" ).html(temperature) ;
		$( "#humidity" ).html(dataHasil[3]) ;
		$( "#pressure" ).html(dataHasil[4]) ;
		$( "#latitude" ).html(dataHasil[5]) ;
		$( "#longitude" ).html(dataHasil[6]) ;
		$( "#co2" ).html(dataHasil[7]) ;
		$( "#x" ).html(dataHasil[8]) ;
		$( "#y" ).html(dataHasil[9]) ;
		$( "#z" ).html(dataHasil[10]) ;
		$( "#IMG" ).html(dataHasil[11]) ;

		 kelembaban = parseInt(dataHasil[3]);
		 tekanan = parseInt(dataHasil[4]);
		 param.setLintang(dataHasil[5]);
		 param.setBujur(dataHasil[6]);
		 gaugetemp.value = parseInt(temperature);
		 arahAngin = Math.floor(Math.random() * (360 - 0 + 1)) + 0;; //kasih random karena belum ada fungsi arah angin dari data gps
		 gaugeArahAngin.value = arahAngin;

		 //redraw maps
		//  redraw(param.getLintang(), param.getBujur());
	});
}

// Grafik
$(function() {
    Highcharts.setOptions({
	    global: {
	        useUTC: false
	    }
	});

	Highcharts.chart('grafikTemperature', {
	    chart: {
	        type: 'spline',
	        animation: Highcharts.svg, // don't animate in old IE
	        marginRight: 10,
	        events: {
	            load: function () {

	                // set up the updating of the chart each second
	                var series = this.series[0];
	                setInterval(function () {
	                    var x = (new Date()).getTime(), // current time
	                        y = temperature;
	                    series.addPoint([x, y], true, false);
	                }, 1000);
	            }
	        }
	    },
	    title: {
	        text: 'Grafik Temperatur'
	    },
	    xAxis: {
	        type: 'datetime',
	        tickPixelInterval: 150
	    },
	    yAxis: {
	        title: {
	            text: 'suhu (°C)'
	        },
	        plotLines: [{
	            value: 0,
	            width: 1,
	            color: '#808080'
	        }]
	    },
	    tooltip: {
	        formatter: function () {
	            return '<b>' + this.series.name + '</b><br/>' +
	                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
	                Highcharts.numberFormat(this.y, 2);
	        }
	    },
	    legend: {
	        enabled: false
	    },
	    exporting: {
	        enabled: false
	    },
	    series: [{
	        name: 'temperature data',
	        data: (function () {
	            // generate an array of random data
	            var data = [],
	                time = (new Date()).getTime(),
	                i;

	            for (i = -19; i <= 0; i += 1) {
	                data.push({
	                    x: time + i * 1000,
	                    y: temperature
	                });
	            }
	            return data;
	        }())
	    }]
	});

	Highcharts.chart('grafikKelembaban', {
	    chart: {
	        type: 'spline',
	        animation: Highcharts.svg, // don't animate in old IE
	        marginRight: 10,
	        events: {
	            load: function () {

	                // set up the updating of the chart each second
	                var series = this.series[0];
	                setInterval(function () {
	                    var x = (new Date()).getTime(), // current time
	                        y = kelembaban;
	                    series.addPoint([x, y], true, true);
	                }, 1000);
	            }
	        }
	    },
	    title: {
	        text: 'Grafik Kelembaban'
	    },
	    xAxis: {
	        type: 'datetime',
	        tickPixelInterval: 150
	    },
	    yAxis: {
	        title: {
	            text: 'kelembaban'
	        },
	        plotLines: [{
	            value: 0,
	            width: 1,
	            color: '#808080'
	        }]
	    },
	    tooltip: {
	        formatter: function () {
	            return '<b>' + this.series.name + '</b><br/>' +
	                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
	                Highcharts.numberFormat(this.y, 2);
	        }
	    },
	    legend: {
	        enabled: false
	    },
	    exporting: {
	        enabled: false
	    },
	    series: [{
	        name: 'moisture data',
	        data: (function () {
	            // generate an array of random data
	            var data = [],
	                time = (new Date()).getTime(),
	                i;

	            for (i = -19; i <= 0; i += 1) {
	                data.push({
	                    x: time + i * 1000,
	                    y: kelembaban
	                });
	            }
	            return data;
	        }())
	    }]
	});

	Highcharts.chart('grafikTekanan', {
	    chart: {
	        type: 'spline',
	        animation: Highcharts.svg, // don't animate in old IE
	        marginRight: 10,
	        events: {
	            load: function () {

	                // set up the updating of the chart each second
	                var series = this.series[0];
	                setInterval(function () {
	                    var x = (new Date()).getTime(), // current time
	                        y = tekanan;
	                    series.addPoint([x, y], true, true);
	                }, 1000);
	            }
	        }
	    },
	    title: {
	        text: 'Grafik Tekanan'
	    },
	    xAxis: {
	        type: 'datetime',
	        tickPixelInterval: 150
	    },
	    yAxis: {
	        title: {
	            text: 'tekanan (Pa)'
	        },
	        plotLines: [{
	            value: 0,
	            width: 1,
	            color: '#808080'
	        }]
	    },
	    tooltip: {
	        formatter: function () {
	            return '<b>' + this.series.name + '</b><br/>' +
	                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
	                Highcharts.numberFormat(this.y, 2);
	        }
	    },
	    legend: {
	        enabled: false
	    },
	    exporting: {
	        enabled: false
	    },
	    series: [{
	        name: 'pressure data',
	        data: (function () {
	            // generate an array of random data
	            var data = [],
	                time = (new Date()).getTime(),
	                i;

	            for (i = -19; i <= 0; i += 1) {
	                data.push({
	                    x: time + i * 1000,
	                    y: tekanan
	                });
	            }
	            return data;
	        }())
	    }]
	});

	Highcharts.chart('grafikPosisi', {
		chart: {
	        type: 'spline',
	        animation: Highcharts.svg, // don't animate in old IE
	        marginRight: 10,
	        events: {
	            load: function () {

	                // set up the updating of the chart each second
	                var series = this.series[0];
	                setInterval(function () {
	                    var x = (new Date()).getTime(), // current time
	                        y = pos.x;
	                    series.addPoint([x, y], true, true);
	                }, 1000);
	            }
	        }
	    },
		title: {
			text: 'Grafik Posisi'
		},
	
		subtitle: {
			text: 'Posisi dalam R3'
		},
		xAxis: {
	        type: 'datetime',
	        tickPixelInterval: 150
	    },
		yAxis: {
			title: {
				text: 'meter (m)'
			}
		},
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'middle'
		},
	
		plotOptions: {
			series: {
				label: {
					connectorAllowed: false
				},
				pointStart: 0
			}
		},
	
		series: [{
			name: 'pos-x',
			data: (function () {
	            // generate an array of random data
	            var data = [],
	                time = (new Date()).getTime(),
	                i;

	            for (i = -19; i <= 0; i += 1) {
	                data.push({
	                    x: time + i * 1000,
	                    y: tekanan
	                });
	            }
	            return data;
	        }())
		}, {
			name: 'pos-y',
			data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
		}, {
			name: 'pos-z',
			data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
		}],
	
		responsive: {
			rules: [{
				condition: {
					maxWidth: 500
				},
				chartOptions: {
					legend: {
						layout: 'horizontal',
						align: 'center',
						verticalAlign: 'bottom'
					}
				}
			}]
		}
	
	});


	//Make map
        // map = new google.maps.Map(document.getElementById('coordinate'), {
        //   zoom: 17,
        //   center: {lat: param.getLintang(), lng : param.getBujur(), alt: 0}
        // });

        // //make marker
        // map_marker = new google.maps.Marker({position: {lat: param.getLintang(), lng: param.getBujur()}, map: map});
        // map_marker.setMap(map);
     
       
}); // end jquery




// function redraw(Lintang, Bujur) {
// 	map.setCenter({lat: Lintang, lng : Bujur, alt: 0}); // biar map ketengah
// 	map_marker.setPosition({lat: Lintang, lng : Bujur, alt: 0}); // biar map ketengah

// 	pushCoordToArray(Lintang, Bujur); //masukin nilai lintan dan bujur ke array coordinates

// 	var lineCoordinatesPath = new google.maps.Polyline({
// 		path: lineCoordinatesArray,
// 		geodesic: true,
// 		strokeColor: '#ffeb3b',
// 		strokeOpacity: 1.0,
// 		strokeWeight: 2
// 	});

// 	lineCoordinatesPath.setMap(map); 
// }

// function pushCoordToArray(latIn, lngIn) {
// 	lineCoordinatesArray.push(new google.maps.LatLng(latIn, lngIn));
// }

       