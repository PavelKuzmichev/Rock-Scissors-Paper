//константы
const audio = (document.querySelector("audio").volume = 0.05);
const app = document.querySelector(".app");
const block = window.application.blocks;
const screen = window.application.screens;

// обработчики и вспомогательные функции
const clearElement = (element) => {
    element.textContent = "";
};
const returnToLobby = () => window.application.renderScreen("lobby");
const makeMove = (event) => useApi(moveURL, () => {}, event.target.value);
const playAgain = () => useApi(startGameURL, startGame);
const checkLogin = (login) => (login && login.length > 1 ? true : alert("нужно хотя-бы два символа"));
const getToken = (event) => {
    const parent = event.target.parentElement;
    const login = parent.querySelector(".app__input").value;
    if (checkLogin(login)) {
        useApi(loginURL, useLogin, login);
    } else {
        return;
    }
};

//функция создатель-блока
const createElement = (tag, name, textContent, container, callback) => {
    const element = document.createElement(tag);
    element.classList.add(`app__${name}`);
    element.textContent = textContent;
    if (tag === "button") {
        element.addEventListener("click", callback);
    }
    if (tag === "input") {
        element.placeholder = textContent;
    }

    container.appendChild(element);
    return element;
};

//рендеры блоков
const renderGameTitle = (container) => createElement("h1", "gametitle", "Игра", container);
const renderLoginTitle = (container) => createElement("h1", "logintitle", "Камень, Ножницы, Бумага", container);
const renderLobbyTitle = (container) => createElement("h1", "lobbytitle", "Лобби", container);
const renderGameVersus = (container) => createElement("p", "gameversus", `Вы против ${window.application.enemy}`, container);
const renderLoginButton = (container) => createElement("button", "button", "Войти", container, getToken);
const renderToLobbynButton = (container) => createElement("button", "button", "В лобби", container, returnToLobby);
const renderAgainButton = (container) => createElement("button", "button", "Играть еще!", container, playAgain);
const renderGameWin = (container) => createElement("h2", "title", "Вы выиграли!", container);
const renderGameLose = (container) => createElement("h2", "title", "Вы проиграли!", container);
const renderLoginInput = (container) => createElement("input", "input", "Введите логин.", container);
const renderLobbyButton = (container) => createElement("button", "button", "Играть!", container, playAgain);

const renderMoveButtons = (container) => {
    const buttonRock = createElement("button", "button", "Камень", container, makeMove);
    const buttonPaper = createElement("button", "button", "Бумага", container, makeMove);
    const buttonScissors = createElement("button", "button", "Ножницы", container, makeMove);
    buttonRock.value = "rock";
    buttonPaper.value = "paper";
    buttonScissors.value = "scissors";
    setTimerUseApi(500, () => useApi(statusGameURL, getStatusGame));
};

const renderPlayerList = (container) => {
    createElement("h2", "playerLIstTitle", "Игроки в сети:", container);
    createElement("ul", "playerList", "проверяем кто в игре...", container);
    setTimerUseApi(1000, () => useApi(playerListURL, getPlayerList));
};

const renderWaitingOpponent = (container) => {
    setTimerUseApi(500, () => useApi(statusGameURL, getStatusGame));
    createElement("h2", "title", "Ожидаем подключение соперника ...", container);
};
const renderWaitingEnemyMove = (container) => {
    setTimerUseApi(500, () => useApi(statusGameURL, getStatusGame));
    createElement("h2", "title", "Ожидаем ход соперника ...", container);
};

//сборщики экранов из блоков
const renderLobbyScreen = () => {
    window.application.renderBlock("lobbyTitle", app);
    window.application.renderBlock("playerList", app);
    window.application.renderBlock("lobbyButton", app);
};

const renderWaitingStartScreen = () => {
    window.application.renderBlock("gameTitle", app);
    window.application.renderBlock("waitingOpponent", app);
};

const renderLoginScreen = () => {
    window.application.renderBlock("loginTitle", app);
    window.application.renderBlock("loginInput", app);
    window.application.renderBlock("loginButton", app);
};

const renderMoveScreen = () => {
    window.application.renderBlock("gameTitle", app);
    window.application.renderBlock("gameVersus", app);
    window.application.renderBlock("moveButtons", app);
};

const renderWaitingEnemyMoveScreen = () => {
    window.application.renderBlock("gameTitle", app);
    window.application.renderBlock("gameVersus", app);
    window.application.renderBlock("waitingEnemyMove", app);
};

const renderWinScreen = () => {
    window.application.renderBlock("gameTitle", app);
    window.application.renderBlock("gameVersus", app);
    window.application.renderBlock("gameWin", app);
    window.application.renderBlock("againButton", app);
    window.application.renderBlock("toLobbyButton", app);
};

const renderLoseScreen = () => {
    window.application.renderBlock("gameTitle", app);
    window.application.renderBlock("gameVersus", app);
    window.application.renderBlock("gameLose", app);
    window.application.renderBlock("againButton", app);
    window.application.renderBlock("toLobbyButton", app);
};
//блоки
block["gameTitle"] = renderGameTitle;
block["gameVersus"] = renderGameVersus;
block["moveButtons"] = renderMoveButtons;
block["loginButton"] = renderLoginButton;
block["againButton"] = renderAgainButton;
block["toLobbyButton"] = renderToLobbynButton;
block["waitingOpponent"] = renderWaitingOpponent;
block["lobbyButton"] = renderLobbyButton;
block["playerList"] = renderPlayerList;
block["loginInput"] = renderLoginInput;
block["loginTitle"] = renderLoginTitle;
block["lobbyTitle"] = renderLobbyTitle;
block["waitingEnemyMove"] = renderWaitingEnemyMove;
block["gameWin"] = renderGameWin;
block["gameLose"] = renderGameLose;
//экраны
screen["login"] = renderLoginScreen;
screen["lobby"] = renderLobbyScreen;
screen["move"] = renderMoveScreen;
screen["waitingEnemyMove"] = renderWaitingEnemyMoveScreen;
screen["waitingStart"] = renderWaitingStartScreen;
screen["move"] = renderMoveScreen;
screen["win"] = renderWinScreen;
screen["lose"] = renderLoseScreen;

//стартовый рендер
window.application.renderScreen("login");
