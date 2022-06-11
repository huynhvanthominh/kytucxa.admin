import { useState } from "react"
import MenuContext from "../contexts/menu"

const MenuProvider = ({ children }) => {

    const [isShow, setIsShow] = useState(true);

    return (
        <MenuContext.Provider value={{
            isShow,
            setIsShow
        }}>
            {children}
        </MenuContext.Provider>
    )
}

export default MenuProvider;