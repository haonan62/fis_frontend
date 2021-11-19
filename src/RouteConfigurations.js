
// This file stores the static route configurations
// Data is extracted from the baltic exchange

//C5 route configs, will add more points for finer lines
const westAusPortCoordinates = [-20.293113447544098, 118.57543945312501];
const qingdaoPortCoordinates = [36.060201412392914, 120.36895751953126];
const midPointC5 = [(westAusPortCoordinates[0] + qingdaoPortCoordinates[0]) / 2, (westAusPortCoordinates[1] + qingdaoPortCoordinates[1]) / 2];
const polylineC5 = [
    westAusPortCoordinates,
    [-20.313720903877954, 118.58642578124999], [-7.18810087117902, 123.22265625000001], [6.839169626342808, 130.517578125], [19.80805412808859, 132.1875], [36.09349937380574, 120.355224609375],
    qingdaoPortCoordinates,
];
const c5Color = { color: 'blue' };
const c5ZoomLevel = 3;
const c5Config = { polyline: polylineC5, center: midPointC5, color: c5Color, zoomLevel: c5ZoomLevel };

//C2 route configs
const tubaraoPortCoordinates = [-20.291342366330333, -40.23116111755371];
const rotterdamPortCoordinates = [51.92055564515695, 4.05120849609375];
const midPointC2 = [(tubaraoPortCoordinates[0] + rotterdamPortCoordinates[0]) / 2, (tubaraoPortCoordinates[1] + rotterdamPortCoordinates[1]) / 2];
const polylineC2 = [
    tubaraoPortCoordinates,
    [-24.686952411999144, -31.640625], [20.385825381874263, -30.761718749999996], [44.5278427984555, -27.158203125], [51.781435604431195, 4.4384765625],
    rotterdamPortCoordinates,
];
const c2Color = { color: 'blue' };
const c2ZoomLevel = 3;
const c2Config = { polyline: polylineC2, center: midPointC2, color: c2Color, zoomLevel: c2ZoomLevel };

//C3 route configs
const midPointC3 = [(tubaraoPortCoordinates[0] + qingdaoPortCoordinates[0]) / 2, (tubaraoPortCoordinates[1] + qingdaoPortCoordinates[1]) / 2];
const polylineC3 = [
    tubaraoPortCoordinates,
    [-28.509729126769038, -48.76556396484375], [-37.71859032558814, 22.5], [-17.14079039331664, 82.44140625], [9.275622176792112, 94.5703125], [-1.4061088354351594, 105.64453124999999], [9.188870084473406, 110.0390625], [27.68352808378776, 128.49609375], [36.146746777814364, 120.14648437499999],
    qingdaoPortCoordinates,
];
const c3Color = { color: 'blue' };
const c3ZoomLevel = 2;
const c3Config = { polyline: polylineC3, center: midPointC3, color: c3Color, zoomLevel: c3ZoomLevel };

//C7
const bolivarPortCoordinates = [-4.653079918274038, -81.2548828125];
const midPointC7 = [(bolivarPortCoordinates[0] + rotterdamPortCoordinates[0]) / 2, (bolivarPortCoordinates[1] + rotterdamPortCoordinates[1]) / 2];
const polylineC7 = [
    // bolivarPortCoordinates,
    [11.953349393643416, -71.806640625], [43.83452678223682, -22.939453125], [51.6180165487737, 3.955078125],
    rotterdamPortCoordinates,
];
const c7Color = { color: 'blue' };
const c7ZoomLevel = 3;
const c7Config = { polyline: polylineC7, center: midPointC7, color: c7Color, zoomLevel: c7ZoomLevel };



const mockC2IndicatorImpact = {
    data :[{
        type: 'scatterpolar',
        r: [0.7, 0.2, 0.3, 0.6, 0.1, 0.2],
        theta: ['Iron Ore Price', 'Pig Iron Production', 'Steel Stock', 'Australia Loadings', 'Far East_laden', 'Far East_ballast'],
        fill: 'toself'
    }],
    layout : {
        polar: {
            radialaxis: {
                visible: true,
                range: [0, 1]
            }
        },
        showlegend: false,
        width: 300, 
        height: 300
    }
}
const mockC3IndicatorImpact = {
    data :[{
        type: 'scatterpolar',
        r: [ 0.3, 0.6, 0.1, 0.2,0.7, 0.2],
        theta: ['Iron Ore Price', 'Pig Iron Production', 'Steel Stock', 'Australia Loadings', 'Far East_laden', 'Far East_ballast'],
        fill: 'toself'
    }],
    layout : {
        polar: {
            radialaxis: {
                visible: true,
                range: [0, 1]
            }
        },
        showlegend: false,
        width: 300, 
        height: 300
    }
}
const mockC5IndicatorImpact = {
    data :[{
        type: 'scatterpolar',
        r: [ 0.3,0.7, 0.2,0.6, 0.1, 0.2],
        theta: ['Iron Ore Price', 'Pig Iron Production', 'Steel Stock', 'Australia Loadings', 'Far East_laden', 'Far East_ballast'],
        fill: 'toself'
    }],
    layout : {
        polar: {
            radialaxis: {
                visible: true,
                range: [0, 1]
            }
        },
        showlegend: false,
        width: 300, 
        height: 300
    }
}
const mockC7IndicatorImpact = {
    data :[{
        type: 'scatterpolar',
        r: [ 0.6, 0.1, 0.2,0.3,0.7, 0.2],
        theta: ['Iron Ore Price', 'Pig Iron Production', 'Steel Stock', 'Australia Loadings', 'Far East_laden', 'Far East_ballast'],
        fill: 'toself'
    }],
    layout : {
        polar: {
            radialaxis: {
                visible: true,
                range: [0, 1]
            }
        },
        showlegend: false,
        width: 300, 
        height: 300
    }
}



