import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import CommonService from '../../services/CommonService';

interface StatusHistory {
    Id?: number;
    OrderId?: number;
    NewStatusId?: number;
    NewStatusName?: string;
    ChangedBy?: string;
    ChangedOn?: string;
    Note?: string;
    Description?: string;
}

interface OrderNotesProps {
    statusHistory: StatusHistory[]; // initial history (optional, can be empty)
    formatDate: (dateString?: string) => string;
}

const OrderNotes: React.FC<any> = ({ statusHistory, formatDate }) => {
    const [notes, setNotes] = useState<StatusHistory[]>(statusHistory); // all notes
    const [selectedNotes, setSelectedNotes] = useState<StatusHistory[]>([]); // selected notes
    // Fetch latest notes from API when OrderId is available
    // useEffect(() => {
    //     if (!statusHistory[0]?.OrderId) return;

    //     const fetchOrderTrack = async () => {
    //         try {
    //             const data = await CommonService.getWithSingleParam(
    //                 "history",
    //                 "GetHistory",
    //                 statusHistory[0].OrderId
    //             );

    //             // Assuming data.data is an array of StatusHistory objects
    //             const fetchedNotes = data.data || [];
    //             setNotes(fetchedNotes); // Update the displayed list
    //             console.log("Fetched notes:", fetchedNotes);
    //         } catch (err) {
    //             console.error("Error fetching order track:", err);
    //         }
    //     };

    //     fetchOrderTrack();
    // }, [statusHistory[0]?.OrderId]);

    // Handle individual note selection
    const handleSelectNote = (note: StatusHistory) => {
        if (selectedNotes.some((n) => n.Id === note.Id)) {
            setSelectedNotes(selectedNotes.filter((n) => n.Id !== note.Id));
        } else {
            setSelectedNotes([...selectedNotes, note]);
        }
    };

    // Handle select all checkbox
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedNotes([...notes]);
        } else {
            setSelectedNotes([]);
        }
    };

    // Delete selected notes (local state + API call if needed)
    const handleDeleteSelected = () => {
        if (selectedNotes.length === 0) return;
        console.log('Deleting selected notes:', selectedNotes);

        // Remove selected notes from the list
        setNotes(notes.filter((note) =>
            !selectedNotes.some((s) => s.Id === note.Id)
        ));

        setSelectedNotes([]); // Clear selection

        // Optionally: call API to delete on backend
        // await CommonService.deleteNotes(selectedNotes.map(n => n.Id));
    };

    // Delete single note
    const handleDeleteNote = (noteId: number) => {
        console.log('Deleting note:', noteId);
        setNotes(notes.filter((n) => n.Id !== noteId));
        setSelectedNotes(selectedNotes.filter((n) => n.Id !== noteId));

        // Optionally: call API to delete single note
    };

    return (
        <div className="space-y-4">
            {/* Mobile View */}
            <div className="block md:hidden space-y-4">
                {notes.length === 0 ? (
                    <div className="text-sm text-gray-500 text-center">No notes</div>
                ) : (
                    notes.map((note) => (
                        <div key={note.Id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedNotes.some((n) => n.Id === note.Id)}
                                        onChange={() => handleSelectNote(note)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                                    />
                                    <span className="font-medium text-gray-500">Created on:</span>{' '}
                                    {formatDate(note.ChangedOn)}
                                </div>
                                <div>
                                    <span className="font-medium text-gray-500">Note:</span>{' '}
                                    {note.Description || note.Note || '-'}
                                </div>
                                <div>
                                    <span className="font-medium text-gray-500">ChangedOn:</span>{' '}
                                    {note.ChangedOn
                                        ? new Date(note.ChangedOn).toLocaleString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true,
                                        }).replace(',', '')
                                        : '—'}
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => note.Id && handleDeleteNote(note.Id)}
                                        className="text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Note
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ChangedOn
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {notes.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 sm:px-6 py-4 text-sm text-gray-500 text-center">
                                    No notes
                                </td>
                            </tr>
                        ) : (
                            notes.map((note) => (
                                <tr key={note.Id} className="hover:bg-gray-50">
                                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                                        {note.Description || note.Note || '-'}
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {note.ChangedOn
                                            ? new Date(note.ChangedOn).toLocaleString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true,
                                            }).replace(',', '')
                                            : '—'}
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

export default OrderNotes;