/**
 * A library for normalizing HTML Geolocation API raw data. Original use case is for determining a single location.
 * Edit by Alexander anak Eric@Eric Lapin
 *
 * ASSUMPTIONS:
 * 1) Your data won't cross the date line.
 * 2) Ignores time weighted values because we have no control over the interval at which points are retrieved from
 * the Geolocation API.
 *
 * @author @agup
 * @param filters Required. Either set properties to a value or null. If a filter is set to null it will be ignored.
 * @constructor
 */
var GeolocationHelper = function(/* Object */ filters) {

    // AVAILABLE FILTERS
    this.UNITS;
    this.MAX_ACCURACY;
    this.MAX_MEDIAN_ACCURACY;
    this.MAX_STDDEVIATION_ACCURACY;
    this.MAX_STDDEVIATION_LAT;
    this.MAX_STDDEVIATION_LON;
    this.MAX_ARRAY_SIZE;

    if(!filters){
        filters = {};
    }

    "UNITS" in filters ? this.UNITS = filters.UNITS : this.UNITS = "M"; 
    "MAX_ACCURACY" in filters ? this.MAX_ACCURACY = filters.MAX_ACCURACY : this.MAX_ACCURACY = 100 ;
    "MAX_MEDIAN_ACCURACY" in filters ? this.MAX_MEDIAN_ACCURACY = filters.MAX_MEDIAN_ACCURACY : this.MAX_MEDIAN_ACCURACY = 20;
    "MAX_STDDEVIATION_ACCURACY" in filters ? this.MAX_STDDEVIATION_ACCURACY = filters.MAX_STDDEVIATION_ACCURACY : this.MAX_STDDEVIATION_ACCURACY = 2.5;
    "MAX_STDDEVIATION_LAT" in filters ? this.MAX_STDDEVIATION_LAT = filters.MAX_STDDEVIATION_LAT : this.MAX_STDDEVIATION_LAT = 0.0001;
    "MAX_STDDEVIATION_LON" in filters ? this.MAX_STDDEVIATION_LON = filters.MAX_STDDEVIATION_LON : this.MAX_STDDEVIATION_LON = 0.0001;
    "MAX_ARRAY_SIZE" in filters ? this.MAX_ARRAY_SIZE = filters.MAX_ARRAY_SIZE : this.MAX_ARRAY_SIZE = 25;

    var stddev_accuracy = 0, stddev_lat = 0, stddev_lon = 0, stddev_distance = 0;
    var med_accuracy = 0, med_lat = 0, med_lon = 0, avg_accuracy = 0, avg_distance = 0;
    var med_distance = 0, med_speed = 0, med_timediff = 0;

    var accuracyArray = [];
    var timeStampArray = [];
    var speedArray = [];
    var latArray = [];
    var lonArray = [];
    var latLonArray = [];
    var distanceArray = [];

    if(!window.localStorage) {
        console.error("WARNING: GeolocationHelper.js requires local storage.");
    }

    this.reset = function(){
        timeStampArray = [];
        speedArray = [];
        accuracyArray = [];
        distanceArray = [];
        latArray = [];
        lonArray = [];
        latLonArray = [];
    };

    /**
     * All values are required!
     * @param accuracy
     * @param lat
     * @param lon
     * @param timestamp
     * @param callback
     */
    this.process = function(accuracy, lat, lon, timestamp, callback) {

        accuracyArray.push(accuracy);

        avg_accuracy = this.average(accuracyArray);
        med_accuracy = this.median(accuracyArray);
        stddev_accuracy = this.standardDeviation(accuracyArray);

        latArray.push(lat);
        lonArray.push(lon);
        latLonArray.push({
            latitude: lat,
            longitude: lon
        });

        timeStampArray.push(timestamp);

        if(latArray.length > 1){
            var previous_lat = latArray[latArray.length - 1];
            var previous_lon = lonArray[lonArray.length - 1];

            var units = this.UNITS;
            var distance = this.distance(previous_lat, previous_lon, lat, lon, units);
            distanceArray.push(distance);
            var timeDiff = timestamp - timeStampArray[timeStampArray.length - 1] / 1000;
            var timeDiffInHours = Math.floor(( timeDiff  %= 86400) / 3600);
            var speed = distance / timeDiffInHours;
            speedArray.push(speed);
        }

        this.manageArraySize();

        med_lat = this.median(latArray);
        med_lon = this.median(lonArray);
        med_speed = this.median(speedArray);
        med_distance = this.median(distanceArray);
        avg_distance = this.average(distanceArray);
        med_timediff = this.medianTime(timeStampArray);
        stddev_lat = this.standardDeviation(latArray);
        stddev_lon = this.standardDeviation(lonArray);
        stddev_distance = this.standardDeviation(distanceArray);

        this.filter(accuracy, callback);
    };

    this.filter = function(accuracy, callback) {

        var reject = false;
        var locationObject = {};

        if (accuracy > this.MAX_ACCURACY) {
            reject = true;
        }
        if (med_accuracy > this.MAX_MEDIAN_ACCURACY) {
            reject = true;
        }
        if (stddev_accuracy > this.MAX_STDDEVIATION_ACCURACY) {
            reject = true;
        }
        if (stddev_lat > this.MAX_STDDEVIATION_LAT) {
            reject = true;
        }
        if (stddev_lon > this.MAX_STDDEVIATION_LON) {
            reject = true;
        }

        locationObject.reject  = reject;
        locationObject.count = latArray.length;
        locationObject.avg_accuracy = avg_accuracy;
        locationObject.avg_distance = avg_distance;
        locationObject.med_lat = med_lat;                  // Median latitude
        locationObject.med_lon = med_lon;                  // Median longitude
        locationObject.med_accuracy = med_accuracy;        // Median accuracy
        locationObject.med_speed = med_speed;              // Median speed
        locationObject.med_distance = med_distance;        // Median distance between values in the array
        locationObject.med_time_diff = med_timediff;       // Median difference in time between geolocation results
        locationObject.stddev_lat = stddev_lat;            // Standard deviation latitude
        locationObject.stddev_lon = stddev_lon;            // Standard deviation longitude
        locationObject.stddev_accuracy = stddev_accuracy;  // Standard deviation accuracy
        locationObject.stddev_distance = stddev_distance;  // Standard deviation distance between values in the array
        locationObject.center_point = this.getCenter(latLonArray);

        localStorage.geolocationObject = JSON.stringify(locationObject);

        callback(locationObject);
    };

    this.getLocationInfo = function(){

        return localStorage.geolocationObject;
    };

    this.manageArraySize = function(){
 
        if(accuracyArray.length > this.MAX_ARRAY_SIZE){
            accuracyArray.shift();
        }

        if(distanceArray.length > this.MAX_ARRAY_SIZE) {
            distanceArray.shift();
        }

        if(latLonArray.length > this.MAX_ARRAY_SIZE) {
            latLonArray.shift();
        }

        if(latArray.length > this.MAX_ARRAY_SIZE){
            latArray.shift();
        }

        if(lonArray.length > this.MAX_ARRAY_SIZE){
            lonArray.shift();
        }
    };

    this.distance = function(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344 * 1000; 
        isNaN(dist) ? dist = 0 : dist;

        return dist;
    };

    this.standardDeviation = function(values) {
        var avg = this.average(values);

        var squareDiffs = values.map(function(value){
            var diff = value - avg;
            var sqrDiff = diff * diff;
            return sqrDiff;
        });

        var avgSquareDiff = this.average(squareDiffs);

        var stdDev = Math.sqrt(avgSquareDiff);
        return stdDev;
    };

    this.average = function(data) {
        var sum = data.reduce(function(sum, value){
            return sum + value;
        }, 0);

        var avg = sum / data.length;
        return isNaN(avg) ? 0 : avg;
    };

    this.median = function(array) {

        if(array.length == 1) return array[0];

        array.sort( function(a,b) {return a - b;} );

        var half = Math.floor(array.length/2);

        if(array.length % 2) {
            return array[half];
        }
        else {
            return (array[half-1] + array[half]) / 2.0;
        }
    };

    this.medianTime = function(array) {

        if(array.length == 1) return 0;

        var diff = array.map(function(currentVal,index){
            if(index > 0) {
                return currentVal - array[index - 1];
            }
        });

        return this.median(diff);

    };

    this.getLargestDistance = function(array){
        return array.sort()[array.length];
    };

    this.getLatLonArray = function(){
        return latLonArray;
    };

    this.getMidPoint = function(){
        return localStorage.geolocationObject.center_point;
    };

    this.getCenter = function(coordsArray) {

        var x = 0, y = 0, z = 0;
        var radius = 6367; // earth's radius in km

        coordsArray.forEach(function(value){

            // Convert latitude and longitude to radians
            var latRad = Math.PI * value.latitude / 180;
            var lonRad = Math.PI * value.longitude / 180;

            // Convert to cartesian coords
            x += radius * Math.cos(latRad) * Math.cos(lonRad);
            y += radius * Math.cos(latRad) * Math.sin(lonRad);
            z += radius * Math.sin(latRad);
        });

        // Get our averages
        var xAvg = x / latLonArray.length;
        var yAvg = y / latLonArray.length;
        var zAvg = z / latLonArray.length;

        // Convert cartesian back to radians
        var sphericalLatRads = Math.asin(zAvg / radius);
        var sphericalLonRads = Math.atan2(yAvg , xAvg);

        // Convert radians back to degrees
        return {
            latitude: sphericalLatRads * (180 / Math.PI),
            longitude: sphericalLonRads * (180 / Math.PI)}
    }

};
