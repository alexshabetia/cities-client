import CityService from "./CityService";

const http = require("../http-common");

jest.mock("../http-common");

http.default.get = jest.fn();

http.default.put = jest.fn();

describe("getAll", () => {
  describe("when API call is successful", () => {
    it("should return cities list", async () => {
      const page = 0;
      const size = 10;
      const response = {
        totalPages: 1,
        totalElements: 1,
        cities: [
          {
            uuid: "a4fb4ff5-bd2c-46a2-995a-27cfd35f058e",
            name: "City name",
            photo: "https://photo-link.jpg",
          },
        ],
      };
      http.default.get.mockResolvedValue(response);

      const result = await CityService.getAll(page, size, null);

      expect(http.default.get).toHaveBeenCalledWith(
        `/cities?page=${page}&size=${size}`
      );
      expect(result).toEqual(response);
    });
  });
});

describe("update", () => {
  describe("when API call is successful", () => {
    it("should return updated city", async () => {
      const uuid = "79e99d52-9cbe-4d1c-b3d7-4fb4145a5fe2";
      const request = {
        name: "City name",
        photo: "https://photo-link.jpg",
      };
      const response = {
        uuid: "79e99d52-9cbe-4d1c-b3d7-4fb4145a5fe2",
        name: "City name",
        photo: "https://photo-link.jpg",
      };
      const authConfig = { auth: { password: "admin", username: "admin" } };
      http.default.put.mockResolvedValue(response);

      const result = await CityService.update(uuid, request);

      expect(http.default.put).toHaveBeenCalledWith(
        "/cities/" + uuid,
        request,
        authConfig
      );
      expect(result).toEqual(response);
    });
  });
});
