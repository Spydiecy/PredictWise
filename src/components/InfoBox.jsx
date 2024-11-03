const InfoBox = ({ title, value }) => (
    <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-lg blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
        
        {/* Content */}
        <div className="relative p-4 bg-gradient-to-r from-violet-950/90 to-indigo-950/90 rounded-lg border border-violet-500/10">
            <h4 className="text-sm font-medium text-violet-300 mb-1">{title}</h4>
            <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-200 to-indigo-200">
                {value}
            </p>
        </div>
    </div>
);

export default InfoBox;