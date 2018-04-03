export default {
    data() {
        return {
            answer: false,
            currentQuestion: 0,
            total: 0,
            errorMessage: '',
            isFinish: false
        }
    },
    created() {
        this.shuffle(this.questions)
    },
    methods: {
        nextQuestion() {
            if (this.currentQuestion === this.questions.length) {
                this.currentQuestion = 0;
                this.isFinish = true;
                return;
            }

            if (this.currentQuestion === 0) {
                this.total = 0;
                this.isFinish = false;
            }

            this.errorMessage = '';
            this.isFinish = false;

            if (this.currentQuestion > 0 && !this.answer) {
                this.errorMessage = 'Zaznacz miasto na mapie!'
                return
            }

            if (this.answer) {
                this.clear();
            }
            this.answer = false;

            this.currentQuestion++;
        },
        errorStep() {
            if (this.answer) {
                this.errorMessage = 'Już wykonałeś ruch!';
            } else {
                this.errorMessage = 'Rozpocznij grę!';
            }
        },
        shuffle(a) {
            var j, x, i;
            for (i = a.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = a[i];
                a[i] = a[j];
                a[j] = x;
            }
        }
    }
}