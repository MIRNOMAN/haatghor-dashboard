import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  debounceMs?: number;
}

export function SearchBar({ 
  placeholder = "Search...", 
  onSearch,
  debounceMs = 300 
}: SearchBarProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, onSearch, debounceMs]);

  return (
    <div className="relative w-full md:w-96">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
