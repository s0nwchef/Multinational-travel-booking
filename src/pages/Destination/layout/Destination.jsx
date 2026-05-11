import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import RegionCard from "../component/RegionCard.jsx";
import ExperienceCard from "../component/ExperienceCard.jsx";
import { getDestinations } from "../../../services/destinationService.js";
import { useInView } from "../hooks/hook.jsx";
import "../css/destination.css";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80";
const REGIONS_PER_PAGE = 6;
const SLIDER_SIZE = 4;

const toSlug = (value = "") =>
    value
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

function Destination() {
    const location = useLocation();
    const [regions, setRegions] = useState([]);
    const [regionPage, setRegionPage] = useState(1);
    const [slideIndex, setSlideIndex] = useState(0);
    const [expRef, expVisible] = useInView();

    useEffect(() => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0);
    }, [location.pathname]);

    useEffect(() => {
        const fetchDestinations = async () => {
            const data = await getDestinations();

            setRegions(
                data.map((item) => ({
                    _id: item._id,
                    image: item.anh_bia || item.anh_co || FALLBACK_IMAGE,
                    region: item.chau_luc,
                    slug: toSlug(item.chau_luc),
                    name: item.quoc_gia,
                    city: item.thanh_pho,
                    description: item.mo_ta,
                    popular: item.pho_bien === true,
                }))
            );
        };

        void fetchDestinations();
    }, []);

    const totalRegionPages = Math.max(1, Math.ceil(regions.length / REGIONS_PER_PAGE));

    const pagedRegions = useMemo(() => {
        const start = (regionPage - 1) * REGIONS_PER_PAGE;
        return regions.slice(start, start + REGIONS_PER_PAGE).map((region, index) => ({
            ...region,
            big: index === 3,
        }));
    }, [regionPage, regions]);

    const popularExperiences = useMemo(
        () => regions.filter((region) => region.popular),
        [regions]
    );

    const visibleExperiences = useMemo(() => {
        if (popularExperiences.length <= SLIDER_SIZE) {
            return popularExperiences;
        }

        return Array.from({ length: SLIDER_SIZE }, (_, index) => {
            const itemIndex = (slideIndex + index) % popularExperiences.length;
            return popularExperiences[itemIndex];
        });
    }, [popularExperiences, slideIndex]);

    useEffect(() => {
        if (popularExperiences.length <= SLIDER_SIZE) {
            return undefined;
        }

        const timer = setInterval(() => {
            setSlideIndex((current) => (current + 1) % popularExperiences.length);
        }, 3000);

        return () => clearInterval(timer);
    }, [popularExperiences.length]);

    const handleRegionPageChange = (page) => {
        setRegionPage(page);
        setTimeout(() => {
            document.querySelector(".region-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
    };

    return (
        <section className="destination-section">
            <div className="container-destination">
                <h1 className="destination-title fade-up show" style={{ animationDelay: "0s" }}>
                    Explore the World by Region
                </h1>

                <p className="subtitle fade-up show" style={{ animationDelay: "0.3s" }}>
                    Discover your next adventure across iconic global destination. From <br />
                    ancient heritage to modern skylines, find where you belong.
                </p>

                <div className="region-grid">
                    {pagedRegions.map((region, index) => (
                        <RegionCard
                            key={`${region._id}-${regionPage}`}
                            region={region}
                            className="fade-up show"
                            style={{ animationDelay: `${0.5 + index * 0.2}s` }}
                        />
                    ))}
                </div>

                {totalRegionPages > 1 && (
                    <div className="destination-pagination" aria-label="Destination pagination">
                        <button
                            type="button"
                            onClick={() => handleRegionPageChange(Math.max(1, regionPage - 1))}
                            disabled={regionPage === 1}
                        >
                            Previous
                        </button>

                        {Array.from({ length: totalRegionPages }, (_, index) => index + 1).map((page) => (
                            <button
                                key={page}
                                type="button"
                                className={page === regionPage ? "active" : ""}
                                onClick={() => handleRegionPageChange(page)}
                                aria-current={page === regionPage ? "page" : undefined}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={() => handleRegionPageChange(Math.min(totalRegionPages, regionPage + 1))}
                            disabled={regionPage === totalRegionPages}
                        >
                            Next
                        </button>
                    </div>
                )}

                <div ref={expRef}>
                    <div className="experience-header">
                        <h2>Popular Experiences</h2>
                    </div>

                    {expVisible && (
                        <div className="experience-slider">
                            {visibleExperiences.map((exp, index) => (
                                <ExperienceCard
                                    key={`${exp._id}-${index}`}
                                    experience={{
                                        title: exp.name,
                                        description: exp.city || exp.description || exp.region,
                                        image: exp.image,
                                    }}
                                    className="fade-up show"
                                    style={{ animationDelay: `${index * 0.15}s` }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Destination;
