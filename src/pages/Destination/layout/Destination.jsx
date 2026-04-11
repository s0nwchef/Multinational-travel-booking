import RegionCard from "../component/RegionCard.jsx";
import ExperienceCard  from "../component/ExperienceCard.jsx";
import { regions, experiences } from "../../../data/data.js";

// import "../styles/home.css";
import "../css/destination.css"
import {useInView} from "../hooks/hook.jsx";
import {useEffect} from "react";
import {useLocation} from "react-router-dom";
function Destination() {

    const location = useLocation();

    useEffect(() => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0);
    }, [location.pathname]);

    const [expRef, expVisible] = useInView();

    return (
        <section  className="destination-section">
            <div className="container-destination">

                <h1 className="destination-title fade-up show" style={ {animationDelay: "0s"} }>Explore the World by Region</h1>

                <p className="subtitle fade-up show" style={{ animationDelay: "0.3s" }}>
                    Discover your next adventure across iconic global destination. From  <br/> ancient heritage to modern skylines, find where you belong.
                </p>

                <div className="region-grid">
                    {regions.map((region, index) => (
                        <RegionCard key={index} region={region} className="fade-up show" style={{ animationDelay: `${ 0.5 + index * 0.2}s` }}/>
                    ))}
                </div>
                <div ref={expRef}>
                    <div className="experience-header">
                        <h2>Popular Experiences</h2>
                        <span>View all →</span>
                    </div>

                    {expVisible && (
                        <div className="experience-grid">
                            {experiences.map((exp, index) => (
                                <ExperienceCard
                                    key={index}
                                    experience={exp}
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