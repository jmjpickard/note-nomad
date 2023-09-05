import { useRouter } from "next/router";
import { useEffect } from "react";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.route === "/notes") {
      const today = new Date().toISOString().split("T")[0] || "";
      // Create an async function and immediately call it with try...catch
      const handleRouterPush = async () => {
        try {
          await router.push(`/notes/${today}`);
          // This code will be executed after the router push is complete
        } catch (error) {
          // Handle any potential errors here
          console.error("Router push error:", error);
        }
      };

      handleRouterPush();
    }
  }, [router]);

  return null;
};

export default Index;
