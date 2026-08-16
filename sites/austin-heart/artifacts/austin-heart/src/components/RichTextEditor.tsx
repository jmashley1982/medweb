import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const execCommand = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    handleInput();
    editorRef.current?.focus();
  };

  return (
    <div className="border border-input rounded-md overflow-hidden bg-white flex flex-col">
      <div className="flex items-center gap-1 border-b border-input p-1 bg-gray-50 flex-wrap">
        <Button variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); execCommand("bold"); }} className="h-8 px-2 font-bold">B</Button>
        <Button variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); execCommand("italic"); }} className="h-8 px-2 italic">I</Button>
        <Button variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); execCommand("underline"); }} className="h-8 px-2 underline">U</Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); execCommand("formatBlock", "H1"); }} className="h-8 px-2 font-bold">H1</Button>
        <Button variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); execCommand("formatBlock", "H2"); }} className="h-8 px-2 font-bold">H2</Button>
        <Button variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); execCommand("formatBlock", "H3"); }} className="h-8 px-2 font-bold">H3</Button>
        <Button variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); execCommand("formatBlock", "P"); }} className="h-8 px-2">P</Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); execCommand("insertUnorderedList"); }} className="h-8 px-2">UL</Button>
        <Button variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); execCommand("insertOrderedList"); }} className="h-8 px-2">OL</Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button variant="ghost" size="sm" onClick={(e) => { 
          e.preventDefault(); 
          const url = prompt("Enter link URL:");
          if (url) execCommand("createLink", url);
        }} className="h-8 px-2">Link</Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="p-4 min-h-[300px] prose max-w-none focus:outline-none"
        onInput={handleInput}
        onBlur={handleInput}
        data-placeholder={placeholder}
      />
    </div>
  );
}
