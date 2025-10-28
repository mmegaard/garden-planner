import * as React from "react";
import { Button } from "@radix-ui/themes";
import { Plus } from "react-feather";

function Header() {
  return (
    <header className="w-full flex 1 flex-row-reverse">
      <Button className="inline-block" variant="soft">
        Add New Container
        <Plus />
      </Button>
    </header>
  );
}

export default Header;
