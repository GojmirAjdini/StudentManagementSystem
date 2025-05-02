import {useState, useEffect} from "react";
import { Link, useLocation } from "react-router-dom";
import "../../assets/App.css";

function DropDownMenu({titulli, data}){

    const [dropDownOpen, setDropDownOpen] = useState(false);
    const location = useLocation();

    const handleMouseEnter = () => setDropDownOpen(true);
    const handleMouseLeave = () => setDropDownOpen(false);

    useEffect(() => {
        setDropDownOpen(false);
    }, [location]);

    return(
        <div className="dropdown" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <button id='dropDownBtn' className="btn btn-secondary dropdown-toggle" type="button">{titulli}
                <span className="caret"></span></button> 
                {dropDownOpen && (
                    <ul className="dropdown-menu">
                    {data.map((item, index) => (
                        <li id="liDropDown" key={index}>
                            <Link className='customLink' to={item.path}>{item.label}</Link>
                        </li>
                    ))}
                    </ul>
                )}    
        </div>   
    );
}
export default DropDownMenu;