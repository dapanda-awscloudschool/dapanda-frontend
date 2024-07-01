"use client";

import { Select, SelectItem } from "@nextui-org/react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

const Filter = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [filter, setFilter] = useState("recent");
  //const [ofilter, setOFilter] = useState("old");

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    const params = new URLSearchParams(searchParams);

    // Handle filter change based on selected value
    if (value.includes("cost")) {
      //console.log("filter");
      const [key, order] = value.split(":");
      params.set(key, order);
      //params.set("sort", "cost"); // Set "sort" to "cost" for consistency
    } else if (value === "bidders" || value === "views") {
      params.set("sort", value);
      params.delete("cost"); // Remove "cost" param if present
    } else {
      params.set("sort", value);
      params.delete("cost"); // Remove "cost" param if present
    }
    //Handle the filter change based on the selected value

    replace(`${pathname}?${params.toString()}`);
    setFilter(value);
    //setOFilter(value);
  };

  const filterOptions = [
    { label: "높은 가격순", value: "asc" },
    { label: "낮은 가격순", value: "desc" },
    { label: "최신순", value: "recent" },
    { label: "오래된 순", value: "old" },
    { label: "입찰자 많은순", value: "bidders" },
    { label: "조회수 많은순", value: "views" },
  ];

  return (
    <div className="mt-12 flex justify-end pr-4">
      <Select
        variant={"faded"}
        label="필터"
        onChange={handleFilterChange}
        className="max-w-xs"
        value={filter}
      >
        {filterOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default Filter;
