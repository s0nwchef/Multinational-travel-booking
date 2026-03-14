import RegionCard from "../component/RegionCard.jsx";
import ExperienceCard  from "../component/ExperienceCard.jsx";
import { regions, experiences } from "../../../data/data.js";

// import "../styles/home.css";
import "../css/destination.css"
function Destination() {
    return (
        <section className="destination-section">
            <div className="container-destination">

                <h1 className="destination-title">Explore the World by Region</h1>

                <p className="subtitle">
                    Discover your next adventure across iconic global destination. From  <br/> ancient heritage to modern skylines, find where you belong.
                </p>

                <div className="region-grid">
                    {regions.map((region, index) => (
                        <RegionCard key={index} region={region}/>
                    ))}
                </div>

                <div className="experience-header">
                    <h2>Popular Experiences</h2>
                    <span>View all →</span>
                </div>

                <div className="experience-grid">
                    {experiences.map((experience,index)=>(
                        <ExperienceCard key={index} experience={experience}/>
                    ))}
                </div>

            </div>
        </section>

    );
}

export default Destination;