let PATH = {
    URL_SERVER: "http://127.0.0.1:3001/",
    IMAGES: "",
    MATERIAL: "",
}

PATH = {
    ...PATH,
    IMAGES: PATH.URL_SERVER + "uploads/",
    MATERIAL: PATH.URL_SERVER + "uploads/material/",
}

export default PATH