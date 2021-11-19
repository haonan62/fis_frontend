import { Map, TileLayer, Marker, Popup, Polyline, CircleMarker, Tooltip, Polygon } from 'react-leaflet';
// import ChangeMapView from './ChangeMapView';
import L from "leaflet";
import OceanBoundaries from './OceanBoundaries';
import RotatedMarker from "./RotatedMarker";
import ballastSvg from "./images/ballast_work.svg";
import ladenSvg from "./images/FVE-image.svg";



const WhatIfMap = (props) => {
    const allShipLocationsByDay = props.allShipLocationsByDay;

    const variables = props.variables;
    const midPoint = variables.center;
    const zoomLevel = variables.zoomLevel;

    const tempSliderValue=props.tempSliderValue;
    const lenDays=allShipLocationsByDay.length;
    const sampleDayShipLocs = allShipLocationsByDay[lenDays-tempSliderValue]["daily_vessel_locations"];
    let ballastIcon = L.icon({
        iconUrl: ballastSvg,
        iconSize: [30, 21],
    });
    let ladenIcon = L.icon({
        iconUrl: ladenSvg,
        iconSize: [30, 21],
    });

    // console.log(allShipLocationsByDay);
    return (
        <div className="what-if-map">
            <Map center={midPoint} zoom={zoomLevel}  style={{height: '40vh'}}>
                {/* <ChangeMapView center={midPoint} zoom={zoomLevel} /> */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* {sampleDayShipLocs && sampleDayShipLocs.map((curShipDailyLoc)=>
                    <CircleMarker  center={[curShipDailyLoc["latitude"],curShipDailyLoc["longitude"]]} pathOptions={{ color: 'red' }}
                    radius={0.01} > <Tooltip>imo {curShipDailyLoc["imo"]}</Tooltip> </CircleMarker>
                )} */}

                {/* {sampleDayShipLocs && sampleDayShipLocs.map((curShipDailyLoc)=>
                    <CircleMarker key={curShipDailyLoc["imo"]+curShipDailyLoc["latitude"].toString()+curShipDailyLoc["longitude"].toString()+"CIRCLE"} center={[curShipDailyLoc["latitude"],curShipDailyLoc["longitude"]]} pathOptions={{ color: 'red' }}
                    radius={0.01} > <Tooltip key={curShipDailyLoc["imo"]+curShipDailyLoc["latitude"].toString()+curShipDailyLoc["longitude"].toString()+"tip"}>imo {curShipDailyLoc["imo"]}</Tooltip> </CircleMarker>
                )} */}
                {sampleDayShipLocs &&sampleDayShipLocs.filter(curShipSample=>curShipSample.draft<10).map((curShipDailyLoc)=>
                    <RotatedMarker key={curShipDailyLoc["imo"] + curShipDailyLoc["latitude"].toString() + curShipDailyLoc["longitude"].toString() + "CIRCLE"} rotationOrigin="center" rotationAngle={curShipDailyLoc["heading"]} icon={ballastIcon} position={[curShipDailyLoc["latitude"], curShipDailyLoc["longitude"]]} 
                    radius={0.01} > <Tooltip key={curShipDailyLoc["imo"] + curShipDailyLoc["latitude"].toString() + curShipDailyLoc["longitude"].toString() + "tip"}>imo {curShipDailyLoc["imo"]}</Tooltip> </RotatedMarker>
                )}

{sampleDayShipLocs &&sampleDayShipLocs.filter(curShipSample=>curShipSample.draft>10).map((curShipDailyLoc)=>
                    <RotatedMarker key={curShipDailyLoc["imo"] + curShipDailyLoc["latitude"].toString() + curShipDailyLoc["longitude"].toString() + "CIRCLE"} rotationOrigin="center" rotationAngle={curShipDailyLoc["heading"]} icon={ladenIcon} position={[curShipDailyLoc["latitude"], curShipDailyLoc["longitude"]]} 
                    radius={0.01} > <Tooltip key={curShipDailyLoc["imo"] + curShipDailyLoc["latitude"].toString() + curShipDailyLoc["longitude"].toString() + "tip"}>imo {curShipDailyLoc["imo"]}</Tooltip> </RotatedMarker>
                )}



                {/* <BoatMarker color={"#f1c40f"} heading={60} center={[sampleDayShipLocs[0]["latitude"],sampleDayShipLocs[0]["longitude"]]}></BoatMarker> */}
                <Polygon pathOptions={{ color: 'grey' }} positions={OceanBoundaries['NorthAtlantic']} weight={0.5} opacity={0.2}><Tooltip>North Atlantic</Tooltip></Polygon>
                <Polygon pathOptions={{ color: 'grey' }} positions={OceanBoundaries['IndianOcean']} weight={0.5} opacity={0.2}><Tooltip>Indian Ocean</Tooltip></Polygon>
                <Polygon pathOptions={{ color: 'grey' }} positions={OceanBoundaries['FarEast']} weight={0.5} opacity={0.2}><Tooltip>Far East</Tooltip></Polygon>
                <Polygon pathOptions={{ color: 'grey' }} positions={OceanBoundaries['SouthEastAsia']} weight={0.5} opacity={0.2} stroke-dasharray={"4 1 2"}><Tooltip>South East Asia </Tooltip></Polygon>

            </Map>
        </div>
    );
}

export default WhatIfMap;