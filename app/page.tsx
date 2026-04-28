"use client";
import { useState } from "react";
import BootScreen from "@/components/BootScreen";
import IDELayout from "@/components/IDE/IDELayout";

export default function Home() {
  const [booted, setBooted] = useState(false);

  return (
    <>
      <BootScreen onComplete={() => setBooted(true)} />
      {booted && <IDELayout />}
    </>
  );
}
