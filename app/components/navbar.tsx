"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "../utils/cn";
import {handleLoginClick} from "./Login/googleLogin"

export function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />
      
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-sm mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Explore">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/web-dev">Web Development</HoveredLink>
            <HoveredLink href="/interface-design">Interface Design</HoveredLink>
            <HoveredLink href="/seo">Search Engine Optimization</HoveredLink>
            <HoveredLink href="/branding">Branding</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Blogs">
          <div className="  text-sm grid grid-cols-2 gap-10 p-4">
            <ProductItem
              title="Read Blogs"
              href="/pages/readblog"
              src="/mona_lisa.jpeg"
              description="Explore a blog that takes you on a journey through unique perspectives and engaging narratives."
            />
            <ProductItem
              title="Write your own blog"
              href="/pages/createblog"
              src="/olaman.jpeg"
              description="Craft your own blog that embodies a fresh perspective and weaves captivating narratives."
            />
            <ProductItem
              title="Follow us"
              href="https://gomoonbeam.com"
              src="/paint.jpeg"
              description="Follow us on social media for more updates and engaging content!"
            />
            <ProductItem
              title="Feedback"
              href="https://userogue.com"
              src="/design.jpeg"
              description="Share your feedback with us; we'd love to hear from you!"
            />
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="LogIn">
          <div className="flex flex-col space-y-4 text-sm ">
            <button onClick={handleLoginClick}>Login with Google</button>
            
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}
