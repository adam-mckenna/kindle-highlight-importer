"use client";
import { useHighlightsContext } from "../context";

const Results = () => {
  const { highlights } = useHighlightsContext();

  return <main>{highlights}</main>;
};

export default Results;
