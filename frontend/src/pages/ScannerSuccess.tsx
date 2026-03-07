import React, { useEffect, useState } from 'react';
import { MapPin, CheckCircle } from 'lucide-react';

interface ScannerSuccessProps {
    onBack: () => void;
    areaLocation?: { lat: number, lng: number };
    areaName?: string;
}

const ScannerSuccess: React.FC<ScannerSuccessProps> = ({ onBack, areaLocation, areaName }) => {
    const [loadingLocation, setLoadingLocation] = useState(false);

    const handleNavigate = () => {
        if (!areaLocation || !areaLocation.lat || !areaLocation.lng) {
            alert("Location coordinates are not available for this area.");
            return;
        }

        setLoadingLocation(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLoadingLocation(false);
                    const { latitude, longitude } = position.coords;
                    const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${areaLocation.lat},${areaLocation.lng}&travelmode=driving`;
                    window.open(url, "_blank");
                },
                (error) => {
                    setLoadingLocation(false);
                    console.error("Error getting location: ", error);
                    alert("Could not get your current location. Opening map with destination only.");
                    const url = `https://www.google.com/maps/search/?api=1&query=${areaLocation.lat},${areaLocation.lng}`;
                    window.open(url, "_blank");
                }
            );
        } else {
            setLoadingLocation(false);
            alert("Geolocation is not supported by your browser.");
            const url = `https://www.google.com/maps/search/?api=1&query=${areaLocation.lat},${areaLocation.lng}`;
            window.open(url, "_blank");
        }
    };

    return (
        <div className="h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 relative">
            <div className="absolute top-6 left-6">
                <button onClick={onBack} className="text-zinc-400 hover:text-white transition-colors">
                    ← Back to Dashboard
                </button>
            </div>

            <div className="bg-zinc-900/50 border border-emerald-500/30 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 max-w-lg w-full text-center shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="text-emerald-400 w-12 h-12" />
                </div>

                <h1 className="text-3xl font-black text-white mb-4">
                    QR Scanning Completed!
                </h1>

                <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                    Your QR check is completed. You are ready to move in and park at <strong className="text-emerald-400">{areaName || "your designated slot"}</strong>.
                </p>

                <button
                    onClick={handleNavigate}
                    disabled={loadingLocation}
                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black font-bold text-lg rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                    <MapPin size={24} />
                    {loadingLocation ? "Getting Location..." : "Navigate to the slot"}
                </button>
            </div>
        </div>
    );
};

export default ScannerSuccess;
