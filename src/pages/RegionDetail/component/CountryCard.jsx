import { useNavigate } from "react-router-dom";

function CountryCard({ country, className, style }) {
    const navigate = useNavigate();

    const handleExplore = () => {
        navigate("/tours", {
            state: {
                category: country.filterCategory,
            },
        });
    };

    return (
        <div className={className} style={style}>
            <div className="country-card">
                <div className="image-country">
                    <img src={country.image} alt={country.name} loading="lazy" />

                    {country.tag && (
                        <span className={`tag ${country.tag.toLowerCase().replace(" ", "-")}`}>
                            {country.tag}
                        </span>
                    )}
                </div>

                <div className="country-info">
                    <div className="country-header">
                        <h3>{country.name}</h3>
                        <span className="rating">Star {country.rating}</span>
                    </div>

                    <p className="location">{country.location}</p>

                    <hr />

                    <div className="country-footer">
                        <span className="tour">{country.tours}+ Tours</span>
                        <button type="button" className="explore" onClick={handleExplore}>
                            Explore -&gt;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CountryCard;
