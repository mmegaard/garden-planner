# 🌱 Garden Bud 🌱

I built this app for my wife and I to help us plan our garden for the year. There are many possible ways to go with it but currently you can:

- Add custom containers and plants to the canvas
- Pick from plants in your zone based on their family, their suggested planting date, or their expected maturing date.
- See the spacing guidelines visually and figure out what actually fits in your beds.
- Zoom and pan around to create as large or many gardens as you want

**The plant library 📚** is a filterable list of plants from your zone from Roma Tomatoes to Marigolds. You can filter by plant family (nightshade, brassica, legume, etc.), which month you want to plant, or which month you want to harvest. There's also a search bar for finding specific plants by common or scientific name.

**The canvas 🖌** is where you build your garden. Drop rectangular or circular containers to represent your raised beds and pots, set their dimensions in feet and inches, then drag plants into them. Everything is draggable — plants snap to containers and track their position relative to the bed they're in.

**The properties panel 🕵** lets you select any container and adjust its width, length, and height with precise ft/in inputs.

## Tech Stack

- **Next.js 16** with Turbopack and React 19
- **Convex** for backend data persistence (garden layouts sync to the cloud)
- **Framer Motion** for drag interactions
- **Radix UI** for accessible UI primitives
- **Tailwind CSS 4** for styling
- **Custom SVG plant icons** — 22 hand-configured icon components with per-plant color and scale

## Getting Started

### Prerequisites

- Node.js 18+
- A [Convex](https://www.convex.dev/) account (free tier works)

### Installation

```bash
git clone https://github.com/mmegaard/garden-planner.git
cd garden-planner
npm install
```

### Set up Convex

```bash
npx convex dev
```

This will prompt you to log in and create a project. Convex runs alongside the dev server to handle data persistence.

### Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start planning.

## How To Use It

1. **Add a container** — Click the square or circle icon in the sidebar to select that tool, then click on the canvas to place a raised bed or pot.
2. **Resize it** — Click a container to select it, then use the properties panel to set exact dimensions.
3. **Add plants** — Click any plant in the sidebar to select it as your tool, then click inside a container to place it. Use the filters to narrow down the list.
4. **Move things around** — Hit the Pan button to enter pan mode, then drag containers and plants to rearrange your layout.
5. **Press Escape** — Deselects the current tool and returns to the pointer.

## Plant Data

Each plant in the library includes:

- Common and scientific name
- Plant family (for companion planting and crop rotation)
- Seed depth and spacing requirements
- Outdoor planting window and indoor start dates
- Transplant timing and conditions
- Days to maturity
- Companion plants (friends and foes)
- Height range
- Annual / perennial / biennial lifecycle
- Custom icon with configurable color and scale

All plant data lives in `public/content/data.json` and is tailored for **Zone 8b** (Pacific Northwest).

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── page.tsx            # Main page layout
│   └── layout.tsx          # Root layout with providers
├── components/
│   ├── PlantLibrary/       # Sidebar with search, filters, plant list
│   ├── GardenArea/         # Main canvas with viewport and pan/zoom
│   ├── GardenContainer/    # Raised bed / pot rendering
│   ├── Draggable/          # Generic drag behavior
│   ├── Plant/              # Plant rendering on canvas
│   ├── PlantIcon/          # SVG icon renderer
│   ├── ObjectProperties/   # Properties panel for selected items
│   ├── ObjectProvider/     # Global state for plants, containers, tools
│   └── ViewportProvider/   # Pan, zoom, and coordinate transforms
├── helpers/
│   ├── PlantClasses.ts     # Data models for plants and containers
│   └── Viewport.ts         # Viewport math
convex/
├── schema.ts               # Database schema for layouts
└── layouts.ts              # Backend functions for saving/loading
public/
├── content/data.json       # Plant database (78 plants)
└── icons/                  # 22 SVG plant icon components
```

## Roadmap

- [ ] User authentication so others can plan their own gardens
- [ ] Zone-aware planting dates (currently hardcoded to 8b)
- [ ] Spacing guides that show recommended distance between plants
- [ ] Companion planting warnings when enemies are placed too close
- [ ] Print / export layout
- [ ] Mobile support

## License

This project is for personal use. Reach out if you'd like to use or contribute to it.
