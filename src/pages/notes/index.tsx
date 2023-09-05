import { useRouter } from "next/router";
import { useEffect } from "react";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.route === "/notes") {
      const today = new Date().toISOString().split("T")[0] || "";
      (async () => {
        await router.push(`/notes/${today}`);
      })();
    }
  }, [router]);

  return null;
};

export default Index;
