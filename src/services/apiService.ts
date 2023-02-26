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

export async function uploadVideo({models, fps, orientation, file}: IVideoUploadRequestArgs){
    return await axios.postForm(`${apiUrl}?models=${models}&fps=${fps}&orientation=${orientation}`, {
        'file': file
        // 'file': document.querySelector('#fileInput').files[0]
    });
}

// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
// axios.defaults.withCredentials = true




export function uploadVideo2(
  {models, fps, orientation, file}: IVideoUploadRequestArgs, 
  // onMessage:(msg: string, data: any) => void,
  onProgress: (percent: number) => void,
  onCompleted: (data: any) => void,
  onError: (error: string) => void

){
  console.log("uploadVideo2 got data", {models, fps, orientation, file});

  // 'Access-Control-Allow-Origin' header
  
  var data = new FormData();
  // data.append('foo', 'bar');
  data.append('file', file);

  var config = {
    onUploadProgress: function(progressEvent) {
      var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
      console.log("upload progress:", percentCompleted);
      onProgress(percentCompleted);
    },
    headers:{
      // 'Access-Control-Allow-Origin':'*',
      // 'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      // 'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
    },
    // withCredentials: false,
  };

  axios.post(`${apiUrl}?models=${models}&fps=${fps}&orientation=${orientation}`, data, config)
    .then(function (res) {
      // output.className = 'container';
      // output.innerHTML = res.data;
      onCompleted(res.data);
    })
    .catch(function (err) {
      // output.className = 'container text-danger';
      // output.innerHTML = err.message;
      onError(err.message);
    })
  ;
}




// (function () {
//     var output = document.getElementById('output');
//     document.getElementById('upload').onclick = function () {
//       var data = new FormData();
//       data.append('foo', 'bar');
//       data.append('file', document.getElementById('file').files[0]);

//       var config = {
//         onUploadProgress: function(progressEvent) {
//           var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
//         }
//       };

//       axios.put('/upload/server', data, config)
//         .then(function (res) {
//           output.className = 'container';
//           output.innerHTML = res.data;
//         })
//         .catch(function (err) {
//           output.className = 'container text-danger';
//           output.innerHTML = err.message;
//         });
//     };
//   })();