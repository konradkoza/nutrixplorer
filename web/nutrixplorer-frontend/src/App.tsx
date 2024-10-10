import { useState } from "react";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <button onClick={() => setCount((count) => count + 1)}>
                count is {count}
            </button>
            {import.meta.env.VITE_SECRET_NUMBER}
        </>
    );
}

export default App;
