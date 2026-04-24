const Page = ({ children, title, subtitle }) => {
    return (
        <div className="page">
            <div className="container">
                {children}
            </div>
        </div>
    );
};

export default Page;