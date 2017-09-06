'use strict';
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    return new Promise((resolve,reject)=> {
      response.json()
        .then(json => {
          var error = new Error(json.message || response.statusText);
          error.response = response;
          reject(error);
        })
    })
  }
}

module.exports = {
  checkStatus
};