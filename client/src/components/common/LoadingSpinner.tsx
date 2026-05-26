import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
    const sizes = {
        sm: 'h-6 w-6 border-2',
        md: 'h-10 w-10 border-2',
        lg: 'h-16 w-16 border-4',
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div
                className={`${sizes[size]} animate-spin rounded-full border-t-primary border-r-primary border-b-transparent border-l-transparent`}
            ></div>
        </div>
    );
};

export default LoadingSpinner;
