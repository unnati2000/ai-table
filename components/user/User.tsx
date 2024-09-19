import Image from "next/image";

const Avatar = ({ src }: { src: string }) => {
  return (
    <div className="flex items-center justify-center rounded-full bg-ds-table-row-bg-hover">
      <Image src={src} alt="profile" />
    </div>
  );
};

const User = ({
  name,
  email,
  profileImage,
}: {
  name: string;
  email: string;
  profileImage: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <Avatar src={profileImage} />

      <div className="flex flex-col">
        <p className="text-sm">{name}</p>
        <p>{email}</p>
      </div>
    </div>
  );
};

export default User;

