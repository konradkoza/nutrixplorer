import { RotatingLines } from "react-loader-spinner";

const Spinner = () => {
    return (
        <div className="flex h-[90vh] w-full items-center justify-center">
            <RotatingLines
                visible={true}
                width="96"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
            />
        </div>
    );
};

export default Spinner;
