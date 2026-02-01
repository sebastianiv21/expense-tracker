"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TransactionSearchProps {
  value: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function TransactionSearch({
  value,
  onSearch,
  placeholder = "Search transactions...",
  className,
}: TransactionSearchProps) {
  const [inputValue, setInputValue] = useState(value);

  // Debounce the search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== value) {
        onSearch(inputValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, onSearch, value]);

  // Sync with external value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleClear = useCallback(() => {
    setInputValue("");
    onSearch("");
  }, [onSearch]);

  return (
    <div className={cn("relative flex-1", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a89580]" />
      <Input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="pl-10 pr-10 bg-[#1f1815] border-[#2d2420] text-[#f5f2ed] placeholder:text-[#a89580]/50 focus:border-[#c97a5a] focus:ring-[#c97a5a]/20"
      />
      {inputValue && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-[#a89580] hover:text-[#f5f2ed] hover:bg-transparent"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
