import "../css/destination.css";

function ExperienceCard({ experience, className, style }) {
    return (
        <div className={`experience-card ${className || ""}`} style={style}>
            <img src={experience.image} alt={experience.title} />

            <div className="experience-text">
                <p className="experience-title">{experience.title}</p>
                <p className="experience-p">{experience.description}</p>
            </div>
        </div>
    );
}

export default ExperienceCard;
