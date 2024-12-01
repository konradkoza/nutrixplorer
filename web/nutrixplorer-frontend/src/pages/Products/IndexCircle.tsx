type CircleRingProps = {
    textInside: string; // Text or letter inside the circle
    borderColor: string; // Border color of the ring
    label: string; // Text displayed below the circle
    size?: number; // Diameter of the circle (default: 100px)
    borderThickness?: number; // Thickness of the ring border (default: 4px)
};

const IndexCircle = ({
    textInside,
    borderColor,
    label,
    size = 100,
    borderThickness = 4,
}: CircleRingProps) => {
    return (
        <div
            className="flex flex-col items-center font-bold"
            style={{
                width: size,
                fontSize: size * 0.4, // Font size relative to circle size
            }}>
            {/* Circle */}
            <div
                className="flex items-center justify-center rounded-full"
                style={{
                    width: size,
                    height: size,
                    border: `${borderThickness}px solid ${borderColor}`,
                }}>
                <span className="font-bold">{textInside}</span>
            </div>
            {/* Label */}
            <span className="mt-2 text-sm">{label}</span>
        </div>
    );
};

export default IndexCircle;
