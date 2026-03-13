interface AuthRedirectProps {
    children: React.ReactNode;
    action: string;
    actionLink: string;
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ children, action, actionLink }) => {
    return (
        <div className="flex justify-center items-center">
            <p className="text-center text-sm text-slate-500">{children}<a href={actionLink} className="text-[#6366F0] font-bold">{` ${action}`}</a></p>
        </div>
    );
};

export { AuthRedirect };