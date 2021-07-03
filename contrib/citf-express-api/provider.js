const danfo = require("danfojs-node")
const malaysiaVaccinationDataCSV = "https://raw.githubusercontent.com/CITF-Malaysia/citf-public/main/vaccination/vax_malaysia.csv"
const stateDataCSV = "https://raw.githubusercontent.com/CITF-Malaysia/citf-public/main/vaccination/vax_state.csv"

module.exports = {
     getMalaysiaVaccinationStatistic({start_date, end_date}) {
        return new Promise(async(resolve, reject) => {
             try {
            let datasets = await danfo.read_csv(malaysiaVaccinationDataCSV)
            
                 if (start_date) {
                                  datasets = datasets.query({ "column": "date", "is": ">=", "to": start_date })

                 }

                 if (end_date) {
                                  datasets = datasets.query({ "column": "date", "is": "<=", "to": end_date })

                 }
        
            let json = await datasets.to_json();
            resolve({
                "status": "success",
                "data" : JSON.parse(json)
            })
        } catch (error) {
            reject({
                "status": "error",
                "message" : error.message
            })
        }
        })
       
    },
     getMalaysiaLatestVaccinationStatistic() {
        return new Promise(async(resolve, reject) => {
             try {

                let datasets = await danfo.read_csv(malaysiaVaccinationDataCSV)

                let latestStateDataFrame = datasets.tail(1)
                 let latestStatistic = await latestStateDataFrame.to_json()
                 latestStatistic = JSON.parse(latestStatistic)
                resolve({
                    "status": "success",
                    "data": latestStatistic[0] ? latestStatistic[0] : {}
                }) 
            } catch (error) {
                reject({
                    "status": "error",
                    "message" : error.message
                })
            }
        })
       
    },

    getStateVaccinationStatistic({state, start_date, end_date}) {
        return new Promise(async(resolve, reject) => {
            try {
                let datasets = await danfo.read_csv(stateDataCSV)
                let latestStateDataFrame;
                latestStateDataFrame = datasets.query({ "column": "state", "is": "==", "to": state })
                if (start_date) {
                    latestStateDataFrame = latestStateDataFrame.query({"column": "date", "is" : ">=", "to" : start_date})
                }

                if (end_date) {
                    latestStateDataFrame = latestStateDataFrame.query({"column": "date", "is" : "<=", "to" : end_date})
                }

                let latestStatistic = await latestStateDataFrame.to_json()
                latestStatistic = JSON.parse(latestStatistic)
                resolve({
                    "status": "success",
                    "data": latestStatistic
                }) 
                } catch (error) {
                    reject({
                        "status": "error",
                        "message" : error.message
                    })
                }
            })
    },
    getStateLatestVaccinationStatistic({state}) {
        return new Promise(async(resolve, reject) => {
            try {

                let datasets = await danfo.read_csv(stateDataCSV)
                let latestStateDataFrame;
                if (state === undefined) {
                     latestStateDataFrame = datasets.tail(16)

                } else {
                     latestStateDataFrame = datasets.query({ "column": "state", "is": "==", "to": state })
                    latestStateDataFrame = latestStateDataFrame.tail(1)
                }
                    let latestStatistic = await latestStateDataFrame.to_json()
                    latestStatistic = JSON.parse(latestStatistic)
                    resolve({
                        "status": "success",
                        "data": latestStatistic[0] ? latestStatistic[0] : {}
                    }) 
                } catch (error) {
                    reject({
                        "status": "error",
                        "message" : error.message
                    })
                }
            })
     }

}
