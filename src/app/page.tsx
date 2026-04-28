"use client";
import Image from "next/image";
import Header from "../components/Header";
import GardenArea from "../components/GardenArea";
import PlantLibrary from "../components/PlantLibrary";
import Plant from "../components/Plant";
import ViewportProvider from "../components/ViewportProvider";
import Debug from "../components/Debug/Debug";
import ObjectProvider from "../components/ObjectProvider";
import { useObjectContext } from "../components/ObjectProvider";
import ObjectProperties from "../components/ObjectProperties";
import Toolbar from "../components/Toolbar";
export default function Home() {
  const { selected } = useObjectContext();
  return (
    <div>
      <main
        style={{
          display: "grid",
          gridTemplateColumns: "140px auto",
        }}
      >
        <PlantLibrary />
        <GardenArea />
      </main>
      {selected && <ObjectProperties object={selected} />}
      <Toolbar />
      <footer />
    </div>
  );
}

/*
inches to pixels

when calculating how to repereent boxes in relation to size of the screen,
everything can scale down.

Should probably store a variable with the ratio.

Every box should be rendered as a 
*/
