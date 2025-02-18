// frontend/src/utils/formatDate.js
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
        return "Invalid Date";
    }
    return date.toLocaleDateString(); // Or any other desired format
};