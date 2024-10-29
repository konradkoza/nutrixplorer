type LabeledTextProps = {
    label: string;
    text: string;
};

const LabeledText = ({ label, text }: LabeledTextProps) => {
    return (
        <>
            <b>{label}</b>
            <p>{text}</p>
        </>
    );
};

export default LabeledText;
