// src/components/driver/VehicleList.jsx
import React from 'react';

export default function VehicleList({ vehicles = [], onSelect }) {
  return (
    <div className="bg-white rounded-md shadow p-4 border">
      <h3 className="font-semibold mb-3">Danh sách xe</h3>
      <ul className="space-y-2">
        {vehicles.map(v => (
          <li key={v.id} className="flex items-center justify-between">
            <div>
              <div className="font-medium">{v.name} — {v.plate}</div>
              <div className="text-xs text-gray-500">Tài xế: {v.driver}</div>
            </div>
            <div>
              <button
                onClick={() => onSelect?.(v)}
                className="px-3 py-1 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Chọn
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
