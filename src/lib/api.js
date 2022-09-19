//URL
const backURL = "https://skypro-rock-scissors-paper.herokuapp.com/";
const loginURL = (data) => `${backURL}login?login=${data}`;
const playerStatusURL = (data) => `${backURL}player-status?token=${data}`;
const playerListURL = (data) => `${backURL}player-list?token=${data}`;
const startGameURL = (data) => `${backURL}start?token=${data}`;
const statusGameURL = (data) => `${backURL}game-status?token=${data}&id=${window.application.id}`;
const moveURL = (data) => `${backURL}play?token=${window.application.token}&id=${window.application.id}&move=${data}`;

//API и коллбеки

const setTimerUseApi = (interval, api) => {
    window.application.timers.push(
        setInterval(() => {
            api();
        }, interval)
    );
};
function useApi(getUrl, callback, value = window.application.token) {
    fetch(getUrl(value))
        .then(onError)
        .then(responseError)
        .then((data) => callback(data, value))
        .catch(function (error) {
            console.log(error);
        });
}

function useLogin(data, login) {
    if (!data) {
        return;
    }
    const user = {
        login: login,
        token: data.token,
    };
    localStorage.setItem("user", JSON.stringify(user));
    window.application.token = data.token;
    useApi(playerStatusURL, getPlayerStatus);
}
function startGame(data) {
    window.application.id = data["player-status"].game.id;
    useApi(playerStatusURL, getPlayerStatus);
}
function getStatusGame(data) {
    if (data["game-status"].status === "waiting-for-start") {
        window.application.renderScreen("waitingStart");
        return;
    }
    window.application.enemy = data["game-status"].enemy.login;
    if (data["game-status"].status === "waiting-for-your-move") {
        window.application.renderScreen("move");
        return;
    } else if (data["game-status"].status === "waiting-for-enemy-move") {
        window.application.renderScreen("waitingEnemyMove");
        return;
    } else if (data["game-status"].status === "win") {
        window.application.renderScreen("win");
        return;
    } else if (data["game-status"].status === "lose") {
        window.application.renderScreen("lose");
        return;
    }
}
function getPlayerStatus(data) {
    if (data["player-status"].status === "lobby") {
        window.application.renderScreen("lobby");
    } else if (data["player-status"].status === "game") {
        window.application.id = data["player-status"].game.id;
        window.application.renderScreen("waitingStart");
    }
}

function getPlayerList(data) {
    window.application.playerList = data.list.map((item) => (item.you ? `вы: ${item.login}` : item.login));
    const playerList = document.querySelector(".app__playerList");
    if (!playerList) {
        return;
    }
    playerList.textContent = "";
    window.application.playerList.map((player) => {
        createElement("li", "player", player, playerList);
    });
}

const onError = (res) => {
    if (res.status == 500) {
        window.application.renderScreen("login");
        return Promise.reject("Ваш противник вышел из игры, Попробуйте войти под другим логином");
    } else if (res.ok) {
        return res.json();
    }
    return Promise.reject("Сервер не доступен");
};

function responseError(data) {
    if (data.status === "ok") {
        return data;
    } else if (data.status === "error" && !data.message) {
        return Promise.reject("Войти не удалось, пустой логин не допустим, попробуйте еще раз.");
    } else if (data.message === "token doesn't exist") {
        window.application.renderScreen("login");
        return Promise.reject("Нет игрока с таким токеном");
    } else if (data.message === "player is already in game") {
        return Promise.reject("Игрок уже в игре, нельзя начать две игры одновременно, поробуйте войти под другим логином");
    } else if (data.message === "no game id") {
        return Promise.reject("Id игры не передан");
    } else if (data.message === "wrong game id") {
        return Promise.reject("Id игры некорректный / бой не существует / бой закончен");
    } else if (data.message === "player is not in this game") {
        return Promise.reject("Игрок не в этой игре");
    } else if (data.message === "no move") {
        return Promise.reject("Ход не передан");
    } else if (data.message === "wrong move") {
        return Promise.reject("Недопустимый ход");
    } else if (data.message === "not your move") {
        return Promise.reject("Не ваш ход! Вы уже отправили ход в текущем раунде, сейчас игра ждет хода вашего соперника");
    }
}
