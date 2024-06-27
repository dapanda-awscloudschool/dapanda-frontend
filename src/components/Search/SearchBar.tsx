"use client"
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
        router.replace(`/list?name=${encodeURIComponent(value)}`);
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
            console.error('Error fetching ranking data:', error);
        }
    };

    useEffect(() => {
        fetchRankingData();
    }, []);

    const getRankingContent = () => {
        return (
            <div className="px-1 py-2 w-[320px] flex flex-col gap-3">
                <p className="text-xl font-bold text-center">Top Ranking</p>
                {data.map((item: IScore, index: number) => (
                    <div key={index} className="flex flex-row gap-2 px-5">
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
            <Tooltip content={getRankingContent()}>
                <Input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    name="name"
                    placeholder="Real-time Search"
                    className="flex-1 bg-transparent outline-none"
                />
            </Tooltip>
            <button type="submit" className="btn">
                Search
            </button>
        </form>
    );
};

export default SearchBar;
