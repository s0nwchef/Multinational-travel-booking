const API_URL = "http://localhost:3000/api/destinations";

export const getDestinations = async () => {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("fetch destination that bai");
        }

        return await response.json();
    } catch (error) {
        console.error("Loi API destination:", error);
        return [];
    }
};