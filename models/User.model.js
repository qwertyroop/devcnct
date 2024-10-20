import mongoose, { Schema, model, models } from 'mongoose';

const workExperienceSchema = new Schema({
  companyLogo: { type: String },
  companyName: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  role: { type: String }
});

const educationSchema = new Schema({
  universityLogo: { type: String },
  universityName: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  location: { type: String },
  course: { type: String }
});

const projectSchema = new Schema({
  imageURL: { type: String },
  date: { type: Date },
  skills: { type: [String] },
  link: { type: String },
  githubRepository: { type: String }
});

const hackathonSchema = new Schema({
  date: { type: Date },
  title: { type: String },
  description: { type: String },
  location: { type: String },
  skills: { type: [String] }
});

const portfolioSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  fullName: { type: String},
  bio: { type: String },
  workExperience: { type: [workExperienceSchema] },
  education: { type: String },
  skills: { type: [String] },
  projects: { type: [projectSchema] },
  hackathons: { type: [hackathonSchema] }
}, { timestamps: true });

const PortfolioModel = models.PortfolioModel || model('PortfolioModel', portfolioSchema);
export { PortfolioModel };

