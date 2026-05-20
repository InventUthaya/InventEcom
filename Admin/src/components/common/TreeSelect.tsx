import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// Interfaces
export interface TreeNode {
    id: any;
    label: string;
    children?: TreeNode[];
}

interface TreeSelectProps {
    id?: string;
    data: TreeNode[];
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    value?: string[] | null;
    onChange?: any;
}

interface TreeNodeProps {
    node: TreeNode;
    level: number;
    expanded: string[];
    selected: string | null;
    onToggle: (nodeId: string) => void;
    onSelect: (nodeId: string) => void;
    searchTerm: string;
    disabled: boolean;
    isFocused: boolean;
}

// Utils
const flattenTree = (nodes: TreeNode[], result: TreeNode[] = []): TreeNode[] => {
    nodes.forEach(node => {
        result.push(node);
        if (node.children) flattenTree(node.children, result);
    });
    return result;
};

const getParentPath = (tree: TreeNode[], nodeId: string, path: string[] = []): string[] => {
    for (const node of tree) {
        if (node.id === nodeId) return [...path, node.id];
        if (node.children) {
            const result = getParentPath(node.children, nodeId, [...path, node.id]);
            if (result.length) return result;
        }
    }
    return [];
};

const getAllParentIds = (nodes: TreeNode[]): string[] => {
    const parentIds: string[] = [];
    const traverse = (nodes: TreeNode[]) => {
        nodes.forEach(node => {
            if (node.children?.length) {
                parentIds.push(node.id);
                traverse(node.children);
            }
        });
    };
    traverse(nodes);
    return parentIds;
};

const getPathLabels = (tree: TreeNode[], path: string[]): string[] => {
    const labels: string[] = [];
    let currentNodes = tree;
    for (const id of path) {
        const node = currentNodes.find(n => n.id === id);
        if (node) {
            labels.push(node.label);
            currentNodes = node.children || [];
        }
    }
    return labels;
};

