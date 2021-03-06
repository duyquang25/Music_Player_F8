const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isChanged: true,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "7 Years",
            singer: "Lukas Graham",
            path: "music/7Years.mp3",
            image: "https://is3-ssl.mzstatic.com/image/thumb/Music69/v4/1f/57/08/1f57082e-ee7e-dcb7-a73e-ba1f3468211d/093624920496.jpg/500x500bb.webp"
        },
        {
            name: "Cheating on You",
            singer: "Charlie Puth",
            path: "music/Cheating on You Lyrics_320kbps.mp3",
            image:
                "https://i1.sndcdn.com/artworks-000606602386-58veao-t500x500.jpg"
        },
        {
            name: "Peaches",
            singer: "Justin Bieber",
            path:
                "music/peaches.mp3",
            image: "https://i1.sndcdn.com/artworks-boUvTeTEft8V0b2G-8spb0A-t500x500.jpg"
        },
        {
            name: "Girls Like You",
            singer: "Maroon 5 ft. Cardi B",
            path: "music/girls_like_you.mp3",
            image:
                "https://i1.sndcdn.com/artworks-Q4YpEfYqUak25yQa-bWezrg-t500x500.jpg"
        },
        {
            name: "Happy For You",
            singer: "Lukas Graham ft. Vu",
            path: "music/lukas_graham_happy_for_you_feat_vu_performance_video_6462074145644287853.mp3",
            image:
                "https://i.ytimg.com/vi/mf4upAPwHEo/hqdefault.jpg?"
        },
        {
            name: "MEAN It",
            singer: "Lauv & LANY",
            path: "music/lauv_lany_mean_it_lyrics.mp3",
            image:
                "https://avatar-ex-swe.nixcdn.com/song/2019/11/14/e/3/1/6/1573698962727_640.jpg"
        },
        {
            name: "10000 Hours",
            singer: "Jungkook (BTS)",
            path: "music/bts_jungkook_10000_hours_full_ver_lyrics_-8617717337001492207.mp3",
            image:
                "https://i.ytimg.com/vi/6-Q36XoHlEI/maxresdefault.jpg"
        },
        {
            name: "Let Her Go",
            singer: "Passenger",
            path: "music/passenger_let_her_go_lyrics_6445739323343692100.mp3",
            image:
                "https://i.ytimg.com/vi/EX7oWSbVbGY/hqdefault.jpg?"
        },
        {
            name: "What Are Words",
            singer: "Chris Medina",
            path: "music/what_are_words_chris_medina_lyrics_-8747535439467037846.mp3",
            image:
                "https://avatar-ex-swe.nixcdn.com/playlist/2013/11/06/c/c/a/8/1383717171089_500.jpg"
        },
        {
            name: "Closer",
            singer: "The Chainsmokers",
            path: "music/the_chainsmokers_closer_lyrics_ft_halsey_5382140997956059747.mp3",
            image:
                "https://upload.wikimedia.org/wikipedia/vi/a/a5/Closer_%28featuring_Halsey%29_%28Official_Single_Cover%29_by_The_Chainsmokers.png"
        },
        {
            name: "We Don't Talk Anymore",
            singer: "Charlie Puth ft. Selena Gomez",
            path: "music/charlie_puth_we_don_t_talk_anymore_lyrics_feat_selena_gomez_-4202526501292096840.mp3",
            image:
                "https://thenewsmexico.com/wp-content/uploads/2019/06/image5-12.jpg"
        },
        {
            name: "Totoo",
            singer: "Masew",
            path: "music/nhac_dam_cuoi_mixi_city_masiu_-4105305789908939866.mp3",
            image:
                "https://thenewsmexico.com/wp-content/uploads/2019/06/image5-12.jpg"
        },
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        });
        playlist.innerHTML = htmls.join("");
    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // X??? l?? CD quay / d???ng
        // Handle CD spins / stops
        const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        });
        cdThumbAnimate.pause();

        // X??? l?? ph??ng to / thu nh??? CD
        // Handles CD enlargement / reduction
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        // X??? l?? khi click play
        // Handle when click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        // Khi song ???????c play
        // When the song is played
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        };

        // Khi song b??? pause
        // When the song is pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        };

        // Khi ti???n ????? b??i h??t thay ?????i
        // When the song progress changes
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(
                    (audio.currentTime / audio.duration) * 100
                );

                if (_this.isChanged) {
                    progress.value = progressPercent;
                }
            }
        };

        // X??? l?? khi tua song
        // Handling when seek
        progress.ontouchstart = function () {
            _this.isChanged = false;
        }

        progress.onmousedown = function () {
            _this.isChanged = false;
        }

        progress.onchange = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
            _this.isChanged = true;
        };

        // Khi next song
        // When next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // Khi prev song
        // When prev song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // X??? l?? b???t / t???t random song
        // Handling on / off random song
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig("isRandom", _this.isRandom);
            randomBtn.classList.toggle("active", _this.isRandom);
        };

        // X??? l?? l???p l???i m???t song
        // Single-parallel repeat processing
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig("isRepeat", _this.isRepeat);
            repeatBtn.classList.toggle("active", _this.isRepeat);
        };

        // X??? l?? next song khi audio ended
        // Handle next song when audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };

        // L???ng nghe h??nh vi click v??o playlist
        // Listen to playlist clicks
        playlist.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)");

            if (songNode || e.target.closest(".option")) {
                // X??? l?? khi click v??o song
                // Handle when clicking on the song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                // X??? l?? khi click v??o song option
                // Handle when clicking on the song option
                if (e.target.closest(".option")) {
                }
            }
        };
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }, 300);
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {
        // G??n c???u h??nh t??? config v??o ???ng d???ng
        // Assign configuration from config to application
        this.loadConfig();

        // ?????nh ngh??a c??c thu???c t??nh cho object
        // Defines properties for the object
        this.defineProperties();

        // L???ng nghe / x??? l?? c??c s??? ki???n (DOM events)
        // Listening / handling events (DOM events)
        this.handleEvents();

        // T???i th??ng tin b??i h??t ?????u ti??n v??o UI khi ch???y ???ng d???ng
        // Load the first song information into the UI when running the app
        this.loadCurrentSong();

        // Render playlist
        this.render();

        // Hi???n th??? tr???ng th??i ban ?????u c???a button repeat & random
        // Display the initial state of the repeat & random button
        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
    }
};

app.start();
