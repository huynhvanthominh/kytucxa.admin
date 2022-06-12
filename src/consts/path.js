let PATH = {
    URL_SERVER: "http://192.168.1.236:3001/",
    IMAGES: "",
    MATERIAL: "",
}

PATH = {
    ...PATH,
    IMAGES: PATH.URL_SERVER + "uploads/",
    MATERIAL: PATH.URL_SERVER + "uploads/material/",
}

export default PATH