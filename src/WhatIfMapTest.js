import { Map, TileLayer, Marker, Popup, Polyline, CircleMarker, Tooltip, Polygon } from 'react-leaflet';
// import ChangeMapView from './ChangeMapView';
import OceanBoundaries from './OceanBoundaries';
import L from "leaflet";
// import { BoatMarker } from "leaflet.boatmarker";
import RotatedMarker from "./RotatedMarker";

import icon from 'leaflet/dist/images/marker-icon.png';
import ballastSvg from "./images/ballast_work.svg";
import ladenSvg from "./images/FVE-image.svg";

const WhatIfMapTest = (props) => {
    const allShipLocationsByDay = props.allShipLocationsByDay;

    const variables = props.variables;
    const midPoint = variables.center;
    const zoomLevel = variables.zoomLevel;

    const tempSliderValue = props.tempSliderValue;
    const lenDays = allShipLocationsByDay.length;
    const sampleDayShipLocs = allShipLocationsByDay[lenDays - tempSliderValue]["daily_vessel_locations"];

    let DefaultIcon = L.icon({
        iconUrl: icon,
        iconSize: [9, 15],
        // shadowUrl: iconShadow
    });

    // let dropLetIcon = L.icon({
    //     iconUrl: dropletSvg,
    //     iconSize: [30, 30],
    // });

    let ballastIcon = L.icon({
        iconUrl: ballastSvg,
        iconSize: [50, 35],
    });
    let ladenIcon = L.icon({
        iconUrl: ladenSvg,
        iconSize: [50, 35],
    });


    L.Marker.prototype.options.icon = DefaultIcon;

    console.log(sampleDayShipLocs);

    return (
        <div className="what-if-map">
            <Map center={midPoint} zoom={zoomLevel} style={{ height: '80vh' }}>
                {/* <ChangeMapView center={midPoint} zoom={zoomLevel} /> */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {/* <RotatedMarker
                    position={testPos}
                    icon={ladenIcon}
                    rotationAngle={50}
                    rotationOrigin="center"
                /> */}

                {/* {sampleDayShipLocs && sampleDayShipLocs.map((curShipDailyLoc) =>
                    <RotatedMarker key={curShipDailyLoc["imo"] + curShipDailyLoc["latitude"].toString() + curShipDailyLoc["longitude"].toString() + "CIRCLE"} rotationOrigin="center" rotationAngle={curShipDailyLoc["heading"]} icon={ballastIcon} position={[curShipDailyLoc["latitude"], curShipDailyLoc["longitude"]]} 
                        radius={0.01} > <Tooltip key={curShipDailyLoc["imo"] + curShipDailyLoc["latitude"].toString() + curShipDailyLoc["longitude"].toString() + "tip"}>imo {curShipDailyLoc["imo"]}</Tooltip> </RotatedMarker>
                )} */}


                {sampleDayShipLocs &&sampleDayShipLocs.filter(curShipSample=>curShipSample.draft<10).map((curShipDailyLoc)=>
                    <RotatedMarker key={curShipDailyLoc["imo"] + curShipDailyLoc["latitude"].toString() + curShipDailyLoc["longitude"].toString() + "CIRCLE"} rotationOrigin="center" rotationAngle={curShipDailyLoc["heading"]} icon={ballastIcon} position={[curShipDailyLoc["latitude"], curShipDailyLoc["longitude"]]} 
                    radius={0.01} > <Tooltip key={curShipDailyLoc["imo"] + curShipDailyLoc["latitude"].toString() + curShipDailyLoc["longitude"].toString() + "tip"}>imo {curShipDailyLoc["imo"]}</Tooltip> </RotatedMarker>
                )}

{sampleDayShipLocs &&sampleDayShipLocs.filter(curShipSample=>curShipSample.draft>10).map((curShipDailyLoc)=>
                    <RotatedMarker key={curShipDailyLoc["imo"] + curShipDailyLoc["latitude"].toString() + curShipDailyLoc["longitude"].toString() + "CIRCLE"} rotationOrigin="center" rotationAngle={curShipDailyLoc["heading"]} icon={ladenIcon} position={[curShipDailyLoc["latitude"], curShipDailyLoc["longitude"]]} 
                    radius={0.01} > <Tooltip key={curShipDailyLoc["imo"] + curShipDailyLoc["latitude"].toString() + curShipDailyLoc["longitude"].toString() + "tip"}>imo {curShipDailyLoc["imo"]}</Tooltip> </RotatedMarker>
                )}

                {/* {sampleDayShipLocs && sampleDayShipLocs.map((curShipDailyLoc) =>
                    {curShipDailyLoc["draft"]>10 &&
                    <RotatedMarker key={curShipDailyLoc["imo"] + curShipDailyLoc["latitude"].toString() + curShipDailyLoc["longitude"].toString() + "CIRCLE"} rotationOrigin="center" rotationAngle={curShipDailyLoc["heading"]} icon={ladenIcon} position={[curShipDailyLoc["latitude"], curShipDailyLoc["longitude"]]}
                    radius={0.01} > <Tooltip key={curShipDailyLoc["imo"] + curShipDailyLoc["latitude"].toString() + curShipDailyLoc["longitude"].toString() + "tip"}>imo {curShipDailyLoc["imo"]}</Tooltip> </RotatedMarker>
                }
                   
                )} */}




                <Polygon pathOptions={{ color: 'grey' }} positions={OceanBoundaries['NorthAtlantic']} weight={0.5} opacity={0.2}><Tooltip>North Atlantic</Tooltip></Polygon>
                <Polygon pathOptions={{ color: 'grey' }} positions={OceanBoundaries['IndianOcean']} weight={0.5} opacity={0.2}><Tooltip>Indian Ocean</Tooltip></Polygon>
                <Polygon pathOptions={{ color: 'grey' }} positions={OceanBoundaries['FarEast']} weight={0.5} opacity={0.2}><Tooltip>Far East</Tooltip></Polygon>
                <Polygon pathOptions={{ color: 'grey' }} positions={OceanBoundaries['SouthEastAsia']} weight={0.5} opacity={0.2} stroke-dasharray={"4 1 2"}><Tooltip>South East Asia </Tooltip></Polygon>

            </Map>
        </div>
    );
}

export default WhatIfMapTest;