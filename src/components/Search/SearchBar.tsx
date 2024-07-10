"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Corrected import
import { Input, Tooltip } from "@nextui-org/react";
import { getRanking } from "./action";

interface IScore {
  keyword: string;
  score: number;
}

const SearchBar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<IScore[]>([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      router.push(`/list?name=${encodeURIComponent(searchQuery)}`);
    }
  };

  const fetchRankingData = async () => {
    try {
      const result = await getRanking(); // Assuming getRanking is your async function
      setData(result);
    } catch (error) {
      console.error("Error fetching ranking data:", error);
    }
  };

  useEffect(() => {
    // Fetch initial data
    fetchRankingData();

    // Set interval to fetch data every 30 seconds
    const interval = setInterval(() => {
      fetchRankingData();
    }, 5000); // 30000 milliseconds = 30 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const getRankingContent = () => {
    return (
      <div className="px-1 py-2 w-[720px] flex flex-col gap-3">
        <p className="text-xl font-bold text-center">실시간 인기 검색어</p>
        {data.map((item: IScore, index: number) => (
          <div key={index} className="flex flex-row gap-2 px-5 text-lg">
            <p>{index + 1}</p>
            <p>{item.keyword}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <form
      className="flex items-center justify-between gap-4 bg-gray-100 p-2 rounded-md flex-1"
      onSubmit={handleSearchSubmit}
    >
      <Tooltip content={getRankingContent()} placement="bottom">
        <div className="w-full">
          <Input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            name="name"
            placeholder="Search"
            className="flex-1 bg-transparent outline-none w-full"
          />
        </div>
      </Tooltip>
      <button
        type="submit"
        className="btn bg-lime-600 text-white px-4 py-2 rounded-md"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
