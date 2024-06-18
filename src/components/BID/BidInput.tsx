"use client";
import { useState } from "react";
import { Input } from "@nextui-org/react";

const BidInput = async () => {
  <div className="flex items-center mb-4">
    <label
      htmlFor="bid                                                                                          Price"
      className="mr-2"
    >
      입찰:
    </label>
    <Input type="number" id="bidPrice" className="border rounded-md p-2" /> 원
  </div>;
};
export default BidInput;
