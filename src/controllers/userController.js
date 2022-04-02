import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", {pageTitle: "Join"});
export const postJoin = async (req, res) => {
    const {name, username, email, password, password2, location} = req.body;
    const pageTitle = "Join";
    const exists = await User.exists({ $or: [{ username }, {email}] });
    if (exists){
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "This username/email is already taken.",
        });
    }
    if (password !== password2){
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "Password confirmation does not match.",
        });
    }
    try{
        await User.create({
            name, username, email, password, password2, location,
        });
        return res.redirect("/login");    
    }catch(error){
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: error._message,
        });
    }
};

export const getLogin = (req, res) => res.render("login", {pageTitle: "Login"});
export const postLogin = async (req, res) => {
    const {username, password} = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({ username, socialOnly: false });
    console.log(user.password);
    if( !user ){
        return res.status(400).render("login", {
            pageTitle, 
            errorMessage: "An account with this username does not exist."
        });
    }
    const ok = await bcrypt.compare(password, user.password);
    if ( !ok ){
        return res.status(400).render("login", {
            pageTitle, 
            errorMessage: "Wrong password"
        });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
    const baseUrl = 'https://github.com/login/oauth/authorize';
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email",
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    console.log(finalUrl);
    return res.redirect(finalUrl);
}

export const finishGithubLogin = async (req, res) => {
    const baseUrl = 'https://github.com/login/oauth/access_token';
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (
        await fetch(finalUrl, {
            method:"POST",
            headers: {
                Accept: "application/json",
            },
        })
    ).json();
//    const json = await data.json();
    if ("access_token" in tokenRequest){
        //access api
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization:`token ${access_token}`,
                },
            })
        ).json();
        console.log(userData);
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization:`token ${access_token}`,
                },
            })
        ).json();
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );
        if (!emailObj) {
            return res.redirect("/login");
        }
        let user = await User.findOne({email: emailObj.email});
        if(!user){
            // create an account
            user = await User.create({
                email:emailObj.email,
                avatarUrl: userData.avatar_url,
                socialOnly: true,
                username:userData.login,
                password: "",
                name: userData.name,
                location:  userData.location,    
            });
        }         
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    } else {
        return res.redirect("/login");
    }
};

export const getEdit = (rep, res) => {
    return res.render("edit-profile", {pageTitle: "Edit Profile"});
}

export const postEdit = async (req, res) => {
    const {session: {
        user: 
            { _id }, 
        },
        body: { name, email, username, location },
    } = req;
    const updatedUser = await User.findByIdAndUpdate(_id, {
        name, email, username, location
    },
    { new: true});
    req.session.user = updatedUser;
    return res.render("edit-profile");
};

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
}
export const see = (req, res) => res.send("See User");