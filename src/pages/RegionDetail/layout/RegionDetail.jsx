import {useActionData, useParams} from "react-router-dom";
import { countries } from "../../../data/data";
import CountryCard from "../component/CountryCard";
import "../css/RegionDetail.css"
function RegionDetail(){

    const { regionName } = useParams();

    const regionCountries = countries.filter(
        (item)=> item.region === regionName
    );

    return (
        <section className="regiondetail-section">
            <div className="container-regiondetail">

                <div className="breadcrumb">
                    Destinations &gt; {regionName}
                </div>

                <h1>Discover {regionName}'s Best</h1>
                <p className="subtitle">From the romantic streets of Paris to the alpine peaks of Switzerland, explore <br/>
                    curated experiences across the continent's most iconic destinations.</p>

                <div className="country-grid">

                    {regionCountries.map((country,index)=>(
                        <CountryCard key={index} country={country}/>
                    ))}

                </div>

            </div>
        </section>


    );

}

export default RegionDetail;