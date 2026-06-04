const getInitialDarkMode = () => {
    try {
        const savedTheme = localStorage.getItem('darkMode');
        return savedTheme === 'true';
    } catch (error) {
        console.warn('No se pudo acceder a localStorage:', error);
        return false;
    }
};

const state = {
    darkMode: getInitialDarkMode()
};

const getters = {
    isDarkMode: state => state.darkMode
};

const syncDarkClass = (isDark) => {
    if (isDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

const mutations = {
    TOGGLE_DARK_MODE(state) {
        state.darkMode = !state.darkMode;
        syncDarkClass(state.darkMode);
        try {
            localStorage.setItem('darkMode', state.darkMode);
        } catch (error) {
            console.warn('No se pudo guardar el tema en localStorage:', error);
        }
    },
    SET_DARK_MODE(state, value) {
        state.darkMode = value;
        syncDarkClass(state.darkMode);
        try {
            localStorage.setItem('darkMode', value);
        } catch (error) {
            console.warn('No se pudo guardar el tema en localStorage:', error);
        }
    }
};

const actions = {
    toggleDarkMode({ commit }) {
        commit('TOGGLE_DARK_MODE');
    },
    setDarkMode({ commit }, value) {
        commit('SET_DARK_MODE', value);
    },
    initializeTheme({ commit, state }) {
        try {
            const savedTheme = localStorage.getItem('darkMode');
            if (savedTheme !== null) {
                commit('SET_DARK_MODE', savedTheme === 'true');
            } else {
                syncDarkClass(state.darkMode);
            }
        } catch (error) {
            console.warn('No se pudo inicializar el tema desde localStorage:', error);
        }
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
