// this file is for demo purposes, to show a company ship is at certain location

const worldCenter=[40.73528, 34.47389]

const singaporeHarbourConfig= [1.264,103.84];

const suezCanelConfig=[30.45499818, 32.3499986];

const capeTownConfig=[-33.918861,18.423300];

const pearlHaborConfig=[21.339884,-157.970901];


const StaticShipCoordinates = {
    "center": worldCenter,
    "zoomLevel":2,
    // keep it as a reminder how desperate i was
    'color':null,
    companyShipCoordinates:[singaporeHarbourConfig,suezCanelConfig,capeTownConfig,pearlHaborConfig],

};


export default StaticShipCoordinates;