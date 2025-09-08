"use client";

import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SortOption } from "@/app/(app)/diets/page";

interface DietSortingProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptions = [
  {
    value: "popularity" as const,
    label: "Popularity",
    description: "Most popular diets first",
  },
  {
    value: "recommendation" as const,
    label: "Recommended",
    description: "AI recommended for you",
  },
  {
    value: "alphabetical" as const,
    label: "A-Z",
    description: "Alphabetical order",
  },
  {
    value: "recent" as const,
    label: "Recently Added",
    description: "Newest diets first",
  },
];

export function DietSorting({ value, onChange }: DietSortingProps) {
  const currentOption = sortOptions.find((option) => option.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          <ArrowUpDown className="h-4 w-4 mr-2" />
          Sort by: {currentOption?.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className="flex flex-col items-start space-y-1 p-3"
          >
            <div className="font-medium">{option.label}</div>
            <div className="text-xs text-gray-500">{option.description}</div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
