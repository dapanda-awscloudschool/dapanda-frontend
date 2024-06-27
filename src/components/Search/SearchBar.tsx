"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
const SearchBar = () => {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    if (name) {
      router.push(`/list?name=${name}`);
    }
  };

  return (
    <form
      className="flex ic justify-between gap-4 bg-gray-100 p-2 rounded-md flex-1"
      onSubmit={handleSearch}
    >
       
      <Input
        startContent={<FaSearch/>}
        type="text"
        name="name"
        placeholder="Search"
        className="flex-1 bg-transparent outline-none"
      />
      <Button type="submit">
        검색
      </Button>

    </form>
  );
};

export default SearchBar;
