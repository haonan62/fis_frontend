import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, Tooltip,Polygon } from 'react-leaflet';
import ChangeMapView from './ChangeMapView';

import OceanBoundaries from './OceanBoundaries';

const FreightMap = (props) => {
    // more variables will be added in
    // primitive variable: ship locations, timestamp
    // add a timebar at the btm of the container as well, it will change the map here useing effect dynamically
    // kill me, kusuokusuo!!!!!!!!

    const allZoneFlag=props.allZoneFlag;

    const variables = props.variables;
    const routeColor = variables.color;
    const midPoint = variables.center;
    const polyline = variables.polyline;
    const zoomLevel = variables.zoomLevel;

    const companyShipCoordinates = variables.companyShipCoordinates;

    const demandSupply = props.demandSupply;
    const weeklySnapShot=props.weeklySnapShot;
    const ausLoadingNorm=weeklySnapShot['Australia Loadings_normalised']*30;
    const ausLoadingActual=weeklySnapShot['Australia Loadings'];
    const brazilLoadingNorm=weeklySnapShot['Brazil Loadings_normalised']*30;
    const brazilLoadingActual=weeklySnapShot['Brazil Loadings'];
    const chinaIronOreImportNorm=weeklySnapShot['Iron Ore China Import Port Stock_normalised']*60;
    const chinaIronOreImportActual=weeklySnapShot['Iron Ore China Import Port Stock'];

    const C5Normalised=weeklySnapShot['C5_normalised'];
    const C5Actual=weeklySnapShot['C5'];

    const northAtlanticBallast=weeklySnapShot['North Atlantic_ballast'];
    const northAtlanticLaden=weeklySnapShot['North Atlantic_laden'];


    const indianOceanBallast=weeklySnapShot['Indian Ocean_ballast'];
    const indianOceanLaden=weeklySnapShot['Indian Ocean_laden'];

    const farEastBallast=weeklySnapShot['Far East_ballast'];
    const farEastLaden=weeklySnapShot['Far East_laden'];

    const seaBallast=weeklySnapShot['South East Asia_ballast'];
    const seaLaden=weeklySnapShot['South East Asia_laden'];




    return (
        <div className="freightmap">

            <MapContainer center={midPoint} zoom={zoomLevel}>
                <ChangeMapView center={midPoint} zoom={zoomLevel} />
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {/* { Object.entries(StaticShipCoordinates).map((t,k) => <Marker position={k}/>) }   */}
                {/* {companyShipCoordinates&& <CircleMarker center={companyShipCoordinates[3]} pathOptions={{ color: 'red' }}
                    radius={3} > <Tooltip>Company ship</Tooltip> </CircleMarker>} */}

                {companyShipCoordinates && companyShipCoordinates.map((companyShipLoc) =>
                    <CircleMarker center={companyShipLoc} pathOptions={{ color: 'yellow' }}
                        radius={5} > <Tooltip>Company ship</Tooltip> </CircleMarker>
                )}

                {ausLoadingNorm &&<CircleMarker center={[-25.865143, 135.209900]} pathOptions={{ color: 'green' }}
                    radius={ ausLoadingNorm} > <Tooltip>Austrlia Supply: {ausLoadingActual}</Tooltip> </CircleMarker>}
                
                {chinaIronOreImportNorm&&<CircleMarker center={[31.224361, 110.469170]} pathOptions={{ color: 'red' }}
                    radius={ chinaIronOreImportNorm} > <Tooltip>China Demand: {chinaIronOreImportActual}</Tooltip> </CircleMarker>}
                {brazilLoadingNorm&&<CircleMarker center={[-18.533773, -46.625290]} pathOptions={{ color: 'green' }}
                    radius={ brazilLoadingNorm} > <Tooltip>Brazil Iron Supply: {brazilLoadingActual}</Tooltip> </CircleMarker>}
                

                {polyline && routeColor && <Polyline pathOptions={routeColor} positions={polyline} smoothFactor={1} weight={1} opacity={0.5}></Polyline>}
                
                {allZoneFlag&&<Polygon pathOptions={{ color: 'grey' }} positions={OceanBoundaries['NorthAtlantic']} weight={0.5} opacity={0.2}><Tooltip>Ballast: {northAtlanticBallast} Laden: {northAtlanticLaden} </Tooltip></Polygon>}
                {allZoneFlag&&<Polygon pathOptions={{ color: 'grey' }} positions={OceanBoundaries['IndianOcean']} weight={0.5} opacity={0.2}><Tooltip>Ballast: {indianOceanBallast} Laden: {indianOceanLaden} </Tooltip></Polygon>}
                {allZoneFlag&&<Polygon pathOptions={{ color: 'grey' }} positions={OceanBoundaries['FarEast']} weight={0.5} opacity={0.2}><Tooltip>Ballast: {farEastBallast} Laden: {farEastLaden} </Tooltip></Polygon>}
                {allZoneFlag&&<Polygon pathOptions={{ color: 'grey' }} positions={OceanBoundaries['SouthEastAsia']} weight={0.5} opacity={0.2} stroke-dasharray={"4 1 2"}><Tooltip>Ballast: {seaBallast} Laden: {seaLaden} </Tooltip></Polygon>}
            </MapContainer>


        </div>
    );
}

export default FreightMap;