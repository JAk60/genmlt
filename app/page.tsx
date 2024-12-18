// "use client";
import { Toaster } from "@/components/ui/toaster"
import CheckBoxForm from "@/components/CheckBoxForm";
// import Navbar from "@/components/Navbar";
// import Paragraphs from "./Paragraphs";

export default function Home() {
  return (
    <div>
      {/* <Navbar /> */}
      <CheckBoxForm />
	  <Toaster />
    </div>
  );
}

