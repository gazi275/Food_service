import { Loader2, LocateIcon, Mail, MapPin, MapPinnedIcon, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FormEvent, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/useUserStore";

const Profile = () => {
  const { user, updateProfile } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    address: user?.address || "",
    city: user?.city || "",
    country: user?.country || "",
  });
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState(user?.profilePicture || "");

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        alert("Invalid file type. Please upload a JPEG, PNG, or GIF image.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const updateProfileHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("fullname", profileData.fullname);
      formData.append("email", profileData.email);
      formData.append("address", profileData.address);
      formData.append("city", profileData.city);
      formData.append("country", profileData.country);
      if (imageRef.current?.files?.[0]) {
        formData.append("profilePicture", imageRef.current.files[0]);
      }

      await updateProfile(formData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Profile update failed:", error);
    }
  };

  return (
    <form onSubmit={updateProfileHandler} className="max-w-7xl mx-auto my-5">
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Profile Picture Section */}
        <div className="relative w-28 h-28 md:w-40 md:h-40">
          <Avatar className="w-full h-full rounded-full overflow-hidden border-2 border-gray-300 shadow-md">
            <AvatarImage src={selectedProfilePicture || "/path-to-default-avatar.png"} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <input
            ref={imageRef}
            className="hidden"
            type="file"
            accept="image/*"
            onChange={fileChangeHandler}
          />
          <div
            onClick={() => imageRef.current?.click()}
            className="absolute bottom-2 right-2 w-10 h-10 bg-orange flex items-center justify-center rounded-full cursor-pointer shadow-md hover:bg-hoverOrange transition duration-300"
          >
            <Plus className="text-white w-6 h-6" />
          </div>
        </div>

        {/* Full Name Section */}
        <div className="w-full md:w-auto">
          <Label htmlFor="fullname" className="text-gray-600 font-medium">
            Full Name
          </Label>
          <Input
            id="fullname"
            type="text"
            name="fullname"
            value={profileData.fullname}
            onChange={changeHandler}
            className="font-bold text-xl md:text-2xl border-gray-300 shadow-sm rounded-md focus:ring-orange focus:border-orange"
          />
        </div>
      </div>

      {/* Input Fields Section */}
      <div className="grid md:grid-cols-4 gap-6 my-10">
  {[
    { label: user?.email, icon: Mail, name: "email", disabled: true },
    { label: user?.address, icon: LocateIcon, name: "address" },
    { label: user?.city, icon: MapPin, name: "city" },
    { label: user?.country, icon: MapPinnedIcon, name: "country" },
  ].map((field, index) => (
    <div
      key={index}
      className={`relative flex flex-col gap-2 rounded-lg shadow-md p-4 ${
        field.disabled ? "bg-gray-100" : "bg-white"
      } hover:shadow-lg transition-shadow duration-300`}
    >
      <Label className="text-gray-500 text-sm font-semibold">{field.label}</Label>
      <div className="flex items-center gap-3">
        <field.icon className="text-gray-400 w-5 h-5" />
        <input
          name={field.name}
          value={profileData[field.name as keyof typeof profileData]}
          onChange={changeHandler}
          disabled={field.disabled}
          placeholder={`Enter ${field.label}`}
          className={`w-full bg-transparent text-gray-700 border-0 focus:ring-orange focus:ring-1 focus:outline-none ${
            field.disabled ? "cursor-not-allowed text-gray-400" : ""
          }`}
        />
      </div>
    </div>
  ))}
</div>


      {/* Submit Button */}
      <div className="text-center">
        {isLoading ? (
          <Button disabled className="bg-orange hover:bg-hoverOrange">
            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit" className="bg-orange hover:bg-hoverOrange shadow-md">
            Update Profile
          </Button>
        )}
      </div>
    </form>
  );
};

export default Profile;
