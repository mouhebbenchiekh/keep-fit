const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET_POSTS':
            return {
                ...state,
                user: action.payload
            };
        case 'ADD_POST':
            return {
                ...state,
                user: state.user.concat(action.payload)
            };
        case 'REMOVE_POST':
            return {
                ...state,
                user: state.user.filter(post => post.id !== action.payload)
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
};

export default Reducer;