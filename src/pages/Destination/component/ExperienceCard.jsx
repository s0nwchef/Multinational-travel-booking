import "../css/destination.css"
function ExperienceCard({ experience }) {

  return (
    <div className="experience-card">

      <img src={experience.image} />

       <div className="experience-text">
           <p className="experience-title">{experience.title}</p>
           <p className="experience-p">{experience.description}</p>
       </div>


    </div>
  );
}

export default ExperienceCard;