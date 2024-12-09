import React, { useState } from 'react';
import { GridRenderCellParams } from '@mui/x-data-grid';


const generateThumbnail = (identifier: string) => {
    return `https://archive.org/services/img/${identifier}`;
}


const renderThumbnailCell = (params: GridRenderCellParams) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img
                src={generateThumbnail(params.row.identifier)}
                alt={params.row.originalTitle}
                className="w-full h-auto"
            />
            {isHovered && (
                <div className="absolute top-0 left-full z-10 w-72 border border-gray-300 bg-white shadow-lg">
                    <img
                        src={generateThumbnail(params.row.identifier)}
                        alt={params.row.originalTitle}
                        className="w-full h-auto"
                    />
                </div>
            )}
        </div>
    );
};

export default renderThumbnailCell;