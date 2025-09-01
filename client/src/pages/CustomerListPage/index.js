import { Link } from "react-router-dom"
import { CustomerListContainer, AppLogoImg} from "styledComponents.js"
import {Logo} from "../assets/Qwipo_logo_img.png"

const CustomerListPage = ()=>{
    return <CustomerListContainer>
        <AppLogoImg src={Logo} alt="Qwipo"/>
    </CustomerListContainer>
}

export default CustomerListPage