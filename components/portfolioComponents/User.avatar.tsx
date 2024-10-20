import {Avatar} from "@nextui-org/avatar";

export default function UserAvatar({profileImage} : {profileImage: string}) {
  return (
    <div className="flex gap-4 items-center">
      
      <Avatar isBordered radius="lg" src={profileImage} />
      
    </div>
  );
}