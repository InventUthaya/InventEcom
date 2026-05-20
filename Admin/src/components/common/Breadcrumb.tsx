import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ items, className = '' }) => {
    return (
        <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
            <ol className="flex items-center space-x-1">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        {index > 0 && (
                            <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
                        )}
                        
                        {item.href && !item.current ? (
                            <a
                                href={item.href}
                                onClick={item.onClick}
                                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-150"
                            >
                                {item.icon && <item.icon className="h-4 w-4 mr-1" />}
                                {item.label}
                            </a>
                        ) : (
                            <span 
                                className={`flex items-center ${
                                    item.current 
                                        ? 'text-gray-900 font-medium' 
                                        : 'text-gray-500'
                                }`}
                            >
                                {item.icon && <item.icon className="h-4 w-4 mr-1" />}
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