// configurations to be exported
const RouteConfigurations = {
    "C2": c2Config,
    "C3": c3Config,
    "C5": c5Config,
    "C7": c7Config,

};



// temp configuration to simulate the indicator impacts

const tempIndicatorImpact={
    'C2':mockC2IndicatorImpact,
    'C3':mockC3IndicatorImpact,
    'C5':mockC5IndicatorImpact,
    'C7':mockC7IndicatorImpact,
};


const tempDemandSupply={
    "2021-01-23":{'Australia Loadings_normalised': 0.502041901134327,
    'Iron Ore China Import Port Stock_normalised': 0.4240762384248855,
    'C5_normalised': 0.6305730960581707},
    "2021-01-09":{'Australia Loadings_normalised': 0.7977085671369494,
    'Iron Ore China Import Port Stock_normalised': 0.3984536545895893,
    'C5_normalised': 0.7151262916188288}
}

const tempDates=[
    "2021-01-23",
    "2021-01-16",
    "2021-01-09",
    "2021-01-02",
    "2020-12-26",
    "2020-12-19",
    "2020-12-12",
    "2020-12-05",
    "2020-11-28",
    "2020-11-21",
    "2020-11-14",
    "2020-11-07",
    "2020-10-31",
    "2020-10-24",
    "2020-10-17",
    "2020-10-10",
    "2020-10-03",
    "2020-09-26",
    "2020-09-19",
    "2020-09-12",
    "2020-09-05",
    "2020-08-29",
    "2020-08-22",
    "2020-08-15",
    "2020-08-08",
    "2020-08-01",
    "2020-07-25",
    "2020-07-18",
    "2020-07-11",
    "2020-07-04",
    "2020-06-27",
    "2020-06-20",
    "2020-06-13",
    "2020-06-06",
    "2020-05-30",
    "2020-05-23",
    "2020-05-16",
    "2020-05-09",
    "2020-05-02",
    "2020-04-25",
    "2020-04-18",
    "2020-04-11",
    "2020-04-04",
    "2020-03-28",
    "2020-03-21",
    "2020-03-14",
    "2020-03-07",
    "2020-02-29",
    "2020-02-22",
    "2020-02-15",
    "2020-02-08",
    "2020-02-01",
    "2020-01-25",
    "2020-01-18",
    "2020-01-11",
    "2020-01-04",
    "2019-12-28",
    "2019-12-21",
    "2019-12-14",
    "2019-12-07",
    "2019-11-30",
    "2019-11-23",
    "2019-11-16",
    "2019-11-09",
    "2019-11-02",
    "2019-10-26",
    "2019-10-19",
    "2019-10-12",
    "2019-10-05",
    "2019-09-28",
    "2019-09-21",
    "2019-09-14",
    "2019-09-07",
    "2019-08-31",
    "2019-08-24",
    "2019-08-17",
    "2019-08-10",
    "2019-08-03",
    "2019-07-27",
    "2019-07-20",
    "2019-07-13",
    "2019-07-06",
    "2019-06-29",
    "2019-06-22",
    "2019-06-15",
    "2019-06-08",
    "2019-06-01",
    "2019-05-25",
    "2019-05-18",
    "2019-05-11",
    "2019-05-04",
    "2019-04-27",
    "2019-04-20",
    "2019-04-13",
    "2019-04-06",
    "2019-03-30",
    "2019-03-23",
    "2019-03-16",
    "2019-03-09",
    "2019-03-02",
    "2019-02-23",
    "2019-02-16",
    "2019-02-09",
    "2019-02-02",
    "2019-01-26",
    "2019-01-19",
    "2019-01-12",
    "2019-01-05",
    "2018-12-29",
    "2018-12-22",
    "2018-12-15",
    "2018-12-08",
    "2018-12-01",
    "2018-11-24",
    "2018-11-17",
    "2018-11-10",
    "2018-11-03",
    "2018-10-27",
    "2018-10-20",
    "2018-10-13",
    "2018-10-06",
    "2018-09-29",
    "2018-09-22",
    "2018-09-15",
    "2018-09-08",
    "2018-09-01",
    "2018-08-25",
    "2018-08-18",
    "2018-08-11",
    "2018-08-04",
    "2018-07-28",
    "2018-07-21",
    "2018-07-14",
    "2018-07-07",
    "2018-06-30",
    "2018-06-23",
    "2018-06-16",
    "2018-06-09",
    "2018-06-02",
    "2018-05-26",
    "2018-05-19",
    "2018-05-12",
    "2018-05-05",
    "2018-04-28",
    "2018-04-21",
    "2018-04-14",
    "2018-04-07",
    "2018-03-31",
    "2018-03-24",
    "2018-03-17",
    "2018-03-10",
    "2018-03-03",
    "2018-02-24",
    "2018-02-17",
    "2018-02-10",
    "2018-02-03",
    "2018-01-27",
    "2018-01-20",
    "2018-01-13",
    "2018-01-06",
    "2017-12-30",
    "2017-12-23",
    "2017-12-16",
    "2017-12-09",
    "2017-12-02",
    "2017-11-25",
    "2017-11-18",
    "2017-11-11",
    "2017-11-04",
    "2017-10-28",
    "2017-10-21",
    "2017-10-14",
    "2017-10-07",
    "2017-09-30",
    "2017-09-23",
    "2017-09-16",
    "2017-09-09",
    "2017-09-02",
    "2017-08-26",
    "2017-08-19",
    "2017-08-12",
    "2017-08-05",
    "2017-07-29",
    "2017-07-22",
    "2017-07-15",
    "2017-07-08",
    "2017-07-01",
    "2017-06-24",
    "2017-06-17",
    "2017-06-10",
    "2017-06-03",
    "2017-05-27",
    "2017-05-20",
    "2017-05-13",
    "2017-05-06",
    "2017-04-29",
    "2017-04-22",
    "2017-04-15",
    "2017-04-08",
    "2017-04-01",
    "2017-03-25",
    "2017-03-18",
    "2017-03-11",
    "2017-03-04",
    "2017-02-25",
    "2017-02-18",
    "2017-02-11",
    "2017-02-04",
    "2017-01-28",
    "2017-01-21",
    "2017-01-14",
    "2017-01-07",
    "2016-12-31",
    "2016-12-24",
    "2016-12-17",
    "2016-12-10",
    "2016-12-03",
    "2016-11-26",
    "2016-11-19",
    "2016-11-12",
    "2016-11-05",
    "2016-10-29",
    "2016-10-22",
    "2016-10-15",
    "2016-10-08",
    "2016-10-01",
    "2016-09-24",
    "2016-09-17",
    "2016-09-10",
    "2016-09-03",
    "2016-08-27",
    "2016-08-20",
    "2016-08-13",
    "2016-08-06",
    "2016-07-30",
    "2016-07-23",
    "2016-07-16",
    "2016-07-09",
    "2016-07-02",
    "2016-06-25",
    "2016-06-18",
    "2016-06-11",
    "2016-06-04",
    "2016-05-28",
    "2016-05-21",
    "2016-05-14",
    "2016-05-07",
    "2016-04-30",
    "2016-04-23",
    "2016-04-16",
    "2016-04-09",
    "2016-04-02",
    "2016-03-26",
    "2016-03-19",
    "2016-03-12",
    "2016-03-05",
    "2016-02-27",
    "2016-02-20",
    "2016-02-13",
    "2016-02-06",
    "2016-01-30",
    "2016-01-23",
    "2016-01-16",
    "2016-01-09",
    "2016-01-02",
    "2015-12-26",
    "2015-12-19",
    "2015-12-12",
    "2015-12-05",
    "2015-11-28",
    "2015-11-21",
    "2015-11-14",
    "2015-11-07",
    "2015-10-31",
    "2015-10-24",
    "2015-10-17",
    "2015-10-10",
    "2015-10-03",
    "2015-09-26",
    "2015-09-19",
    "2015-09-12",
    "2015-09-05",
    "2015-08-29",
    "2015-08-22",
    "2015-08-15",
    "2015-08-08",
    "2015-08-01",
    "2015-07-25",
    "2015-07-18",
    "2015-07-11",
    "2015-07-04",
    "2015-06-27",
    "2015-06-20",
    "2015-06-13",
    "2015-06-06",
    "2015-05-30",
    "2015-05-23",
    "2015-05-16",
    "2015-05-09",
    "2015-05-02",
    "2015-04-25",
    "2015-04-18",
    "2015-04-11",
    "2015-04-04",
    "2015-03-28",
    "2015-03-21",
    "2015-03-14",
    "2015-03-07",
    "2015-02-28",
    "2015-02-21",
    "2015-02-14",
    "2015-02-07",
    "2015-01-31",
    "2015-01-24",
    "2015-01-17",
    "2015-01-10",
    "2015-01-03"
];

var tempDatesDict={};
var i;
for (i=0;i<tempDates.length;i++){
    tempDatesDict[tempDates.length-i]=tempDates[i];
}




export {RouteConfigurations, tempIndicatorImpact,tempDemandSupply, tempDates,tempDatesDict};