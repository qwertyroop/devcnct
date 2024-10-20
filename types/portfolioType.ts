export type PortfolioType = {
    username: string;
    email: string;
    fullName: string;
    bio: string;
    workExperience?: workExperience[];
    education: string;
    skills: String[];
    projects: ProjectType[];
    hackathons?: HackathonType[];
}

export type HackathonType = {
    date : Date;
    title : String,
    description : String,
    location : String,
    skills : String[];
}

export type ProjectType = {
    imageURL? : String,
    date : Date,
    skills : String[],
    link : String,
    githubRepository? : String
}

export type Education = {
    universityLogo? : String,
    universityName : String,
    startDate : String,
    endDate : String,
    location : String,
    course : String
}


export type workExperience = {
    companyLogo? : String,
    companyName : String,
    startDate : String,
    endDate : String,
    role : String
}