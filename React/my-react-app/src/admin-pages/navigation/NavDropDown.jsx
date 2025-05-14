import {useState, useEffect} from "react";
import { Link, useLocation } from "react-router-dom";
import "../../assets/App.css";
import { LogoutRounded } from "@mui/icons-material";


function DropDownMenu({titulli, data, className = ""}){

    const [dropDownOpen, setDropDownOpen] = useState(false);
    const location = useLocation();

    const handleMouseEnter = () => setDropDownOpen(true);
    const handleMouseLeave = () => setDropDownOpen(false);

    useEffect(() => {
        setDropDownOpen(false);
    }, [location]);

    return(
        <div className={`dropdown ${className}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <button id='dropDownBtn' className="btn btn-secondary dropdown-toggle" type="button">{titulli}
                <span className="caret"></span></button> 
                {dropDownOpen && (
                    <ul className="dropdown-menu">
                    {data.map((item, index) => (
                        <li id="liDropDown" key={index}>
                            {item.path ? (
                            <Link className='customLink' to={item.path}>{item.label}</Link>
                        ) : item.onClick ? (
                            <a onClick={item.onClick} className="customLink logoutDropDownA">
                                <LogoutRounded sx={{height:"22px", marginRight:"5px"}}> </LogoutRounded>

                                {item.label}
                            </a>
                            ) : null}    
                            </li>
                    ))}
                    </ul>
                )}  
                
        </div>   
    );
}   
export default DropDownMenu;