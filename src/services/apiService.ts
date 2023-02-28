import axios from 'axios';

//const apiUrl = "https://mvai.qa.onroadvantage.com/api/analyse";
// const apiUrl = "http://localhost:3000/upload-file";
const apiUrl = "https://node.nethub.co.za//upload-file";

interface IVideoUploadRequestArgs {
  models: string
  fps: number
  orientation: string
  file: File
}

export function uploadVideo(
  {models, fps, orientation, file}: IVideoUploadRequestArgs, 
  onProgress: (percent: number) => void,
  onCompleted: (data: any) => void,
  onError: (error: string) => void

){
  var data = new FormData();
  data.append('file', file);

  var config = {
    onUploadProgress: function(progressEvent: any) {
      var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
      console.log("upload progress:", percentCompleted);
      onProgress(percentCompleted);
    },
  };

  axios.post(`${apiUrl}?models=${models}&fps=${fps}&orientation=${orientation}`, data, config)
    .then(function (res) {
      onCompleted(res.data);
    })
    .catch(function (err) {
      onError(err.message);
    })
  ;
}
