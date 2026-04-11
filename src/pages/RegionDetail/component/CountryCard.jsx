function CountryCard({ country, className, style }) {

    return (
        <div className={className} style={style}>
            <div className="country-card">

                <div className="image-country">
                    <img src={country.image} loading="lazy" />

                    {country.tag && (
                        <span className={`tag ${country.tag.toLowerCase().replace(" ","-")}`}>
                            {country.tag}
                        </span>
                    )}
                </div>

                <div className="country-info">

                    <div className="country-header">
                        <h3>{country.name}</h3>
                        <span className="rating">☆ {country.rating}</span>
                    </div>

                    <p className="location">📍 {country.location}</p>

                    <hr/>

                    <div className="country-footer">
                        <span className="tour">{country.tours}+ Tours</span>
                        <span className="explore">Explore →</span>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default CountryCard;