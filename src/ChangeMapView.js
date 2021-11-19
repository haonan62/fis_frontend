import { useMap } from 'react-leaflet';
function ChangeMapView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}
// we can only change the map attribute from within the map component in overleaf, therefore the hassle
export default ChangeMapView;