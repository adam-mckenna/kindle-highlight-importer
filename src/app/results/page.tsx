"use client";
import { useEffect, useState } from "react";
import { useHighlightsContext } from "../context";

const Results = () => {
  const { highlights } = useHighlightsContext();

  const [clippings, setClippings] = useState<any>();

  const [books, setBooks] = useState<any>();

  const transformRawHighlights = async (highlights: string) => {
    const clippings = highlights
      .split("==========")
      .map((clipping) => clipping.trim());
    setClippings(
      clippings.map((clipping) => {
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
          date = textSplit[1]
            .split("|")[2]
            .trim()
            .split(" ")
            .slice(2)
            .join(" ");
        }
        const content = textSplit[2];
        return {
          book,
          category,
          date,
          content,
          location,
        };
      })
    );
  };

  useEffect(() => {
    transformRawHighlights(highlights);
  }, [highlights]);

  useEffect(() => {
    if (clippings) {
      organiseClippingsIntoBooks();
    }
  }, [clippings]);

  useEffect(() => {
    console.log(books);
  }, [books]);

  const organiseClippingsIntoBooks = () => {
    let books: any = [
      ...new Set(
        clippings
          .map((clipping: { book: any }) => clipping.book)
          .filter((element: undefined) => element !== undefined)
      ),
    ];
    books = books.map((book: any) => {
      const bookClippings = clippings.filter(
        (clipping: any) => clipping.book === book
      );
      const highlights = bookClippings.filter(
        ({ category }: any) => category === "Highlight"
      );
      const notes = bookClippings.filter(
        ({ category }: any) => category === "Note"
      );
      const bookmarks = bookClippings.filter(
        ({ category }: any) => category === "Bookmark"
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
        books.map(({ book, highlights }: any) => (
          <div key={book}>
            <h2>
              <strong>{book}</strong>
            </h2>{" "}
            <br />
            {highlights.map((highlight: string) => (
              <p key={highlight}>
                {highlight.content} <br /> <br />
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
