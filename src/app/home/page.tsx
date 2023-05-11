"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useHighlightsContext } from "../../context";

export default function Home() {
  const router = useRouter();

  const [files, setFiles] = useState<FileList | null>(null);

  const { highlights, setHighlights } = useHighlightsContext();

  const handleOnSubmit = async (e: any) => {
    e.preventDefault();

    const reader = new FileReader();
    reader.onloadend = async (e) => {
      if (!e.target) return;

      await setHighlights(e.target.result as string);

      router.push("results");
    };
    if (files) {
      reader.readAsText(files[0]);
    }
  };

  return (
    <main>
      <h1>Import your highlights</h1>
      <p>
        Import your <code>highlights.txt</code>
      </p>
      <form onSubmit={handleOnSubmit}>
        <input
          type="file"
          onChange={(e) => {
            setFiles(e.target.files);
          }}
        />
        <button type="submit">Upload</button>
      </form>
    </main>
  );
}
