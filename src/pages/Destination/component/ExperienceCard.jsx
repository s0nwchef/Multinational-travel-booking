import { useNavigate } from "react-router-dom";
import "../css/destination.css";

function ExperienceCard({ experience, className, style }) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (experience.slug) {
            navigate(`/region/${experience.slug}`);
        }
    };

    return (
        <div
            className={`experience-card ${className || ""}`}
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
            <img src={experience.image} alt={experience.title} />

            <div className="experience-text">
                <p className="experience-title">{experience.title}</p>
                <p className="experience-p">{experience.description}</p>
            </div>
        </div>
    );
}

export default ExperienceCard;
