"use client";
import { FormEvent, useState } from "react";

import { useRouter } from "next/navigation";

import { useHighlightsContext } from "../context";

const Home = () => {
  const router = useRouter();

  const [files, setFiles] = useState<FileList | null>(null);

  const { setHighlights } = useHighlightsContext();

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const reader = new FileReader();
    reader.onloadend = async ({ target }) => {
      if (!target) return;

      await setHighlights(target.result as string);

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
          onChange={({ target }) => {
            setFiles(target.files);
          }}
        />
        <button type="submit">Upload</button>
      </form>
    </main>
  );
};

export default Home;
