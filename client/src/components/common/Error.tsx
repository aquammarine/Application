interface ErrorProps {
    message: string;
    className?: string;
}

const Error: React.FC<ErrorProps> = ({ message, className = '' }) => {
    return (
        <p className={`text-red-500 text-center ${className}`}>{message}</p>
    );
};

export { Error };