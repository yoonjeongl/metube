import Video from "../models/Video";

/*vVideo.find({}, (error, videos) => {
    if(error){
        return res.render("server-error");
    }
        return res.render("home", {pageTitle: "Home", videos});
}); */

export const home = async(req, res) => {
    const videos = await Video.find({});
    res.render("home", {pageTitle: "Home", videos});    
};

export const watch = (req, res) => {
    const { id } = req.params;
    res.render("watch", {pageTitle: `Watching`});
};
export const getEdit = (req, res) => {
    const { id } = req.params;
    res.render("edit", {pageTitle: `Editing:`});
};
export const postEdit = (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    return res.redirect(`/videos/${id}`);
};