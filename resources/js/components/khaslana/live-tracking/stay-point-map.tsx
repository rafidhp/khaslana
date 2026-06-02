import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline, useMap, ZoomControl } from 'react-leaflet';
import type { RouteNode } from '@/pages/umkm/stay-point';

// MAPPIN CUSTOM LUCIDE (STANDAR UNTUK MANGKAL SAAT INI)
const LucidePinIcon = L.divIcon({
    className: 'bg-transparent',
    html: renderToString(
        <MapPin size={42} color="maroon" fill="#EA4335" strokeWidth={2} />
    ),
    iconSize: [42, 42],
    iconAnchor: [21, 42],
});

// ICON DINAMIS UNTUK FITUR RUTE
const createRoutePinIcon = (isActive: boolean) => L.divIcon({
    className: 'bg-transparent',
    html: renderToString(
        <MapPin 
            size={isActive ? 42 : 38} 
            color={isActive ? "#325E00" : "maroon"} 
            fill={isActive ? "#96FC30" : "#EA4335"} // Pin default rute abu-abu/merah gelap, pas aktif jadi Hijau Neon
            strokeWidth={isActive ? 2 : 1.5} 
        />
    ),
    iconSize: isActive ? [42, 42] : [38, 38],
    iconAnchor: isActive ? [21, 42] : [19, 38],
});

// Auto-center camera
function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 16, { duration: 1.5 });
    }, [center, map]);
    return null;
}

// Auto-zoom khusus pas rute dihidupkan
function FitRouteBounds({ nodes, showRouteLayer }: { nodes: RouteNode[], showRouteLayer: boolean }) {
    const map = useMap();
    useEffect(() => {
        if (showRouteLayer && nodes.length > 0) {
            const bounds = L.latLngBounds(nodes.map(n => [n.latitude, n.longitude]));
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 17 });
        }
    }, [nodes, map, showRouteLayer]);
    return null;
}

interface Props {
    status: string;
    position: [number, number] | null;
    prevPosition: [number, number] | null;
    showLastPin: boolean;
    // Props Layer Rute
    showRouteLayer: boolean;
    routeNodes: RouteNode[];
    onPinClick: (node: RouteNode) => void;
}

export default function StayPointMap({ 
    status, position, prevPosition, showLastPin, 
    showRouteLayer, routeNodes, onPinClick 
}: Props) {
    
    // STATE UNTUK LAYER RUTE
    const [routePath, setRoutePath] = useState<[number, number][]>([]);
    const [activeRoutePinIndex, setActiveRoutePinIndex] = useState<number | null>(null);

    // FETCH LOGIC OSRM KALAU LAYER RUTE NYALA
    useEffect(() => {
        if (!showRouteLayer || routeNodes.length < 2) {
            return;
        }

        const fetchRoute = async () => {
            try {
                const finalFullPath: [number, number][] = [];
                const segmentPromises = [];
                for (let i = 0; i < routeNodes.length - 1; i++) {
                    const startNode = routeNodes[i];
                    const endNode = routeNodes[i + 1];
                    const url = `https://router.project-osrm.org/route/v1/driving/${startNode.longitude},${startNode.latitude};${endNode.longitude},${endNode.latitude}?overview=full&geometries=geojson`;
                    
                    segmentPromises.push(axios.get(url).then(res => ({ res, startNode, endNode })));
                }

                const results = await Promise.all(segmentPromises);

                results.forEach(({ res, startNode, endNode }) => {
                    if (res.data.routes && res.data.routes.length > 0) {
                        const osrmCoords = res.data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
                        finalFullPath.push([startNode.latitude, startNode.longitude]);
                        finalFullPath.push(...osrmCoords);
                        finalFullPath.push([endNode.latitude, endNode.longitude]);
                    }
                });

                setRoutePath(finalFullPath);
            } catch (error) {
                console.error("Gagal memuat rute jalan dari OSRM", error);
            }
        };

        fetchRoute();
    }, [routeNodes, showRouteLayer]);

    // Kalau posisi kosong, render placeholder
    if (!position) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                <MapPin className="w-12 h-12 mb-3 opacity-20" />
                <p>Klik "Buka" untuk menyalakan Stay Point</p>
            </div>
        );
    }

    return (
        <MapContainer 
            center={position} 
            zoom={16} 
            scrollWheelZoom={true} 
            zoomControl={false}
            className="w-full h-full"
            attributionControl={false}
        >
            <TileLayer
                url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            />
            
            <ZoomControl position="bottomright" />  
            
            {/* Hanya ngefek center ke GPS kalau Rute lagi MATI */}
            {!showRouteLayer && <ChangeView center={showLastPin && prevPosition ? prevPosition : position} />}
            
            {/* Auto-Zoom ke seluruh area rute kalau Rute lagi NYALA */}
            <FitRouteBounds nodes={routeNodes} showRouteLayer={showRouteLayer} />
            
            {/* === RENDER PIN DEFAULT (STAY POINT) === */}
            {/* Kalau rute nyala, kita sembunyiin pin Mangkal/Live biar fokus ke garis rute. Kalau mati, munculin lagi. */}
            {!showRouteLayer && (
                <>
                    {status === 'MANGKAL' && (
                        <Marker position={position} icon={LucidePinIcon}>
                            <Popup>Lokasi Mangkal Saat Ini</Popup>
                        </Marker>
                    )}
                    
                    {showLastPin && prevPosition && (
                        <Marker position={prevPosition} icon={LucidePinIcon}>
                            <Popup>Lokasi Mangkal Sebelumnya</Popup>
                        </Marker>
                    )}
                    
                    {status === 'BUKA' && (
                        <CircleMarker center={position} pathOptions={{ color: '#99FF33', fillColor: '#99FF33', fillOpacity: 0.2 }} radius={30}>
                            <Popup>Lokasi GPS Anda</Popup>
                        </CircleMarker>
                    )}
                </>
            )}

            {/* === RENDER LAYER RUTE (Kalau Tombol Layer Diklik) === */}
            {showRouteLayer && (
                <>
                    {/* TRIPLE POLYLINE */}
                    {routePath.length > 0 && (
                        <>
                            <Polyline positions={routePath} pathOptions={{ color: '#4285F4', weight: 20, opacity: 0.15 }} />
                            <Polyline positions={routePath} pathOptions={{ color: '#2b2b2b', weight: 16, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }} />
                            <Polyline positions={routePath} pathOptions={{ color: '#99FF33', weight: 10, opacity: 1, lineCap: 'round', lineJoin: 'round' }} />
                        </>
                    )}

                    {/* PIN MASA LALU YANG BISA DIKLIK */}
                    {routeNodes.map((node, index) => (
                        <Marker 
                            key={index} 
                            position={[node.latitude, node.longitude]} 
                            icon={createRoutePinIcon(activeRoutePinIndex === index)}
                            eventHandlers={{
                                click: () => {
                                    setActiveRoutePinIndex(index);
                                    onPinClick(node);
                                },
                            }}
                        />
                    ))}
                </>
            )}

        </MapContainer>
    );
}