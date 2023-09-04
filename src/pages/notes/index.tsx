import { useRouter } from "next/router";
import { useEffect } from "react";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.route === "/notes") {
      // Redirect to today's date when the URL is just /notes
      const today = new Date().toISOString().split("T")[0];
      router.push(`/notes/${today}`);
    }
  }, []);

  return null;
};

export default Index;
