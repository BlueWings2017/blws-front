const DOMAIN = "/api/";
const INIT_URL_STATE = {

};

export const state = () => Object.assign({}, INIT_URL_STATE);

export const actions = {
  addInx({}, payload) {
    return payload.map((item, i) => ({ ...item, idx: i }));
  },
};
