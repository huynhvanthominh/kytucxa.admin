import { Link } from "react-router-dom"


export const LinkCustom = ({ children, color, ...props }) => {
    switch (color) {
        case "success":
            color = "#2e7d32";
            break;
        case "white":
            color = "#FFFFFF";
            break;
        default:
            color = ""
            break;
    }
    const linkStype = {
        textDecoration: "none",
        color: color
    }
    return <Link style={linkStype} {...props}>{children}</Link>
}
