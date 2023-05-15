"use client";
import { FormEvent, useState } from "react";

import { useRouter } from "next/navigation";

import { useClippingsContext } from "../context";

const Home = () => {
  const router = useRouter();

  const [files, setFiles] = useState<FileList | null>(null);

  const { setRawClippings } = useClippingsContext();

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const reader = new FileReader();
    reader.onloadend = async ({ target }) => {
      if (!target) return;
      await setRawClippings(target.result as string);
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
        Import <code>My Clippings.txt</code>
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
