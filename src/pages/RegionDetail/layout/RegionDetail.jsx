import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import CountryCard from "../component/CountryCard";
import { getDestinations } from "../../../services/destinationService.js";
import tourService from "../../../services/Tours/tourService.js";
import "../css/RegionDetail.css";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80";

const toSlug = (value = "") =>
    value
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

function RegionDetail() {
    const { regionName } = useParams();
    const location = useLocation();
    const [animate, setAnimate] = useState(false);
    const [destinations, setDestinations] = useState([]);
    const [tours, setTours] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0);

        setAnimate(false);
        setTimeout(() => setAnimate(true), 50);
    }, [location.pathname]);

    useEffect(() => {
        const fetchData = async () => {
            const [destinationData, tourData] = await Promise.all([
                getDestinations(),
                tourService.getTours(),
            ]);

            setDestinations(destinationData);
            setTours(tourData);
        };

        void fetchData();
    }, []);

    const regionDestinations = useMemo(
        () => destinations.filter((item) => toSlug(item.chau_luc) === regionName),
        [destinations, regionName]
    );

    const regionTitle = regionDestinations[0]?.chau_luc || regionName;

    const regionCountries = useMemo(
        () =>
            regionDestinations.map((destination) => {
                const destinationTours = tours.filter((tour) => tour.destinationId === destination._id);

                return {
                    id: destination._id,
                    name: destination.quoc_gia,
                    filterCategory: destination.thanh_pho || destination.quoc_gia,
                    location: [destination.thanh_pho, destination.mo_ta].filter(Boolean).join(", ") || destination.chau_luc,
                    tours: destinationTours.length,
                    rating: destinationTours.length
                        ? Math.max(...destinationTours.map((tour) => tour.rating || 0)).toFixed(1)
                        : "0.0",
                    tag: destination.pho_bien ? "TOP RATED" : "",
                    image: destination.anh_bia || destination.anh_co || FALLBACK_IMAGE,
                };
            }),
        [regionDestinations, tours]
    );

    return (
        <section className="regiondetail-section">
            <div className="container-regiondetail">
                <div className={`breadcrumb fade-up ${animate ? "show" : ""}`} style={{ animationDelay: "0s" }}>
                    Destinations &gt; <span className="breadcrumb_link">{regionTitle}</span>
                </div>

                <h1 className={`fade-up ${animate ? "show" : ""}`} style={{ animationDelay: "0.2s" }}>
                    Discover {regionTitle}'s Best
                </h1>

                <p className={`subtitle fade-up ${animate ? "show" : ""}`} style={{ animationDelay: "0.4s" }}>
                    Choose a destination in this region and explore matching tours.
                </p>

                <div className="country-grid">
                    {regionCountries.map((country, index) => (
                        <CountryCard
                            key={country.id}
                            country={country}
                            className={`fade-up ${animate ? "show" : ""}`}
                            style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default RegionDetail;
