import {useActionData, useLocation, useParams} from "react-router-dom";
import { countries } from "../../../data/data";
import CountryCard from "../component/CountryCard";
import "../css/RegionDetail.css"
import {useEffect, useState} from "react";
function RegionDetail(){

    const { regionName } = useParams();

    const regionCountries = countries.filter(
        (item)=> item.region === regionName
    );
    const [animate, setAnimate] = useState(false);

    const location = useLocation();


    useEffect(() => {

        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0);


        // setAnimate(false);
        setTimeout(() => setAnimate(true), 50);

    }, [location.pathname]);

    return (
        <section className="regiondetail-section">
            <div className="container-regiondetail">

                <div className={`breadcrumb fade-up ${animate ? "show" : ""}`} style={{animationDelay: "0s"}}>
                    Destinations &gt; <span className="breadcrumb_link">{regionName} </span>
                </div>

                <h1 className={`fade-up ${animate ? "show" : ""}`} style={{animationDelay: "0.2s"}}>
                    Discover {regionName}'s Best
                </h1>

                <p className={`subtitle fade-up ${animate ? "show" : ""}`} style={{animationDelay: "0.4s"}}>
                    From the romantic streets of Paris to the alpine peaks...
                </p>

                <div className="country-grid">
                    {regionCountries.map((country,index)=>(
                        <CountryCard
                            key={index}
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