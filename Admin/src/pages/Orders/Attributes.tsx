import React, { useState } from 'react';
import { Plus, Trash2, ChevronUp } from 'lucide-react';

interface AttributesProps {
    order: any;
}

const Attributes: React.FC<AttributesProps> = ({ order }) => {
    const [selectedAttributes, setSelectedAttributes] = useState<number[]>([]);
    const attributes: any[] = [];

    const handleSelectAttribute = (attributeId: number) => {
        setSelectedAttributes((prev) =>
            prev.includes(attributeId)
                ? prev.filter((id) => id !== attributeId)
                : [...prev, attributeId]
        );
    };

    const handleSelectAll = () => {
        if (selectedAttributes.length === attributes.length) {
            setSelectedAttributes([]);
        } else {
            setSelectedAttributes(attributes.map((attr) => attr.id));
        }
    };

    const handleDeleteSelected = () => {
        console.log('Delete selected attributes:', selectedAttributes);
        setSelectedAttributes([]);
    };

    const handleDeleteAttribute = (attributeId: number) => {
        console.log('Delete attribute:', attributeId);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                    <Plus className="h-4 w-4 mr-1" />
                    Add new
                </button>
                <button
                    onClick={handleDeleteSelected}
                    disabled={selectedAttributes.length === 0}
                    className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        selectedAttributes.length === 0
                            ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                            : 'text-red-600 bg-red-50 hover:bg-red-100'
                    }`}
                >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete selected
                </button>
            </div>

            <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="w-12 px-6 py-3 text-left">
                                <input
                                    type="checkbox"
                                    checked={selectedAttributes.length === attributes.length && attributes.length > 0}
                                    onChange={handleSelectAll}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center">
                                    Name
                                    <ChevronUp className="h-3 w-3 ml-1" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Value
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {attributes.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500">
                                    No data
                                </td>
                            </tr>
                        ) : (
                            attributes.map((attribute) => (
                                <tr key={attribute.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            checked={selectedAttributes.includes(attribute.id)}
                                            onChange={() => handleSelectAttribute(attribute.id)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {attribute.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {attribute.value}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Attributes;