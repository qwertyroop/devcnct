// app/[username]/edit/page.tsx
import dbConnect from '@/lib/connectDB';
import { PortfolioModel } from '@/models/User.model';
import { PortfolioType } from '@/types/portfolioType';
import EditProfileForm from '@/components/EditProfileForm';

export default async function EditProfile({
  params: { username },
}: {
  params: { username: string };
}) {
  await dbConnect();
  const user = (await PortfolioModel.findOne({ username }).lean()) as
    PortfolioType | null;

  if (!user) {
    return (
      <div>
        <h1>User Not Found</h1>
      </div>
    );
  }

  return <EditProfileForm user={user} username={username} />;
}