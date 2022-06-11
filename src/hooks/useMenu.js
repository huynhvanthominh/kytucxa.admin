import { useContext } from "react"
import MenuContext from "../contexts/menu"

const useMenu = () => {
    return useContext(MenuContext);
}

export default useMenu;