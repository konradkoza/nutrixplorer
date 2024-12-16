type LabeledTextProps = {
    label: string;
    text: string;
};

const LabeledText = ({ label, text }: LabeledTextProps) => {
    return (
        <div className="py-2">
            <b>{label}</b>
            <p>{text}</p>
        </div>
    );
};

export default LabeledText;
