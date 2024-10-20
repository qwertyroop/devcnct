import dbConnect from '@/lib/connectDB';
import { PortfolioModel } from '@/models/User.model';
import { PortfolioType } from '@/types/portfolioType';
import {Button} from "@nextui-org/button";
import Link from 'next/link';

export default async function UserProfile({ params: { username } }: {
  params: { username: string };
}) {
  // Connect to MongoDB
  await dbConnect();

  // Fetch user by username
  const user = (await PortfolioModel.findOne({ username }).lean()) as PortfolioType | null;

  if (!user) {
    return (
      <div>
        <h1>User Not Found</h1>
      </div>
    );
  }

  return (
    <section>
      {/* <UserAvatar profileImage={user.profileImage || 'defaultImage.png'} /> */}
      <h1>{user.username}'s Profile</h1>
      <p>Email: {user.email}</p>

      <Button>
        <Link href={`/${username}/edit`}> Edit Profile</Link>
      </Button>
      <p>Full Name: {user.fullName}</p>
      <p>Bio: {user.bio}</p>
      {user.workExperience && (
        <ul>
          {user.workExperience.map((experience) => (
            <li key={String(experience.companyName)}>
              <p>Company: {experience.companyName}</p>
              <p>Role: {experience.role}</p>
              <p>Start Date: {experience.startDate}</p>
              <p>End Date: {experience.endDate}</p>
            </li>
          ))}
        </ul>
      )}
      <p>Education: {user.education}</p>
      <p>Skills: {user.skills.join(', ')}</p>
      <ul>
        {user.projects.map((project) => (
          <li key={String(project.link)}>
            <p>Image URL: {project.imageURL}</p>
            <p>Date: {project.date.toLocaleString()}</p>
            <p>Skills: {project.skills.join(', ')}</p>
            <p>Link: {project.link}</p>
            <p>GitHub Repository: {project.githubRepository}</p>
          </li>
        ))}
      </ul>
      {user.hackathons && (
        <ul>
          {user.hackathons.map((hackathon) => (
            <li key={String(hackathon.title)}>
              <p>Date: {hackathon.date.toLocaleString()}</p>
              <p>Title: {hackathon.title}</p>
              <p>Description: {hackathon.description}</p>
              <p>Location: {hackathon.location}</p>
              <p>Skills: {hackathon.skills.join(', ')}</p>
            </li>
          ))}
        </ul>
      )} 
    </section>
  );
}

