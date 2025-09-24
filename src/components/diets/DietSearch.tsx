"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DietSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function DietSearch({
  value,
  onChange,
  placeholder = "Procure por planos...",
}: DietSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange("")}
          className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-gray-100"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Limpar a busca</span>
        </Button>
      )}
    </div>
  );
}
