import React, { useState } from "react";
import Image from "next/image";

interface IMember {
  name: string;
  phone_num: number;
  address: string;
  email: string;
}

interface ProfileSectionProps {
  profile: IMember;
  onUpdate: (updatedProfile: IMember) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  profile,
  onUpdate,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formValues, setFormValues] = useState(profile);

  const handleEditClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onUpdate(formValues);
    handleClosePopup();
  };

  return (
    <div className="border p-4 rounded-lg shadow-lg mb-8">
      <div className="flex items-center mb-4">
        <div className="relative w-20 h-20 rounded-full overflow-hidden">
          <Image
            src="/pandaprofile.png"
            alt="Profile Image"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
        <div className="ml-4">
          <p className="text-xl font-semibold">{profile.name}</p>
          <p>{profile.phone_num}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <p>이메일: {profile.email}</p>
        <p>배송지: {profile.address}</p>
      </div>
      <button
        className="bg-lime-600 text-white px-4 py-2 rounded"
        onClick={handleEditClick}
      >
        수정
      </button>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">회원정보 수정</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium">
                  이름
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formValues.name}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="phone_num"
                  className="block text-sm font-medium"
                >
                  전화번호
                </label>
                <input
                  type="text"
                  id="phone_num"
                  name="phone_num"
                  value={formValues.phone_num}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium">
                  주소
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formValues.address}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium">
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleClosePopup}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
