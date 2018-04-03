<template lang="pug">
.cities-quiz
    quiz-info(:info="info")
    error-msg(:error="errorMessage")
    #map
    button(v-if="!currentQuestion", type="button", class="btn btn-success", @click="nextQuestion") Rozruch!
    .quiz-block(v-if="currentQuestion")
        h4 Miasta:&nbsp;
            strong {{ currentQuestion }} / {{ questions.length }}
        .description Zaznacz na mapie miasto
            span.city {{ questions[currentQuestion - 1].title }}
        template(v-if="distantion")    
            .answer Popełniłeś błąd na&nbsp;
                strong {{ distantion }} km
            button(v-if="currentQuestion !== questions.length", type="button", class="btn btn-primary", @click="nextQuestion") Następne miasto
            button(v-else, type="button", class="btn btn-primary", @click="nextQuestion") Zakończyć
    h5.finish-block(v-if="isFinish") Twój wynik&nbsp;
        span.total {{ total }}&nbsp;
        | km

</template>

<script>

import QuizInfo from './partial/QuizInfo.vue'
import ErrorMsg from './partial/ErrorMsg.vue'

import QuizMixin from './mixins/QuizMixin'

export default {
    data() {
        return {
            info: {
                title: 'Gra geograficzna o miastach',
                description: 'Witaj, podróżniku! Teraz dowiemy się, jak dobrze znasz położenie miast w Polsce...'
            },
            map: {},
            center: {lat: 51.9714, lng: 19.1824},
            rightMarker: {},
            zoom: 6,
            questions: [
                {title: "Warsaw", answer: {lat: 52.2296756, lng: 21.012228700000037}},
                {title: "Gdańsk", answer: {lat: 54.35202520000001, lng: 18.64663840000003}},
                {title: "Wroclaw", answer: {lat: 51.1078852, lng: 17.03853760000004}},
                {title: "Kraków", answer: {lat: 50.06465009999999, lng: 19.94497990000002}},
                {title: "Poznań", answer: {lat: 52.406374, lng: 16.925168100000064}},
                {title: "Toruń", answer: {lat: 53.0137902, lng: 18.59844369999996}},
                {title: "Lublin", answer: {lat: 51.2464536, lng: 22.568446300000005}},
                {title: "Szczecin", answer: {lat: 53.4285438, lng: 14.552811600000041}},
                {title: "Bydgoszcz", answer: {lat: 53.12348040000001, lng: 18.008437800000024}},
                {title: "Łódź", answer: {lat: 51.7592485, lng: 19.45598330000007}},
                {title: "Katowice", answer: {lat: 50.26489189999999, lng: 19.02378150000004}}
            ],
            distantion: 0
        }
    },
    components: {
        QuizInfo, ErrorMsg
    },
    mixins: [QuizMixin],
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

            if (!this.answer && this.currentQuestion > 0) {
                let marker = new google.maps.Marker({
                    map: this.map,
                    position
                });
                this.answer = marker;

                let question = this.questions[this.currentQuestion - 1]
                this.rightMarker = new google.maps.Marker({
                    map: this.map,
                    position: {
                        lat: question.answer.lat,
                        lng: question.answer.lng
                    },
                    label: question.title.substring(0,1)
                });

                this.showAnswer()
            } else {
                this.errorStep()
            }
        },
        showAnswer() {
            let marker = this.answer
            let question = this.questions[this.currentQuestion - 1]
            this.distantion = this.getDistantion(marker.position.lat(), marker.position.lng(), question.answer.lat, question.answer.lng)
            this.total += this.distantion
        },
        getPositions() {
            let geocoder = new google.maps.Geocoder();

            this.questions.map(question => {
                setTimeout(() => {
                    geocoder.geocode( { 'address': question.title}, (results, status) => {
                        if (status == 'OK') {
                            this.positions.push({
                                city: question.title,
                                lat: results[0].geometry.location.lat(),
                                lng: results[0].geometry.location.lng()
                            });
                        }
                    })
                },
                1000
            )})
        },
        clear() {
            this.distantion = 0;
            this.answer.setMap(null);
            this.rightMarker.setMap(null);
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

