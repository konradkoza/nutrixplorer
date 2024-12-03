import { useState, useEffect } from "react";

const useScreenSize = () => {
    const [screenSize, setScreenSize] = useState("xl");

    useEffect(() => {
        const handleResize = () => {
            const screenSize = window.innerWidth;
            if (screenSize > 1536) {
                setScreenSize("2xl");
            } else if (screenSize > 1280) {
                setScreenSize("xl");
            } else if (screenSize > 1024) {
                setScreenSize("lg");
            } else if (screenSize > 768) {
                setScreenSize("md");
            } else if (screenSize > 640) {
                setScreenSize("sm");
            } else {
                setScreenSize("xs");
            }
        };

        window.addEventListener("resize", handleResize);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return screenSize;
};

export default useScreenSize;
