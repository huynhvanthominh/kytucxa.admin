import { createContext } from "react";
const initValue = {
    isShow: true,
    setIsShow: () => { }
}
const MenuContext = createContext(initValue);

export default MenuContext;