type CircleRingProps = {
    textInside: string;
    borderColor: string;
    label: string;
    size?: number;
    borderThickness?: number;
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
                fontSize: size * 0.4,
            }}>
            <div
                className="flex items-center justify-center rounded-full"
                style={{
                    width: size,
                    height: size,
                    border: `${borderThickness}px solid ${borderColor}`,
                }}>
                <span className="font-bold">{textInside}</span>
            </div>
            <span className="mt-2 text-sm">{label}</span>
        </div>
    );
};

export default IndexCircle;
