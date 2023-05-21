import http from "../http-common";

const getAll = (page, size, name) => {
  if (name) {
    return http.get(`/cities?page=${page}&size=${size}&name=${name}`);
  } else {
    return http.get(`/cities?page=${page}&size=${size}`);
  }
};

const update = (uuid, data) => {
  return http.put(`/cities/${uuid}`, data, {
    auth: {
      username: "admin",
      password: "admin",
    },
  });
};

const CityService = {
  getAll,
  update,
};

export default CityService;
