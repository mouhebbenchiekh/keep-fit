const Reducer = (state, action) => {
    switch (action.type) {
        case 'REGISTER_USER':
            return {
                ...state,
                user: action.payload
            };
        case 'ATHENTIFICATE_USER':
            return {
                ...state,
                user: action.payload
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