import { useNavigate } from "react-router-dom";
import "../css/destination.css";

function RegionCard({ region, className, style }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/region/${region.slug}`);
    };

    return (
        <div
            className={`card ${region.big ? "big" : ""} ${className || ""}`}
            style={style}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    handleClick();
                }
            }}
        >
            <img src={region.image} alt={region.name} />

            <div className="card-text">
                <div className="card-region">{region.region}</div>
                <div className="card-title">{region.name}</div>
            </div>
        </div>
    );
}

export default RegionCard;