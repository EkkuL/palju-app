import config from '../../config'


const Api = {
    fetchInstances(callback) {
        console.log("Fetch")
        fetch('http://' + config.websocketAddress + '/instances')
        .then((response) => response.json())
        .then((responseJson) => {
          callback(responseJson);
        })
        .catch((error) => {
            console.error(error);
        });
    }
}

export default Api;