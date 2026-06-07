import axios from 'axios';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface RouteNode {
    latitude: number;
    longitude: number;
    total_mangkal: number;
}

interface Props {
    nodes: RouteNode[];
    onPinClick: (node: RouteNode) => void;
}

// UBAH ICON JADI FUNGSI DINAMIS
const createPinIcon = (isActive: boolean) => L.divIcon({
    className: 'bg-transparent',
    html: renderToString(
        <MapPin 
            size={isActive ? 42 : 38} 
            color={isActive ? "#121212" : "white"} // Outline 
            fill={isActive ? "#96FC30" : "#EA4335"} // Fill
            strokeWidth={isActive ? 2.5 : 2} 
        />
    ),
    iconSize: isActive ? [42, 42] : [38, 38],
    iconAnchor: isActive ? [21, 42] : [19, 38],
});

//Zoom Agar Semua Pin Terlihat
function FitBounds({ nodes }: { nodes: RouteNode[] }) {
    const map = useMap();
    useEffect(() => {
        if (nodes.length > 0) {
            const bounds = L.latLngBounds(nodes.map(n => [n.latitude, n.longitude]));
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 17 });
        }
    }, [nodes, map]);
    return null;
}

export default function MapViewer({ nodes, onPinClick }: Props) {
    const [routePath, setRoutePath] = useState<[number, number][]>([]);
    
    // STATE BUAT NGINGET PIN YANG DIKLIK
    const [activePinIndex, setActivePinIndex] = useState<number | null>(null);

    // HIT OSRM Buat Bikin Polyline
    useEffect(() => {
        if (nodes.length < 2) return;

        const fetchRoute = async () => {
            try {
                const finalFullPath: [number, number][] = [];
                //Pecah Request Per Segmen
                const segmentPromises = [];
                for (let i = 0; i < nodes.length - 1; i++) {
                    const startNode = nodes[i];
                    const endNode = nodes[i + 1];
                    const url = `https://router.project-osrm.org/route/v1/driving/${startNode.longitude},${startNode.latitude};${endNode.longitude},${endNode.latitude}?overview=full&geometries=geojson`;
                    
                    // Simpan promise request ke array
                    segmentPromises.push(
                        axios.get(url).then(res => ({ res, startNode, endNode }))
                    );
                }

                // Tunggu Segmen di fetch
                const results = await Promise.all(segmentPromises);

                // Buat OSRM Narik Garis
                results.forEach(({ res, startNode, endNode }) => {
                    if (res.data.routes && res.data.routes.length > 0) {
                        const osrmCoords = res.data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);

                        // Insert Pin Awal -> Rute Aspal -> Pin Akhir 
                        finalFullPath.push([startNode.latitude, startNode.longitude]);
                        finalFullPath.push(...osrmCoords);
                        finalFullPath.push([endNode.latitude, endNode.longitude]);
                    }
                });

                // Set final array path
                setRoutePath(finalFullPath);

            } catch (error) {
                console.error("Gagal memuat rute jalan dari OSRM", error);
            }
        };

        fetchRoute();
    }, [nodes]);

    const defaultCenter: [number, number] = [-6.9272, 107.7471];

    return (
        <div className="w-full h-[400px] lg:h-[450px] bg-[#242424] rounded-xl overflow-hidden border-2 border-[#99FF33]/10 z-0 relative">
            <MapContainer 
                center={nodes.length > 0 ? [nodes[0].latitude, nodes[0].longitude] : defaultCenter} 
                zoom={15} 
                scrollWheelZoom={true} 
                zoomControl={true}
                className="w-full h-full"
                attributionControl={false}
            >
                <TileLayer
                    url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                />
                
                <FitBounds nodes={nodes} />

                {/* Cetak Garis Ngikut Jalan */}
                {routePath.length > 0 && (
                    <>
                        <Polyline 
                            positions={routePath} 
                            pathOptions={{ color: '#4285F4', weight: 20, opacity: 0.15 }} 
                        />
                        <Polyline 
                            positions={routePath} 
                            pathOptions={{ color: '#2b2b2b', weight: 16, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }} 
                        />
                        <Polyline 
                            positions={routePath} 
                            pathOptions={{ color: '#99FF33', weight: 10, opacity: 1, lineCap: 'round', lineJoin: 'round' }} 
                        />
                    </>
                )}

                {/* Apply Warna Ke MArker */}
                {nodes.map((node, index) => (
                    <Marker 
                        key={index} 
                        position={[node.latitude, node.longitude]} 
                        //Cek Index Di Klik
                        icon={createPinIcon(activePinIndex === index)}
                        eventHandlers={{
                            click: () => {
                                setActivePinIndex(index); 
                                onPinClick(node); 
                            },
                        }}
                    />
                ))}
            </MapContainer>
        </div>
    );
}