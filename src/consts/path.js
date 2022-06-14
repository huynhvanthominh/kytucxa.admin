let PATH = {
    URL_SERVER: "http://localhost:3001/",
    IMAGES: "",
    MATERIAL: "",
}

PATH = {
    ...PATH,
    IMAGES: PATH.URL_SERVER + "uploads/",
    MATERIAL: PATH.URL_SERVER + "uploads/material/",
}

export default PATH