const BranchButton = ({ k, b, hov, setHov, onSelect }) => {
    return (
        <button
            key={k}
            onMouseEnter={() => setHov(k)}
            onMouseLeave={() => setHov(null)}
            onClick={() => onSelect(k)}
            className="card"
            style={{
                background:hov===k?b.color:"rgba(255,255,255,0.05)",
                border:`2px solid ${hov===k?b.accent:"rgba(255,255,255,0.1)"}`,
                borderRadius:"14px",
                padding:"1.4rem 1rem",
                cursor:"pointer",
                transition:"all 0.25s",
                textAlign:"center",
                color:"#fff",
                fontFamily:"Georgia,serif"
            }}
        >
            <div
                style={{
                    fontSize:"1.9rem",
                    marginBottom:"0.45rem"
                }}
            >
                { b.icon }
            </div>
            <div style={{fontSize:"1rem",fontWeight:"700",letterSpacing:"0.04em"}}>{b.name}</div>
            <div style={{fontSize:"0.7rem",color:hov===k?"rgba(255,255,255,0.75)":"#6a7d90",marginTop:"0.25rem",lineHeight:"1.3"}}>{b.trainingName}</div>
        </button>
    );
};

export default BranchButton;