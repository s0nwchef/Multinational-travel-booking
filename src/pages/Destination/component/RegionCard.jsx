import "../css/destination.css"
import { useNavigate } from "react-router-dom";
function RegionCard({ region }) {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/region/${region.region.toLowerCase().replace(" ","-")}`);
    };
    return (
        <div
            className={`card ${region.big ? "big" : ""}`}
            onClick={handleClick}
        >
            <img src={region.image} />


            <div className="card-text">

                <div className="card-region">
                    {region.region}
                </div>

                <div className="card-title">
                    {region.name}
                </div>

            </div>


        </div>
    );
}

export default RegionCard;

