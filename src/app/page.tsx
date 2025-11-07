import Image from "next/image";
import Header from "../components/Header";
import GardenArea from "../components/GardenArea";
import PlantLibrary from "../components/PlantLibrary";

export default function Home() {
  return (
    <div>
      <Header />
      <main>
        <GardenArea />
      </main>
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
