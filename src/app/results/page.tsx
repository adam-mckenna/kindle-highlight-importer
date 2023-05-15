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

  const getLocation = (
    category: string,
    clippingSplitByLine: Array<string>
  ) => {
    let location = "";
    if (category === "Note" || category === "Bookmark") {
      const noteSplit = clippingSplitByLine[1].split(" ");
      location = `${noteSplit[4]} ${noteSplit[5]}`;
    }
    return location;
  };

  const getDate = (clippingSplitByLine: Array<string>) => {
    let date = clippingSplitByLine[1]
      .split("|")[1]
      .trim()
      .split(" ")
      .slice(2)
      .join(" ");
    if (!date) {
      date = clippingSplitByLine[1]
        .split("|")[2]
        .trim()
        .split(" ")
        .slice(2)
        .join(" ");
    }
    return date;
  };

  const transformRawClippings = async () => {
    const clippingsSplit: Array<string> = rawClippings
      .split("==========")
      .map((clipping) => clipping.trim());

    const clippings = clippingsSplit.map((clipping) => {
      const clippingSplitByLine = clipping.split(/\r?\n/).filter((n) => n);

      if (!clippingSplitByLine.length) return false;

      const book = clippingSplitByLine[0];
      const category = clippingSplitByLine[1].slice(2).split(" ")[1];
      const location = getLocation(category, clippingSplitByLine);
      const date = getDate(clippingSplitByLine);
      const content = clippingSplitByLine[2];

      return {
        book,
        category,
        date,
        content,
        location,
      };
    });
    setClippings(clippings as Array<Clipping>);
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
