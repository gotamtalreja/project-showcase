import React from 'react';
import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    action
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="mb-4 text-muted-foreground">
                {icon || <FileQuestion className="h-16 w-16" />}
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            {description && (
                <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
            )}
            {action && <div>{action}</div>}
        </div>
    );
};

export default EmptyState;
