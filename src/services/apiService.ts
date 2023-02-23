import axios from 'axios';

const apiUrl = "https://mvai.qa.onroadvantage.com";

interface IVideoUploadRequestArgs {
    models: string
    fps: string
    orientation: string
    file: File
}

export async function uploadVideo({models, fps, orientation, file}: IVideoUploadRequestArgs){
    return await axios.postForm(`${apiUrl}/api/analyse?models=${models}&fps=${fps}&orientation=${orientation}`, {
        'file': file
        // 'file': document.querySelector('#fileInput').files[0]
    });
}