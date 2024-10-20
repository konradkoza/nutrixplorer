export const getProductImage = async (id: string) => {
    const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/product/${id}/image`
    );
    const imageBlob = await res.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    return imageObjectURL;
};
