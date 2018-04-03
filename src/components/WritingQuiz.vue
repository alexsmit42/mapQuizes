<template lang="pug">
.writing-quiz.regions-quiz
    quiz-info(:info="info")
    error-msg(:error="errorMessage")
    #map
    button(v-if="!currentQuestion", type="button", class="btn btn-success", @click="nextQuestion") Rozruch!
    .quiz-block(v-if="currentQuestion")
        h4 Miasta:&nbsp;
            strong {{ currentQuestion }} / {{ questions.length }}
        .description
            .logo(v-if="currentImage")
                img(:src="currentImage")
            .hint-block
                a(@click="showHint = !showHint") Wskazówka
                transition(name="hint")
                    .hint(v-show="showHint") {{ questions[currentQuestion - 1].hint }}
            .input-group
                input(v-model="inputAnswer", placeholder="Napisz nazwę województa z mapy", class="form-control", :disabled="rightAnswer")
                .input-group-append
                    button(@click="checkAnswer", type="button", class="btn btn-secondary", :disabled="rightAnswer") Sprawdź
        template(v-if="rightAnswer")    
            .answer
                .correct(v-if="rightAnswer.toLowerCase() === answer.toLowerCase()") Tak!
                template(v-else)
                    .no-correct Nie tak!
                    .no-correct-note Jak dobrze: 
                        span {{ rightAnswer }}
            button(v-if="currentQuestion !== questions.length", type="button", class="btn btn-primary", @click="nextQuestion") Następne miasto
            button(v-else, type="button", class="btn btn-primary", @click="nextQuestion") Zakończyć
    h5.finish-block(v-if="isFinish") Twój wynik&nbsp;
        span.total {{ total }}

</template>

<script>

import QuizInfo from './partial/QuizInfo.vue'
import ErrorMsg from './partial/ErrorMsg.vue'

import QuizMixin from './mixins/QuizMixin'

export default {
    data() {
        return {
            info: {
                title: 'Gra geograficzna o województwach',
                description: 'Witaj, podróżniku! Teraz dowiemy się, jak dobrze znasz napisanię województw w Polsce...'
            },
            map: {},
            questions: [
                {title: 'PL-WP', hint: 'Великопольское', answer: "Wielkopolskie"},
                {title: 'PL-KP', hint: 'Куявско-Поморское', answer: "Kujawsko-Pomorskie"},
                {title: 'PL-MA', hint: 'Малопольское', answer: "Małopolskie"},
                {title: 'PL-LD', hint: 'Лодзинское', answer: "Łódzkie"},
                {title: 'PL-DS', hint: 'Нижнесилезское', answer: "Dolnośląskie"},
                {title: 'PL-LU', hint: 'Люблинское', answer: "Lubelskie"},
                {title: 'PL-LB', hint: 'Любуское', answer: "Lubuskie"},
                {title: 'PL-MZ', hint: 'Мазовецкое', answer: "Mazowieckie"},
                {title: 'PL-OP', hint: 'Опольское', answer: "Opolskie"},
                {title: 'PL-PD', hint: 'Подляское', answer: "Podlaskie"},
                {title: 'PL-PM', hint: 'Поморское', answer: "Pomorskie"},
                {title: 'PL-SL', hint: 'Силезское', answer: "Śląskie"},
                {title: 'PL-PK', hint: 'Подкарпатское', answer: "Podkarpackie"},
                {title: 'PL-SK', hint: 'Свентокшиское', answer: "Świętokrzyskie"},
                {title: 'PL-WN', hint: 'Варминьско-Мазурское', answer: "Warmińsko-Mazurskie"},
                {title: 'PL-ZP', hint: 'Западно-Поморское', answer: "Zachodniopomorskie"}
            ],
            rightAnswer: false,
            inputAnswer: '',
            markerValues: [],
            showHint: false
        }
    },
    components: {
        QuizInfo, ErrorMsg
    },
    mixins: [QuizMixin],
    mounted() {
        this.markerValues = this.questions.map(question => {
            return {
                [question.title]: `./src/assets/regions/${question.title}.png`
            }
        })

        this.initMap()
    },
    watch: {
        currentQuestion() {
            let values = {};
            let code = this.questions[this.currentQuestion - 1].title;
            values[code] = 'right';
            this.initMap(values)
        }
    },
    computed: {
        currentImage() {
            let question = this.questions[this.currentQuestion - 1];
            return `./src/assets/regions/${question.title}.png`
        }
    },
    methods: {
        initMap(values = []) {
            $('#map').empty();
            $('#map').vectorMap({
                map: 'pl_merc',
                // regionsSelectable: true,
                onRegionTipShow: (e, el, code) => {
                    el.remove();
                },
                series: {
                    regions: [{
                        scale: {
                            'right': '#a1a3a6'
                        },
                        attribute: 'fill',
                        values: values
                    }],
                    markers: [{
                        attribute: 'image',
                        values: this.questions.reduce(function(p, c, i){ p[i] = i; return p }, {}),
                        scale: this.markerValues
                    }]
                }
            });
        },
        clear() {
            this.rightAnswer = false;
            this.inputAnswer = '';
            this.showHint = false;
        },
        checkAnswer() {
            
            if (!this.answer && this.currentQuestion > 0) {
                this.answer = this.inputAnswer;
                this.rightAnswer = this.questions[this.currentQuestion - 1].answer;

                let values = {};
                if (this.answer.toLowerCase() === this.rightAnswer.toLowerCase()) {
                    this.total++;
                }
            } else {
                this.errorStep()
            }
        }
    }
}
</script>

<style lang="scss">
.writing-quiz {
    margin-bottom: 30px;

    .answer {
        margin: 10px 0;
    }

    .logo {
        margin: 10px 0;
    }

    .correct {
        color: green;
        font-size: 150%;
    }

    .no-correct {
        color: darkred;
        font-size: 150%;
    }

    .no-correct-note {
        span {
            color: darkslategray;
            font-size: 140%;
        }
    }

    .hint-block {
        margin-bottom: 10px;

        a {
            font-size: 110%;
            color: darkblue;
            cursor: pointer;
        }
    }

    .hint-enter-active, .-hint-leave-active {
        transition: opacity 1s;
    }

    .hint-enter, .hint-leave-to {
        opacity: 0;
    }
}
</style>

