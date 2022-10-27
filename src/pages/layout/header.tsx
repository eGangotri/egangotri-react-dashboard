import React from 'react';
import 'index.css';

const EgangotriHeader: React.FC<{ title: string }> = ({ title }) => {
    return (
        <header className='Header'>
            {title}
        </header>
    );
}
export default EgangotriHeader