// TreeNode Sub-component
const TreeNodeItem: React.FC<TreeNodeProps> = React.memo(
    ({ node, level, expanded, selected, onToggle, onSelect, searchTerm, disabled, isFocused }) => {
        const isExpanded = expanded.includes(node.id);
        const isSelected = selected === node.id;
        const hasChildren = !!node.children?.length;
        const isLeaf = !hasChildren;

        const renderHighlightedText = useCallback(
            (text: string) => {
                if (!searchTerm) return text;
                const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
                return parts.map((part, i) =>
                    part.toLowerCase() === searchTerm.toLowerCase() ? (
                        <span key={i} className="bg-yellow-300 font-medium">
                            {part}
                        </span>
                    ) : (
                        part
                    )
                );
            },
            [searchTerm]
        );

        const handleToggleClick = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (!disabled) onToggle(node.id);
        };

        const handleSelectClick = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (!disabled && isLeaf) onSelect(node.id);
        };

        return (
            <div>
                <div
                    className={`flex items-center py-1.5 px-2 rounded cursor-pointer transition-colors duration-200 ${isSelected ? 'bg-emerald-100' : disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'} ${isFocused ? 'ring-2 ring-emerald-500' : ''}`}
                    style={{ paddingLeft: `${level * 20}px` }}
                    onClick={handleSelectClick}
                    role="option"
                    aria-selected={isSelected}
                >
                    {hasChildren ? (
                        <button
                            onClick={handleToggleClick}
                            className={`p-1 rounded-full focus:outline-none transition-colors duration-200 ${disabled ? 'cursor-not-allowed' : 'hover:bg-gray-200'}`}
                            disabled={disabled}
                            aria-label={isExpanded ? `Collapse ${node.label}` : `Expand ${node.label}`}
                        >
                            {isExpanded ? (
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            )}
                        </button>
                    ) : (
                        <div className="w-6" />
                    )}

                    {isLeaf ? (
                        <div
                            className={`w-5 h-5 border rounded flex justify-center items-center transition-colors duration-200 ${isSelected ? 'bg-emerald-700 border-emerald-700' : 'bg-white border-gray-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSelected && (
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                        </div>
                    ) : (
                        <div className="w-5 h-5" />
                    )}

                    <span className={`text-sm px-2 ${disabled ? 'cursor-not-allowed' : ''}`}>
                        {renderHighlightedText(node.label)}
                    </span>
                </div>

                {hasChildren && isExpanded && (
                    <div className="transition-all duration-200">
                        {node.children?.map(child => (
                            <TreeNodeItem
                                key={child.id}
                                node={child}
                                level={level + 1}
                                expanded={expanded}
                                selected={selected}
                                onToggle={onToggle}
                                onSelect={onSelect}
                                searchTerm={searchTerm}
                                disabled={disabled}
                                isFocused={isFocused}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    },
    (prevProps, nextProps) =>
        prevProps.node.id === nextProps.node.id &&
        prevProps.level === nextProps.level &&
        prevProps.expanded === nextProps.expanded &&
        prevProps.selected === nextProps.selected &&
        prevProps.searchTerm === nextProps.searchTerm &&
        prevProps.disabled === nextProps.disabled &&
        prevProps.isFocused === nextProps.isFocused
);

// Main Component
const TreeSelect: React.FC<TreeSelectProps> = ({
    id,
    data,
    placeholder = 'Select an item...',
    className = '',
    disabled = false,
    value = null,
    onChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [expanded, setExpanded] = useState<any>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);
    const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const prevValueRef = useRef<string[] | null>(null);
    const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

    const flatNodes = useMemo(() => flattenTree(data), [data]);
    const leafNodes = useMemo(() => flatNodes.filter(node => !node.children?.length), [flatNodes]);
    const selected = useMemo(() => {
        if (value && value.length > 0) {
            const node = flatNodes.find(n => n.id === value[value.length - 1]);
            if (node && !node.children?.length) {
                return value[value.length - 1];
            }
        }
        return null;
    }, [value, flatNodes]);

    // Initialize expanded state and focused index based on value prop
    useEffect(() => {
        if (value && value.length > 0) {
            const parentPath = value.slice(0, -1);
            setExpanded((prev: any) => [...new Set([...prev, ...parentPath])]);
            const selectedIndex = leafNodes.findIndex(node => node.id === value[value.length - 1]);
            setFocusedIndex(selectedIndex !== -1 ? selectedIndex : -1);
        } else {
            setExpanded([]);
            setFocusedIndex(-1);
        }
        prevValueRef.current = value;
    }, [value, leafNodes]);

    // Determine dropdown position based on screen space
    useEffect(() => {
        if (isOpen && dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            const dropdownHeight = 320;
            setDropdownPosition(spaceBelow < dropdownHeight && spaceAbove > spaceBelow ? 'top' : 'bottom');
        }
    }, [isOpen]);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
                setFocusedIndex(-1);
            }
        };
        if (!disabled) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [disabled]);

    // Auto-focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    // Filter data based on search term
    const filteredData = useMemo(() => {
        // If no data is provided, return empty array to trigger "No records found"
        if (!data.length) {
            return [];
        }

        // If no search term, return all data
        if (!searchTerm) {
            return data;
        }

        // Filter nodes that match the search term
        const matchedNodes = flatNodes.filter(node =>
            node.label.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // If no matches, return empty array to trigger "No results found"
        if (!matchedNodes.length) {
            return [];
        }

        // Expand paths for matched nodes
        const expandPaths = new Set<string>();
        matchedNodes.forEach(node => {
            const path = getParentPath(data, node.id);
            path.forEach(id => expandPaths.add(id));
        });

        // Filter tree to include only matched nodes and their parents
        const filterTree = (nodes: TreeNode[]): TreeNode[] =>
            nodes
                .map(node => {
                    const nodeMatches = node.label.toLowerCase().includes(searchTerm.toLowerCase());
                    const filteredChildren = node.children ? filterTree(node.children) : [];
                    if (nodeMatches || filteredChildren.length > 0) {
                        return {
                            ...node,
                            children: filteredChildren.length > 0 ? filteredChildren : node.children,
                        };
                    }
                    return null;
                })
                .filter(Boolean) as TreeNode[];

        const result = filterTree(data);
        setExpanded((prev: any) => [...new Set([...prev, ...expandPaths])]);
        return result;
    }, [searchTerm, data, flatNodes]);

    const handleToggle = useCallback((nodeId: string) => {
        setExpanded((prev: string[]) =>
            prev.includes(nodeId) ? prev.filter(id => id !== nodeId) : [...prev, nodeId]
        );
    }, []);

    const handleSelect = useCallback(
        (nodeId: string) => {
            if (disabled) return;
            const node = flatNodes.find(n => n.id === nodeId);
            if (!node || node.children?.length) return;

            const newValue = nodeId === selected ? null : getParentPath(data, nodeId);
            if (JSON.stringify(newValue) !== JSON.stringify(prevValueRef.current)) {
                onChange?.(newValue);
                prevValueRef.current = newValue;
            }
            setIsOpen(false);
            setSearchTerm('');
            setFocusedIndex(leafNodes.findIndex(n => n.id === nodeId));
        },
        [flatNodes, selected, onChange, data, disabled, leafNodes]
    );

    const handleExpandAll = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        if (disabled || !data.length) return;
        const parentIds = getAllParentIds(data);
        setExpanded(parentIds);
    }, [data, disabled]);

    const handleCollapseAll = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        if (disabled) return;
        setExpanded([]);
    }, [disabled]);

    const getSelectedText = useMemo(() => {
        if (!selected) return placeholder;
        const path = getParentPath(data, selected);
        const labels = getPathLabels(data, path);
        return labels.length > 0 ? labels.join(' > ') : placeholder;
    }, [selected, data, placeholder]);

    const handleOpenDropdown = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!disabled && data.length) {
            setIsOpen(!isOpen);
            if (!isOpen && selected) {
                const parentPath = getParentPath(data, selected).slice(0, -1);
                setExpanded((prev: any) => [...new Set([...prev, ...parentPath])]);
                const selectedIndex = leafNodes.findIndex(node => node.id === selected);
                setFocusedIndex(selectedIndex !== -1 ? selectedIndex : -1);
            }
        }
    };

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) return;

        if (e.key === 'Enter' && !isOpen) {
            if (data.length) {
                setIsOpen(true);
                e.preventDefault();
            }
        } else if (e.key === 'Escape' && isOpen) {
            setIsOpen(false);
            setSearchTerm('');
            setFocusedIndex(-1);
            e.preventDefault();
        } else if (e.key === 'ArrowDown' && isOpen) {
            e.preventDefault();
            setFocusedIndex(prev => {
                const filteredLeaves = filteredData.length
                    ? flattenTree(filteredData).filter(node => !node.children?.length)
                    : leafNodes;
                if (!filteredLeaves.length) return prev;
                const nextIndex = prev < filteredLeaves.length - 1 ? prev + 1 : 0;
                const node = filteredLeaves[nextIndex];
                if (node) {
                    const path = getParentPath(data, node.id).slice(0, -1);
                    setExpanded((prevExpanded: any) => [...new Set([...prevExpanded, ...path])]);
                    nodeRefs.current[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
                return nextIndex;
            });
        } else if (e.key === 'ArrowUp' && isOpen) {
            e.preventDefault();
            setFocusedIndex(prev => {
                const filteredLeaves = filteredData.length
                    ? flattenTree(filteredData).filter(node => !node.children?.length)
                    : leafNodes;
                if (!filteredLeaves.length) return prev;
                const nextIndex = prev > 0 ? prev - 1 : filteredLeaves.length - 1;
                const node = filteredLeaves[nextIndex];
                if (node) {
                    const path = getParentPath(data, node.id).slice(0, -1);
                    setExpanded((prevExpanded: any) => [...new Set([...prevExpanded, ...path])]);
                    nodeRefs.current[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
                return nextIndex;
            });
        } else if (e.key === 'Enter' && isOpen && focusedIndex !== -1) {
            e.preventDefault();
            const filteredLeaves = filteredData.length
                ? flattenTree(filteredData).filter(node => !node.children?.length)
                : leafNodes;
            const node = filteredLeaves[focusedIndex];
            if (node) handleSelect(node.id);
        }
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div
                id={id}
                className={`border border-gray-300 px-3 py-2 rounded-md bg-white transition-colors duration-200 focus-within:ring-2 focus-within:ring-emerald-500 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-emerald-500'}`}
                onClick={handleOpenDropdown}
                onKeyDown={handleKeyDown}
                tabIndex={disabled ? -1 : 0}
                role="combobox"
                aria-expanded={isOpen}
                aria-controls={`${id}-dropdown`}
            >
                <span className={selected ? 'text-gray-900' : 'text-gray-500'}>{getSelectedText}</span>
                <svg
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isOpen && !disabled && (
                <div
                    id={`${id}-dropdown`}
                    className={`absolute w-full max-w-md max-h-80 overflow-y-auto border border-gray-200 bg-white z-50 p-3 rounded-lg shadow-xl transition-all duration-200 transform origin-${dropdownPosition} scale-y-100 ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'}`}
                    role="listbox"
                >
                    <div className="flex justify-between mb-3">
                        <button
                            onClick={handleExpandAll}
                            className="text-xs text-emerald-600 hover:text-emerald-800 font-medium disabled:opacity-50"
                            disabled={disabled || !data.length}
                        >
                            Expand All
                        </button>
                        <button
                            onClick={handleCollapseAll}
                            className="text-xs text-emerald-600 hover:text-emerald-800 font-medium disabled:opacity-50"
                            disabled={disabled}
                        >
                            Collapse All
                        </button>
                    </div>
                    <input
                        ref={searchInputRef}
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="w-full mb-3 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                        disabled={disabled}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={handleKeyDown}
                        aria-label="Search tree nodes"
                    />

                    {data.length === 0 ? (
                        <div className="text-sm text-gray-500 text-center py-2">No records found</div>
                    ) : filteredData.length === 0 ? (
                        <div className="text-sm text-gray-500 text-center py-2">No results found</div>
                    ) : (
                        filteredData.map(node => (
                            <TreeNodeItem
                                key={node.id}
                                node={node}
                                level={0}
                                expanded={expanded}
                                selected={selected}
                                onToggle={handleToggle}
                                onSelect={handleSelect}
                                searchTerm={searchTerm}
                                disabled={disabled}
                                isFocused={
                                    leafNodes[focusedIndex]?.id === node.id &&
                                    !node.children?.length
                                }
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default TreeSelect;