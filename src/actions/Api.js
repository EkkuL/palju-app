import config from '../../config'


const Api = {
    fetchInstanceList(callback) {
        console.log("Fetch")
        fetch('http://' + config.websocketAddress + '/instances')
        .then((response) => response.json())
        .then((responseJson) => {
          callback(responseJson);
        })
        .catch((error) => {
            console.error(error);
        });
    },


    // Return promise
    fetchInstances(dates, callback) {
        console.log("fetchInstances")
        console.log(dates)
        Promise.all(dates.map(d => Api.fetchInstance(d.start, d.end))) 
        .then((responses) => Promise.all(
          responses.map(r => r.json())
        ))
        .then(data => {
          callback(data);
        })
        .catch((error) => {
            console.error(error);
        });

    },

    fetchInstance(start, end) {
        console.log('http://' + config.websocketAddress + '/instances/' + start + '/' + end)
        return fetch('http://' + config.websocketAddress + '/instances/' + start + '/' + end);
    }
}

export default Api;