/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";

import { useClippingsContext } from "../context";

type Category = "Highlight" | "Note" | "Bookmark";

type Clipping = {
  book: string;
  category: Category;
  date: string;
  content: string;
  location: string;
};

type Book = {
  book: string;
  highlights: Array<Clipping>;
  notes: Array<Clipping>;
  bookmarks: Array<Clipping>;
};

const Results = () => {
  const { rawClippings } = useClippingsContext();

  const [clippings, setClippings] = useState<Array<Clipping>>();

  const [books, setBooks] = useState<Array<Book>>();

  const transformRawClippings = async () => {
    let clippings = rawClippings
      .split("==========")
      .map((clipping) => clipping.trim());

    const sortedClippings = clippings.map((clipping) => {
      const textSplit = clipping.split(/\r?\n/).filter((n) => n);

      if (!textSplit.length) return false;

      const book = textSplit[0];
      const category = textSplit[1].slice(2).split(" ")[1];
      let location = "";
      if (category === "Note" || category === "Bookmark") {
        const noteSplit = textSplit[1].split(" ");
        location = `${noteSplit[4]} ${noteSplit[5]}`;
      }

      let date = textSplit[1]
        .split("|")[1]
        .trim()
        .split(" ")
        .slice(2)
        .join(" ");
      if (!date) {
        date = textSplit[1].split("|")[2].trim().split(" ").slice(2).join(" ");
      }
      const content = textSplit[2];
      return {
        book,
        category: category as Category,
        date,
        content,
        location,
      };
    });
    setClippings(sortedClippings as Array<Clipping>);
  };

  useEffect(() => {
    transformRawClippings();
  }, [rawClippings, transformRawClippings]);

  useEffect(() => {
    if (clippings) {
      organiseClippingsIntoBooks();
    }
  }, [clippings]);

  const organiseClippingsIntoBooks = () => {
    if (!clippings) return;
    let bookStrings: Array<string> = [
      ...new Set(
        clippings
          .map((clipping: { book: string }) => clipping.book)
          .filter((element) => element !== undefined)
      ),
    ];
    const books = bookStrings.map((book: string) => {
      const bookClippings = clippings.filter(
        (clipping) => clipping.book === book
      );
      const highlights = bookClippings.filter(
        ({ category }) => category === "Highlight"
      );
      const notes = bookClippings.filter(({ category }) => category === "Note");
      const bookmarks = bookClippings.filter(
        ({ category }) => category === "Bookmark"
      );
      return {
        book,
        highlights,
        notes,
        bookmarks,
      };
    });
    setBooks(books);
  };

  return (
    <main>
      {books && books.length ? (
        books
          .filter((book) => (book.highlights.length ? books : false))
          .map(({ book, highlights }) => (
            <div key={book}>
              <h2>
                <strong>{book}</strong>
              </h2>
              <br />
              {highlights.map(({ content }: Clipping) => (
                <p key={content}>
                  {content} <br /> <br />
                </p>
              ))}
            </div>
          ))
      ) : (
        <></>
      )}
    </main>
  );
};

export default Results;
