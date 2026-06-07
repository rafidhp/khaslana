import React, { useState } from "react";

import SwitchOff from '../../assets/images/dashboard/switch-off.svg';
import SwitchOn from '../../assets/images/dashboard/switch-on.svg';

export default function DashboardSetting() {
    const [isActive, setIsActive] = useState(false);

    const toggleSwitch = () => {
        setIsActive(!isActive);
    };

    return (
        <div className="p-4 flex items-center gap-4">
            <p className="text-gray-700">Aktifkan Fitur</p>

            <button onClick={toggleSwitch} className="focus:outline-none transition-transform active:scale-95">
                <img
                    src={isActive ? SwitchOn : SwitchOff}
                    alt={isActive ? "Switch is On" : "Switch is Off"}
                    className="w-16 h-10 cursor-pointer"
                />
            </button>
        </div>
    );
}