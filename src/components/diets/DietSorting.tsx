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
    label: "Popularidade",
    description: "As mais populares primeiro",
  },
  {
    value: "recommendation" as const,
    label: "Recomendadas",
    description: "Recomendadas pra você pela IA",
  },
  {
    value: "alphabetical" as const,
    label: "A-Z",
    description: "Ordem alfabética",
  },
  {
    value: "recent" as const,
    label: "Recentes",
    description: "As mais recentes primeiro",
  },
];

export function DietSorting({ value, onChange }: DietSortingProps) {
  const currentOption = sortOptions.find((option) => option.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          <ArrowUpDown className="h-4 w-4 mr-2" />
          Ordenar por: {currentOption?.label}
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
