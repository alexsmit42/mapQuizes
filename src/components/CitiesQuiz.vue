<template lang="pug">
.cities-quiz
    quiz-info(:info="info")
    error-msg(:error="errorMessage")
    #map
    button(v-if="!currentQuestion", type="button", class="btn btn-success", @click="nextQuestion") Rozruch!
    .quiz-block(v-if="currentQuestion")
        h4 Miasta:&nbsp;
            strong {{ currentQuestion }} / {{ cities.length }}
        .description Zaznacz na mapie miasto
            span.city {{ cities[currentQuestion - 1].city }}
        template(v-if="distantion")    
            .answer Popełniłeś błąd na&nbsp;
                strong {{ distantion }} km
            button(v-if="currentQuestion !== cities.length", type="button", class="btn btn-primary", @click="nextQuestion") Następne miasto
            button(v-else, type="button", class="btn btn-primary", @click="nextQuestion") Zakończyć
    h5.finish-block(v-if="isFinish") Twój wynik&nbsp;
        span.total {{ total }}&nbsp;
        | km

</template>

<script>

import QuizInfo from './partial/QuizInfo.vue'
import ErrorMsg from './partial/ErrorMsg.vue'

export default {
    data() {
        return {
            info: {
                title: 'Gra geograficzna o miastach',
                description: 'Witaj, podróżniku! Teraz dowiemy się, jak dobrze znasz położenie miast w Polsce...'
            },
            map: {},
            center: {lat: 51.9714, lng: 19.1824},
            markers: [],
            rightMarker: {},
            zoom: 6,
            cities: [
                {city: "Warsaw", lat: 52.2296756, lng: 21.012228700000037},
                {city: "Gdańsk", lat: 54.35202520000001, lng: 18.64663840000003},
                {city: "Wroclaw", lat: 51.1078852, lng: 17.03853760000004},
                {city: "Kraków", lat: 50.06465009999999, lng: 19.94497990000002},
                {city: "Poznań", lat: 52.406374, lng: 16.925168100000064},
                {city: "Toruń", lat: 53.0137902, lng: 18.59844369999996},
                {city: "Lublin", lat: 51.2464536, lng: 22.568446300000005},
                {city: "Szczecin", lat: 53.4285438, lng: 14.552811600000041},
                {city: "Bydgoszcz", lat: 53.12348040000001, lng: 18.008437800000024},
                {city: "Łódź", lat: 51.7592485, lng: 19.45598330000007},
                {city: "Katowice", lat: 50.26489189999999, lng: 19.02378150000004}
            ],
            currentQuestion: 0,
            total: 0,
            errorMessage: '',
            distantion: 0,
            isFinish: false
        }
    },
    components: {
        QuizInfo, ErrorMsg
    },
    mounted() {
        this.initMap()
    },
    methods: {
        initMap() {
            this.map = new google.maps.Map(document.getElementById('map'), {
                center: this.center,
                zoom: this.zoom,
                disableDefaultUI: true,
                draggableCursor: 'default',
                styles: [
                        {
                            "featureType": "all",
                            "stylers": [
                                { "color": "#ffffff" }
                            ]
                        },
                        {
                            "featureType": "administrative.country",
                            "elementType": "geometry",
                            "stylers": [
                                { "color": "#000000" }
                            ]
                        },
                        {
                            "featureType": "administrative",
                            "elementType": "labels",
                            "stylers": [
                                { "visibility": "off" }
                            ]
                        },
                        {
                            "featureType": "water",
                            "elementType": "geometry",
                            "stylers": [
                                { "color": "#3a79de" }
                            ]
                        },
                        {
                            "featureType": "landscape",
                            "elementType": "labels",
                            "stylers": [
                                { "visibility": "off" }
                            ]
                        }
                    ]
            });

            this.map.setOptions({draggable: false, zoomControl: false, scrollwheel: false, disableDoubleClickZoom: true});

            this.map.addListener('click', e => {
                this.addMarker(e.latLng)
            })
        },
        addMarker(position) {
            this.errorMessage = '';

            if (this.markers.length === 0 && this.currentQuestion > 0) {
                let marker = new google.maps.Marker({
                    map: this.map,
                    position
                });
                this.markers.push(marker)

                let city = this.cities[this.currentQuestion - 1]
                this.rightMarker = new google.maps.Marker({
                    map: this.map,
                    position: {
                        lat: city.lat,
                        lng: city.lng
                    },
                    label: city.city.substring(0,1)
                });

                this.showAnswer()
            } else {
                if (this.markers.length > 0) {
                    this.errorMessage = 'Już wykonałeś ruch!';
                } else {
                    this.errorMessage = 'Rozpocznij grę!';
                }
            }
        },
        showAnswer() {
            let marker = this.markers[0]
            let city = this.cities[this.currentQuestion - 1]
            this.distantion = this.getDistantion(marker.position.lat(), marker.position.lng(), city.lat, city.lng)
            this.total += this.distantion
        },
        getPositions() {
            let geocoder = new google.maps.Geocoder();

            this.cities.map(city => {
                setTimeout(() => {
                    geocoder.geocode( { 'address': city}, (results, status) => {
                        if (status == 'OK') {
                            this.positions.push({
                                city: city,
                                lat: results[0].geometry.location.lat(),
                                lng: results[0].geometry.location.lng()
                            });
                        }
                    })
                },
                1000
            )})
        },
        nextQuestion() {
            if (this.currentQuestion === this.cities.length) {
                this.currentQuestion = 0;
                this.isFinish = true;
                return;
            }

            if (this.currentQuestion === 0) {
                this.total = 0;
                this.isFinish = false;
            }

            this.errorMessage = '';
            this.distantion = 0;
            this.isFinish = false;

            if (this.currentQuestion > 0 && this.markers.length === 0) {
                this.errorMessage = 'Zaznacz miasto na mapie!'
                return
            }

            if (this.markers.length) {
                this.markers[0].setMap(null);
                this.rightMarker.setMap(null);
            }
            this.markers = [];

            this.currentQuestion++;
        },
        getDistantion(lat1, lon1, lat2, lon2) {
            function deg2rad(deg) {
                return deg * (Math.PI/180)
            }

            var R = 6371; // Radius of the earth in km
            var dLat = deg2rad(lat2-lat1);  // deg2rad below
            var dLon = deg2rad(lon2-lon1); 
            var a = 
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
                Math.sin(dLon/2) * Math.sin(dLon/2)
                ; 
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
            var d = R * c; // Distance in km
            return parseInt(d);
        }
    }
}
</script>

<style lang="scss">
.cities-quiz {
    width: 500px;
    margin: 0 auto;
    position: relative;

    #map {
        width: 500px;
        height: 500px;
        margin-bottom: 20px;
        border: 1px solid grey;
    }

    .error {
        height: 60px;
    }

    .quiz-block {
        .description {
            .city {
                font-size: 120%;
                color: navy;
                margin-left: 10px;
            }
        }

        .answer{
            margin-bottom: 10px;
        }
    }

    .finish-block {
        margin: 10px 0;

        .total {
            color: navy;
        }
    }
}
</style>

