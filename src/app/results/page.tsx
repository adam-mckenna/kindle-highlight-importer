'use client';

import { GetServerSidePropsContext } from "next"

import { useHighlightsContext } from '../../context';

export default function Results() {
    const { highlights, setHighlights } = useHighlightsContext();

    console.log(highlights);

    return (
    <main>
        {highlights}
    </main>
    )
}