const Page = ({ children, title, subtitle, style }) => {
    return (
        <main className="page" style={style}>
            {console.log(style)}
            <div className="container">
                {children}
            </div>
        </main>
    );
};

export default Page;