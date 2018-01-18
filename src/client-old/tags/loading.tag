loading
    h1 Loading...
    .progress.progress-anime
        .progress-bar(style="")
    style.
        loading h1 {
            text-align: center;
        }
        .progress-anime.progress {
            height: 0.5em;
            overflow: hidden;
        }
        .progress-anime .progress-bar {
            width: 10%;
            margin-left: calc(-10% + 1em);
            animation: load2 2.25s infinite ease;
        }
        @keyframes load2 {
            45% {
                margin-left: calc(100% - 1em);
            }
            50% {
                margin-left: calc(100% - 1em);
            }
            95% {
                margin-left: calc(-10% + 1em);
            }
        }