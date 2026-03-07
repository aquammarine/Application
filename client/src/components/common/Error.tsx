interface ErrorProps {
    message: string;
    className?: string;
}

const Error: React.FC<ErrorProps> = ({ message, className = '' }) => {
    return (
        <p className={`text-red-500 text-sm font-semibold p-0 m-0 ${className}`}>{message}</p>
    );
};

export { Error };