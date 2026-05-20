import React, { useState } from "react";
import { Check } from "lucide-react";
import Input from "../../components/form/input/InputField";

interface Rider {
  id: number;
  name: string;
}

interface AssignRiderModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  riders: Rider[];
  onAssign: (riderId: number) => void;
}

export default function AssignRiderModal({
  open,
  setOpen,
  riders,
  onAssign,
}: AssignRiderModalProps) {
  const [search, setSearch] = useState("");
  const [selectedRider, setSelectedRider] = useState<number | null>(null);

  const filteredRiders = riders.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      {/* Modal Box */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            🚴 <span>Assign Rider</span>
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {/* Search + List */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Assignee</label>
          <Input
            placeholder="Search Rider..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ul className="max-h-40 overflow-y-auto border rounded-md">
            {filteredRiders.map((r) => (
              <li
                key={r.id}
                onClick={() => setSelectedRider(r.id)}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between"
              >
                <span>{r.name}</span>
                {selectedRider === r.id && (
                  <Check className="h-4 w-4 text-green-600" />
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
          <button
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
            onClick={() => {
              if (selectedRider) {
                onAssign(selectedRider);
                setOpen(false);
              }
            }}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}