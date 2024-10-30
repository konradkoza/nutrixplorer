export const getProductImage = async (id: string) => {
    const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/product/${id}/image`
    );
    const imageBlob = await res.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    return imageObjectURL;
};

export const getEnergyIndex = (value: number) => {
    if (value < 100) {
        return "A";
    }
    if (value >= 100 && value <= 200) {
        return "B";
    }
    if (value >= 201 && value <= 300) {
        return "C";
    }
    if (value >= 301 && value <= 500) {
        return "D";
    }
    if (value >= 501 && value <= 700) {
        return "E";
    }
    if (value > 700) {
        return "F";
    }
};
