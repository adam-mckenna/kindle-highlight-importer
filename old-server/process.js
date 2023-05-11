var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fs = require("fs");

process.on("uncaughtException", (err) => {
  console.log(err);
});

const convertRawFileToText = async (file) => {
  const rawFile = new XMLHttpRequest();
  let text;
  await rawFile.open("GET", file, false);
  rawFile.onreadystatechange = () => {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        text = rawFile.responseText;
      }
    }
  };
  await rawFile.send(null);
  return text;
};

const transformRawHighlights = async (file) => {
  const text = await convertRawFileToText(file);

  const clippings = text.split("==========").map((clipping) => clipping.trim());
  return clippings.map((clipping) => {
    const textSplit = clipping.split(/\r?\n/).filter((n) => n);

    if (!textSplit.length) return false;

    const book = textSplit[0];
    const category = textSplit[1].slice(2).split(" ")[1];
    let location = "";
    if (category === "Note" || category === "Bookmark") {
      const noteSplit = textSplit[1].split(" ");
      location = `${noteSplit[4]} ${noteSplit[5]}`;
    }

    let date = textSplit[1].split("|")[1].trim().split(" ").slice(2).join(" ");
    if (!date) {
      date = textSplit[1].split("|")[2].trim().split(" ").slice(2).join(" ");
    }
    const content = textSplit[2];
    return {
      book,
      category,
      date,
      content,
      location,
    };
  });
};

const exportHighlightsToFile = (clippings) => {
  fs.mkdir("output", (err) => {
    if (err) throw err;
  });

  const books = [
    ...new Set(
      clippings
        .map((clipping) => clipping.book)
        .filter((element) => element !== undefined)
    ),
  ];

  books.forEach((book) => {
    const bookClippings = clippings.filter(
      (clipping) => clipping.book === book
    );
    const highlights = bookClippings.filter(
      ({ category }) => category === "Highlight"
    );
    const notes = bookClippings.filter(
      ({ category}) => category === "Note"
    );
    const bookmarks = bookClippings.filter(
      ({ category }) => category === "Bookmark"
    );

    if (highlights.length || notes.length) {
      const stream = fs.createWriteStream(`output/${book}.txt`);
      stream.once("open", () => {
        if (highlights.length) {
          stream.write(`~~Highlights~~ \n\n`);
          highlights.forEach(({ content }) => {
            if (!content) return;
            stream.write(`"${content.trim()}" \n\n`);
          });
        }
        if (notes.length) {
          stream.write(`~~Notes~~ \n\n`);
          notes.forEach(({ content, location }) => {
            if (!content) return;
            stream.write(`${location.trim()}: "${content.trim()}" \n\n`);
          });
        }
        if (bookmarks.length) {
          stream.write(`~~Bookmarks~~ \n\n`);
          bookmarks.forEach(({ location }) => {
            stream.write(`${location.trim()} \n\n`);
          });
        }
        stream.end();
      });
    }
  });
};

transformRawHighlights(
  "file:///Users/adammckenna/Projects/kindle-converter/highlights/highlights.txt"
).then((data) => {
  exportHighlightsToFile(data);
});
