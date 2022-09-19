window.application = {
    playerList: [],
    blocks: {},
    screens: {},
    renderScreen: (screen) => {
        if (window.application.currentScreen === screen) {
            return;
        }
        clearElement(app);
        window.application.timers.forEach((timer) => {
            clearInterval(timer);
        });

        window.application.currentScreen = screen;

        window.application.screens[screen]();
    },
    renderBlock: (blockName, container) => block[blockName](container),
    timers: [],
};
