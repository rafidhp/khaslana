import L from 'leaflet';
import { MapPin } from 'lucide-react';
import { useEffect } from 'react';
import { renderToString } from 'react-dom/server';
import { MapContainer, TileLayer, Marker, Polyline, useMap, ZoomControl } from 'react-leaflet';
import DefaultStore from '@/assets/images/umkm-user/default-store.png';
import 'leaflet/dist/leaflet.css';

export interface MerchantMapData {
    id: number;
    latitude: number;
    longitude: number;
    storeName: string;
    logo: string | null;
    isActive: boolean;
}

interface RouteNode {
    latitude: number;
    longitude: number;
    total_mangkal?: number;
}

interface FitBoundsProps {
    merchants: MerchantMapData[];
    userLocation: [number, number] | null;
    routePath: [number, number][];
    routeNodes?: RouteNode[];
    activeNodeIndex?: number | null;
}

interface Props {
    userLocation: [number, number] | null; 
    merchants: MerchantMapData[];          
    routePath: [number, number][];         
    selectedMerchantId: number | null;     
    onMerchantClick?: (id: number) => void;

    routeNodes?: RouteNode[];
    activeNodeIndex?: number | null;
    onNodeClick?: (index: number) => void;
}

// ICON 
const createStoreProfileIcon = (logo: string | null, storeName: string, isActive: boolean) => {
    const finalLogo = logo ? `/storage/${logo}` : DefaultStore;
    const borderColor = isActive ? '#99FF33' : '#8B8B8B';

    return L.divIcon({
        className: 'bg-transparent',
        html: `
            <div class="flex flex-col items-center justify-center cursor-pointer -mt-4">
                <div class="w-11 h-11 rounded-full p-[2px] shadow-lg flex items-center justify-center transition-transform hover:scale-110" 
                     style="background-color: ${borderColor};">
                    <img 
                        src="${finalLogo}" 
                        alt="${storeName}" 
                        class="w-full h-full rounded-full object-cover bg-[#242424]"
                        onerror="this.src='/images/default-store.png';"
                    />
                </div>
                <div class="mt-1 bg-[#1A1A1A]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/10 shadow-md whitespace-nowrap max-w-[100px] truncate text-center">
                    ${storeName}
                </div>
            </div>
        `,
        iconSize: [44, 60],
        iconAnchor: [22, 30],
    });
};

const createRoutePinIcon = (isActive: boolean) => L.divIcon({
    className: 'bg-transparent',
    html: renderToString(
        <MapPin 
            size={isActive ? 42 : 36}
            color={isActive ? "#121212" : "white"}
            fill={isActive ? "#96FC30" : "#EA4335"}
            strokeWidth={isActive ? 2.5 : 2}
        />
    ),
    iconSize: isActive ? [42, 42] : [36, 36],
    iconAnchor: isActive ? [21, 42] : [18, 36],
});

const UserLocationIcon = L.divIcon({
    className: 'bg-transparent',
    html: `
        <div class="relative flex items-center justify-center w-6 h-6">
            <div class="absolute w-full h-full bg-blue-500 rounded-full animate-ping opacity-75"></div>
            <div class="relative w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-md"></div>
        </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

// FIT BOUNDS
function FitMapBounds({ merchants, userLocation, routePath, routeNodes, activeNodeIndex }: FitBoundsProps) {
    const map = useMap();
    
    useEffect(() => {
        if (
            typeof activeNodeIndex === 'number' &&
            routeNodes &&
            routeNodes[activeNodeIndex]
        ) {
            const node = routeNodes[activeNodeIndex];
            map.setView([node.latitude, node.longitude], 19, {
                animate: true,
                duration: 1
            });
            return;
        }

        const bounds = L.latLngBounds([]);
        
        if (userLocation) bounds.extend(userLocation);
        merchants.forEach(m => bounds.extend([m.latitude, m.longitude]));
        routePath.forEach(p => bounds.extend(p));
        routeNodes?.forEach(n => bounds.extend([n.latitude, n.longitude]));

        if (bounds.isValid()) {
            const isDesktop = window.innerWidth >= 1024;

            const paddingTopLeft: [number, number] = isDesktop ? [400, 50] : [50, 50];
            const paddingBottomRight: [number, number] = isDesktop ? [50, 50] : [50, 300];

            map.fitBounds(bounds, { 
                paddingTopLeft, 
                paddingBottomRight, 
                maxZoom: 20,
                animate: true,
                duration: 1.5
            });
        }
    }, [merchants, userLocation, routePath, routeNodes, activeNodeIndex, map]);
    
    return null;
}

// MAIN
export default function UserMapViewer({
    userLocation,
    merchants,
    routePath,
    selectedMerchantId,
    onMerchantClick,
    routeNodes,
    activeNodeIndex,
    onNodeClick
}: Props) {

    const visibleMerchants = selectedMerchantId 
        ? merchants.filter(m => m.id === selectedMerchantId)
        : merchants;

    const defaultCenter: [number, number] = [-6.9272, 107.7471];

    return (
        <div className="absolute inset-0 w-full h-full bg-[#242424] z-0">
            <MapContainer 
                center={userLocation || (merchants.length > 0 ? [merchants[0].latitude, merchants[0].longitude] : defaultCenter)} 
                zoom={16} 
                scrollWheelZoom={true} 
                zoomControl={false}
                className="w-full h-full outline-none"
                attributionControl={false}
            >
                <TileLayer
                    url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                />
                
                <ZoomControl position="bottomright" />

                <FitMapBounds 
                    merchants={visibleMerchants} 
                    userLocation={userLocation} 
                    routePath={routePath}
                    routeNodes={routeNodes}
                    activeNodeIndex={activeNodeIndex}
                />

                {/* ROUTE */}
                {routePath.length > 0 && (
                    <>
                        <Polyline positions={routePath} pathOptions={{ color: '#4285F4', weight: 20, opacity: 0.15 }} />
                        <Polyline positions={routePath} pathOptions={{ color: '#2b2b2b', weight: 16, opacity: 0.9 }} />
                        <Polyline positions={routePath} pathOptions={{ color: '#99FF33', weight: 10, opacity: 1 }} />
                    </>
                )}

                {/* USER */}
                {userLocation && (
                    <Marker position={userLocation} icon={UserLocationIcon} />
                )}

                {/* MERCHANT */}
                {visibleMerchants.map((merchant) => (
                    <Marker 
                        key={merchant.id} 
                        position={[merchant.latitude, merchant.longitude]} 
                        icon={createStoreProfileIcon(merchant.logo, merchant.storeName, merchant.isActive)}
                        eventHandlers={{
                            click: () => {
                                if (onMerchantClick) onMerchantClick(merchant.id);
                            },
                        }}
                    />
                ))}

                {/* ROUTE NODE */}
                {routeNodes?.map((node, index) => (
                    <Marker
                        key={`node-${index}`}
                        position={[node.latitude, node.longitude]}
                        icon={createRoutePinIcon(activeNodeIndex === index)}
                        eventHandlers={{
                            click: () => {
                                if (onNodeClick) onNodeClick(index);
                            },
                        }}
                    />
                ))}
            </MapContainer>
        </div>
    );
}