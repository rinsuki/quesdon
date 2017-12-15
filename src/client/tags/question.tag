question
    .card.mb-2(data-nsfw="{opts.question.isNSFW && !opts.dataNsfwGuard ? 1 : 0}")
        input.nsfw-check(type="checkbox")
        .card-body
            h2.card-title {opts.question.question}
            h6.card-subtitle.mb-2
                span(if="{!opts.dataHideAnswerUser}") 回答者: 
                    a(href="/@{opts.question.user.acct}") {opts.question.user.name}
                        span.text-muted  @{opts.question.user.acct}
                span: a(href="/@{opts.question.user.acct}/questions/{opts.question._id}").text-muted {new XDate(opts.question.answeredAt).toString("yyyy-MM-dd HH:mm:ss")}
            p.card-text.question-text {opts.question.answer}
        .nsfw-guard
            div
                p 閲覧注意
                p タップもしくはクリックで表示
    style.
        .card {
            position:relative;
        }
        .nsfw-guard {
            display:none;
            justify-content:center;
            align-items:center;
        }
        .nsfw-check {
            display:none;
            position:absolute;
            top:0;
            left:0;
            width:100%;
            height:100%;
            z-index:999;
            opacity:0;
            margin:auto;
        }
        .card[data-nsfw="1"] .nsfw-check {
            display:block;
            width:100%;
            height:100%;
        }
        .card[data-nsfw="1"] .nsfw-check ~ .nsfw-guard {
            display:flex;
            transition: all .1s ease;
            position:absolute;
            top:0;
            bottom:0;
            left:0;
            right:0;
            background: rgba(255,255,255,0.428); /* rinsuki */
            text-align: center;
        }
        .card[data-nsfw="1"] .nsfw-check ~ .card-body {
            transition: all .1s ease;
            filter: blur(8px);
        }
        .card[data-nsfw="1"] .nsfw-check:checked ~ .card-body{
            filter: blur(0);
        }
        .card[data-nsfw="1"] .nsfw-check:checked ~ .nsfw-guard {
            opacity:0;
            pointer-events: none;
        }
        .card[data-nsfw="1"] .nsfw-check:checked {
            pointer-events: none;
        }
        .card-subtitle > *:after {
            content: ' ';
        }