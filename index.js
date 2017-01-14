(function () {
    class FetchData {
        constructor() {
            const self = this;
            const url = "https://raw.githubusercontent.com/aaronnech/Who-Wants-to-Be-a-Millionaire/master/questions.json";
            const promise = fetch(url);
            promise
                .then(function (blob) { return blob.json() })
                .then(function (data) { self.prepareTemplate(data.games) })
        }

        prepareTemplate(quiz, self = this) {
            let html = ``;
            let totalQuestion = [];
            for (let i in quiz) {
                for (let j in quiz[i]) {
                    for (let k in quiz[i][j]) {
                        let { question, correct, content } = quiz[i][j][k];
                        totalQuestion.push(quiz[i][j][k]);
                        html += `
                                <form action="#" data-correct="${correct}">
                                    <ul>
                                        <li class="first"> ${question} </li>
                                        <li data-answer="0" name="${question}" > ${content[0]} </li>
                                        <li data-answer="1" name="${question}"> ${content[1]} </li>
                                        <li data-answer="2" name="${question}"> ${content[2]} </li>
                                        <li data-answer="3" name="${question}"> ${content[3]} </li>
                                    </ul>
                                </form>
                            `;

                    }
                }
            }
            const template = document.querySelector('.template');
            template.innerHTML = html;
            self.prepareQuiz(totalQuestion.length)
        }

        prepareQuiz(totalQuestion, self = this) {
            let total = 0;
            const forms = document.querySelectorAll('form:nth-child(n+2)'),
                list = document.querySelectorAll('form li:nth-child(n+2)'),
                h2Below = document.querySelectorAll('.container h2')[1];
            forms.forEach(function (form) {
                form.style.display = 'none'
            })
            list.forEach(function (li) {
                li.addEventListener('click', function () {
                    const answer = this.getAttribute('data-answer');
                    const form = this.parentElement.parentElement;
                    const correct = form.getAttribute('data-correct');

                    if (answer == correct) {
                        this.style.color = 'green'
                        ++total;
                        setTimeout(function () {
                            form.style.display = 'none';
                            form.nextElementSibling.style.display = 'block';
                        }, 300);
                    }
                    else {
                        this.style.color = 'red'
                        setTimeout(function () {
                            form.style.display = 'none';
                            h2Below.style.display = 'block';
                        }, 300)

                        h2Below.innerHTML = `Game Over<br/><span>YourScore: ${total}/${totalQuestion}<br/><a>play again</a></span>`;
                        const a = document.querySelector('a');
                        a.addEventListener('click', function () {
                            h2Below.innerHTML = `Game Over<br/><span>YourScore: ${total}/${totalQuestion}<br/><a>play again</a><br/>Loading...</span>`;
                            setTimeout(function () {
                                h2Below.style.display = 'none';
                                new FetchData();
                            }, 600)
                            
                        })
                    }

                })
            })
        }

    }

    new FetchData();

} ())