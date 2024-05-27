export function createChunks(API, file: File) {
    const chunkSize = 1024 * 1024 * 10; // Taille de chaque chunk (10MB dans cet exemple)
    const totalChunks = Math.ceil(file.size / chunkSize);
    const uploadId = Date.now();


}